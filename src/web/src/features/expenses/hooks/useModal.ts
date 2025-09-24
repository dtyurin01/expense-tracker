import { create } from "zustand";

type Modal = "add-transaction" | null;

type ModalState = {
  modal: Modal;
  open: (m: Modal) => void;
  close: () => void;
};

export const useModal = create<ModalState>((set) => ({
  modal: null,
  open: (modal) => set({ modal }),
  close: () => set({ modal: null }),
}));
