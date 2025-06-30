import { create } from "zustand";

/**
 * PUBLIC_INTERFACE
 * Zustand store for controlling the open state of the graph modal.
 */
type GraphModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useGraphModal = create<GraphModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
