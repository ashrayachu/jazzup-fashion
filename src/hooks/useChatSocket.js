import { useEffect, useRef } from "react";
import { getSocket } from "../utils/socket";
import useChatStore from "../store/useChatStore";

const useChatSocket = () => {
    const socketRef = useRef(null);
    const {
        addMessage,
        setConnected,
        setTyping,
        setSessionId,
        sessionId,
    } = useChatStore();

    useEffect(() => {
        // Initialize socket
        socketRef.current = getSocket();
        const socket = socketRef.current;

        // Connect socket when chat is initialized
        socket.connect();

        // Connection event handlers
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            setConnected(true);
            setSessionId(socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setConnected(false);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setConnected(false);
        });

        // Listen for bot messages
        socket.on("bot_message", (data) => {
            setTyping(false);
            addMessage({
                id: Date.now(),
                text: data.message,
                sender: "bot",
                timestamp: new Date().toISOString(),
            });
        });

        // Listen for typing indicator
        socket.on("bot_typing", () => {
            setTyping(true);
        });

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.off("connect");
                socket.off("disconnect");
                socket.off("connect_error");
                socket.off("bot_message");
                socket.off("bot_typing");
            }
        };
    }, [addMessage, setConnected, setTyping, setSessionId]);

    const sendMessage = (message) => {
        const socket = socketRef.current;
        if (socket && socket.connected) {
            // Add user message to chat immediately
            const userMessage = {
                id: Date.now(),
                text: message,
                sender: "user",
                timestamp: new Date().toISOString(),
            };
            addMessage(userMessage);

            // Send to server
            socket.emit("user_message", {
                message,
                sessionId,
                timestamp: new Date().toISOString(),
            });

            // Show typing indicator
            setTyping(true);
        } else {
            console.error("Socket not connected");
            addMessage({
                id: Date.now(),
                text: "Connection lost. Please refresh the page.",
                sender: "bot",
                timestamp: new Date().toISOString(),
                error: true,
            });
        }
    };

    return { sendMessage };
};

export default useChatSocket;
