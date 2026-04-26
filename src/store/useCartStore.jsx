import { create } from "zustand";

const useCartStore = create((set) => ({
  itemCount: 0,

  setItemCount: (itemCount) => set({ itemCount }),
}));

export default useCartStore;
