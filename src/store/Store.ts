import { create, StoreApi } from "zustand";
import { StoreState } from "./Utils";

const Store = create<StoreState>((set: StoreApi<any>["setState"]) => ({
  token: sessionStorage.getItem("tokenAccess"),
  setToken: (token) => {
    if (token) {
      sessionStorage.setItem("tokenAccess", token);
    } else {
      sessionStorage.removeItem("tokenAccess");
    }
    set({ token });
  },
  removeToken: () => {
    sessionStorage.removeItem("tokenAccess");
    set({ token: null });
  },

  role: sessionStorage.getItem("role"),
  setRole: (role) => {
    if (role) {
      sessionStorage.setItem("role", role);
    } else {
      sessionStorage.removeItem("role");
    }
    set({ role });
  },

  id: sessionStorage.getItem("userId"),
  setId: (id) => {
    if (id) {
      sessionStorage.setItem("userId", id);
    } else {
      sessionStorage.removeItem("userId");
    }
    set({ id });
  },

  idKategori: sessionStorage.getItem("kategoriId"),
  setIdKategori: (id) => {
    if (id) {
      sessionStorage.setItem("kategoriId", id);
    } else {
      sessionStorage.removeItem("kategoriId");
    }
    set({ id });
  },
}));

export { Store };
