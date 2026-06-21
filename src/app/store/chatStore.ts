import { create } from 'zustand'

export interface PossibleCondition {
  name: string
  confidence: 'Low' | 'Medium' | 'High'
  description: string
  matchingSymptoms: string[]
}

export interface MedicalResource {
  title: string
  url: string
  source: string
  description?: string
  relevance: 'High' | 'Medium' | 'Low'
}

export interface ParsedAgentResponse {
  possibleConditions?: PossibleCondition[]
  urgencyLevel?: string
  recommendedActions?: string[]
  questionsToAsk?: string[]
  rawContent?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  analysis?: ParsedAgentResponse
  healthTips?: string[]
  resources?: MedicalResource[]
  urgencyLevel?: string
  disclaimer?: string
  isLoading?: boolean
  isError?: boolean
  createdAt: string
}

interface ChatState {
  messages: ChatMessage[]
  conversationId: string | null
  isSending: boolean
  addMessage: (message: ChatMessage) => void
  updateLastMessage: (updates: Partial<ChatMessage>) => void
  setConversationId: (id: string | null) => void
  setSending: (sending: boolean) => void
  clearMessages: () => void
}

export interface SymptomAnalysisResponse {
  conversationId: string
  analysis?: ParsedAgentResponse
  healthTips: string[]
  resources: MedicalResource[]
  urgencyLevel: string
  disclaimer: string
  modelUsed?: string
  processingTimeMs: number
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  conversationId: null,
  isSending: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (updates) =>
    set((state) => {
      const msgs = [...state.messages]
      const lastIdx = msgs.length - 1
      if (lastIdx >= 0) {
        msgs[lastIdx] = { ...msgs[lastIdx], ...updates }
      }
      return { messages: msgs }
    }),
  setConversationId: (id) => set({ conversationId: id }),
  setSending: (sending) => set({ isSending: sending }),
  clearMessages: () =>
    set({ messages: [], conversationId: null }),
}))
