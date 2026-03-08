import { create } from "zustand";

const useChatStore = create((set) => ({
    messages: [],
    isOpen: false,
    isConnected: false,
    isTyping: false,
    sessionId: null,

    // Actions
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setMessages: (messages) => set({ messages }),

    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

    openChat: () => set({ isOpen: true }),

    closeChat: () => set({ isOpen: false }),

    setTyping: (isTyping) => set({ isTyping }),

    setConnected: (isConnected) => set({ isConnected }),

    setSessionId: (sessionId) => set({ sessionId }),

    clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;
