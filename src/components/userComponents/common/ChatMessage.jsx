import React from "react";
import { motion } from "framer-motion";

const ChatMessage = ({ message, products }) => {
    const isBot = message.sender === "bot";
    const isError = message.error;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
        >
            <div className={`flex ${isBot ? "flex-row" : "flex-row-reverse"} items-end max-w-[70%]`}>
                {/* Avatar */}
                {isBot && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2">
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
                )}

                {/* Message bubble */}
                <div>
                    <div
                        className={`px-4 py-2.5 rounded-2xl ${isBot
                            ? isError
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            } ${isBot
                                ? "rounded-bl-none"
                                : "rounded-br-none"
                            } shadow-sm`}
                    >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                        </p>

                        {/* Product cards (if any) */}
                        {products && products.length > 0 && (
                            <div className="product-cards">
                                {products.map((product) => (
                                    <a
                                        key={product._id || product.url}
                                        href={product.url}
                                        className="product-card"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {product.hasImage && product.image && (
                                            <img src={product.image} alt={product.name} />
                                        )}
                                        <h4>{product.name}</h4>
                                        <p className="brand">{product.brand}</p>
                                        <p className="price">₹{product.price}</p>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <p
                        className={`text-xs text-gray-400 mt-1 ${isBot ? "text-left" : "text-right"
                            }`}
                    >
                        {formatTime(message.timestamp)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
