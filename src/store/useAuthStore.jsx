// useAuthStore.js
import { create } from "zustand";
import { persist, createJSONStorage  } from "zustand/middleware";
// import { logout } from "../api/authApis";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      userType: null,
      accessToken: null,
      loading: false,
      error: null,

      loginCall: async (data) => {
        try {
          // Expecting: { message, token, user }
          const { token, user } = data;

          set({
            isAuthenticated: true,
            user,
            userType: user?.role || null,
            accessToken: token,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error("Login store error:", error);
          set({
            loading: false,
            error: "Something went wrong during login",
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
        }
      },

      logoutCall: async () => {
        try {
          await logout(); // optional API call to clear cookies/session

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            userType: null,
            loading: false,
            error: null,
          });
        } catch (error) {
          // Even if logout fails, reset local state
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            userType: null,
            loading: false,
            error: null,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // Changed from getStorage
    }
  )
);

export default useAuthStore;