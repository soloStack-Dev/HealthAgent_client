import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react'
import { useMutation } from '@tanstack/react-query'
import { api, ApiError } from '../services/api'
import { useChatStore, type ChatMessage, type SymptomAnalysisResponse } from '../store/chatStore'

function generateId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getUrgencyColor(level?: string) {
  switch (level?.toLowerCase()) {
    case 'emergency': return 'urgency-critical'
    case 'high': return 'urgency-high'
    case 'medium': return 'urgency-medium'
    case 'low': return 'urgency-low'
    default: return 'urgency-none'
  }
}

function getConfidenceColor(level?: string) {
  switch (level) {
    case 'High': return 'conf-high'
    case 'Medium': return 'conf-medium'
    case 'Low': return 'conf-low'
    default: return ''
  }
}

export default function ChatPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const {
    messages, conversationId, isSending,
    addMessage, updateLastMessage, setConversationId, setSending,
  } = useChatStore()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in', { replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMutation = useMutation({
    mutationFn: async (description: string) => {
      return api.post<SymptomAnalysisResponse>(
        '/health/chat',
        { description, conversationId, userId: user?.id },
      )
    },
    onMutate: () => {
      setSending(true)
    },
    onSuccess: (data) => {
      updateLastMessage({
        role: 'assistant',
        content: data.analysis?.rawContent ?? 'Analysis complete.',
        analysis: data.analysis,
        healthTips: data.healthTips,
        resources: data.resources,
        urgencyLevel: data.urgencyLevel,
        disclaimer: data.disclaimer,
        isLoading: false,
        isError: false,
      })
      if (data.conversationId) {
        setConversationId(data.conversationId)
      }
      setSending(false)
    },
    onError: (err: Error) => {
      let message = err.message || 'Unable to process your request. Please try again.'
      if (err instanceof ApiError) {
        if (err.status === 0) {
          message = 'Cannot connect to the backend server. Please check your connection and try again.'
        } else {
          message = `${err.status === 401 ? 'Auth' : 'Server'} error (${err.status}): ${err.message}`
        }
      }
      updateLastMessage({
        content: message,
        isLoading: false,
        isError: true,
      })
      setSending(false)
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    addMessage(userMsg)

    const loadingMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      isLoading: true,
      createdAt: new Date().toISOString(),
    }
    addMessage(loadingMsg)

    setInput('')
    sendMutation.mutate(text)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function handleNewChat() {
    useChatStore.getState().clearMessages()
    setInput('')
    inputRef.current?.focus()
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-info">
            <h1>Health Consultation</h1>
            <p>Describe your symptoms for AI-powered analysis</p>
          </div>
          <button className="btn-new-chat" onClick={handleNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21.5C17.5 17 22 13 22 8.5c0-4-3.5-5.5-10 0C5.5 3 2 4.5 2 8.5c0 4.5 4.5 9 10 13z" />
                </svg>
              </div>
              <h3>Start a health consultation</h3>
              <p>Describe your symptoms in detail. For example:</p>
              <div className="suggestion-chips">
                {[
                  'I have a persistent headache for 3 days',
                  'My lower back hurts when I sit',
                  'Feeling feverish with sore throat',
                ].map((s) => (
                  <button
                    key={s}
                    className="suggestion-chip"
                    onClick={() => {
                      setInput(s)
                      inputRef.current?.focus()
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21.5C17.5 17 22 13 22 8.5c0-4-3.5-5.5-10 0C5.5 3 2 4.5 2 8.5c0 4.5 4.5 9 10 13z" />
                  </svg>
                )}
              </div>
              <div className="message-content">
                {msg.isLoading ? (
                  <div className="loading-dots">
                    <span /><span /><span />
                  </div>
                ) : msg.isError ? (
                  <div className="message-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    <div>
                      <strong>Request Failed</strong>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {msg.urgencyLevel && (
                      <div className={`urgency-badge ${getUrgencyColor(msg.urgencyLevel)}`}>
                        {msg.urgencyLevel === 'Emergency' ? '!' : ''}
                        {msg.urgencyLevel} Urgency
                      </div>
                    )}

                    <div className="message-text">{msg.content}</div>

                    {msg.analysis?.possibleConditions && msg.analysis.possibleConditions.length > 0 && (
                      <div className="analysis-section">
                        <h4>Possible Conditions</h4>
                        <div className="conditions-grid">
                          {msg.analysis.possibleConditions.map((c, i) => (
                            <div key={i} className={`condition-card ${getConfidenceColor(c.confidence)}`}>
                              <div className="condition-header">
                                <span className="condition-name">{c.name}</span>
                                <span className={`condition-confidence ${getConfidenceColor(c.confidence)}`}>
                                  {c.confidence}
                                </span>
                              </div>
                              <p className="condition-desc">{c.description}</p>
                              {c.matchingSymptoms.length > 0 && (
                                <div className="condition-symptoms">
                                  {c.matchingSymptoms.map((s, j) => (
                                    <span key={j} className="symptom-tag">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.analysis?.recommendedActions && msg.analysis.recommendedActions.length > 0 && (
                      <div className="analysis-section">
                        <h4>Recommended Actions</h4>
                        <ul className="action-list">
                          {msg.analysis.recommendedActions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.analysis?.questionsToAsk && msg.analysis.questionsToAsk.length > 0 && (
                      <div className="analysis-section">
                        <h4>Follow-up Questions</h4>
                        <ul className="question-list">
                          {msg.analysis.questionsToAsk.map((q, i) => (
                            <li key={i}>
                              <button className="question-btn" onClick={() => setInput(q)}>
                                {q}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.healthTips && msg.healthTips.length > 0 && (
                      <div className="analysis-section">
                        <h4>Health Tips</h4>
                        <ul className="tips-list">
                          {msg.healthTips.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.resources && msg.resources.length > 0 && (
                      <div className="analysis-section">
                        <h4>Medical Resources</h4>
                        <div className="resources-list">
                          {msg.resources.map((r, i) => (
                            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-card">
                              <div className="resource-title">{r.title}</div>
                              <div className="resource-meta">
                                <span className="resource-source">{r.source}</span>
                                <span className={`resource-relevance ${r.relevance.toLowerCase()}`}>{r.relevance}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.disclaimer && (
                      <div className="disclaimer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                        </svg>
                        {msg.disclaimer}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms..."
              rows={1}
              disabled={isSending}
            />
            <button
              type="submit"
              className="btn-send"
              disabled={!input.trim() || isSending}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="input-disclaimer">
            This is not a medical diagnosis. Always consult a healthcare professional.
          </p>
        </form>
      </div>
    </div>
  )
}
