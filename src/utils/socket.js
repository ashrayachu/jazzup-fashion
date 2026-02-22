import { io } from "socket.io-client";

// Initialize Socket.IO client - will connect to backend server
// Note: This will be used once backend Socket.IO server is ready
// Use a dedicated socket URL (must point to the server root, NOT /api)
// Socket.IO interprets any path after the host as a namespace, so /api would break it.
const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.VITE_REACT_APP_API_AXIOS || "http://localhost:5000").replace(/\/api\/?$/, "");

let socket = null;

export const initializeSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false, // We'll connect manually when chat is opened
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initializeSocket();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};
