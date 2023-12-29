import { create } from "zustand";

// sturture: auth: {role: ..., accessToken: ..., {user: ....}}

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
