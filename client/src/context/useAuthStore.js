// MODULES //
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  auth: {},
  setAuth: ({ data }) =>
    set((state) => ({
      auth: {
        ...state.auth,
        data,
      },
    })),
}));
