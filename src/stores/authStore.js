import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  authStatus: "checking",

  setUser: (user) =>
    set({
      user,
      isLoggedIn: Boolean(user),
      authStatus: user ? "authenticated" : "unauthenticated",
    }),
  setAuthError: () => set({ user: null, isLoggedIn: false, authStatus: "error" }),
  logout: () => set({ user: null, isLoggedIn: false, authStatus: "unauthenticated" }),
}));
