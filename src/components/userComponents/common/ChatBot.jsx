import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useChatStore from "../../../store/useChatStore";
import useChatSocket from "../../../hooks/useChatSocket";
import ChatMessage from "./ChatMessage";

const ChatBot = () => {
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);
    const { messages, isOpen, isConnected, isTyping, toggleChat, closeChat } =
        useChatStore();
    const { sendMessage } = useChatSocket();

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log("messages", messages);
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && isConnected) {
            sendMessage(inputMessage.trim());
            setInputMessage("");
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <motion.button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.svg
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </motion.svg>
                    )}
                </AnimatePresence>

                {/* Notification Badge (for unread messages - can be implemented later) */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                        !
                    </span>
                )}
            </motion.button>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">
                                        Jazzup Assistant
                                    </h3>
                                    <p className="text-xs text-white/80 flex items-center">
                                        <span
                                            className={`w-2 h-2 rounded-full mr-1.5 ${isConnected ? "bg-green-400" : "bg-red-400"
                                                }`}
                                        ></span>
                                        {isConnected ? "Online" : "Connecting..."}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeChat}
                                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-purple-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        Welcome to Jazzup! 👋
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        I'm here to help you find the perfect outfit. Ask me about
                                        our products, styles, or anything else!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <ChatMessage key={msg.id} message={msg} />
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start mb-4"
                                        >
                                            <div className="flex items-end">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-white"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                                                    <div className="flex space-x-1.5">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.2s" }}
                                                        ></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.4s" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSend}
                            className="border-t border-gray-200 p-4 bg-white"
                        >
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder={
                                        isConnected
                                            ? "Type your message..."
                                            : "Connecting to chat..."
                                    }
                                    disabled={!isConnected}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim() || !isConnected}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
