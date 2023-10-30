import { create } from "zustand";

export const useAuthStore = create((set) => ({
  auth: {},
  setAuth: (user) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user,
      },
    })),
}));
