import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserMode = "customer" | "admin";

interface ModeState {
	mode: UserMode;
	setMode: (mode: UserMode) => void;
	toggleMode: () => void;
	resetToCustomer: () => void;
}

export const useModeStore = create<ModeState>()(
	persist(
		(set) => ({
			mode: "customer", // Default mode
			setMode: (mode: UserMode) => set({ mode }),
			toggleMode: () =>
				set((state) => ({
					mode: state.mode === "customer" ? "admin" : "customer",
				})),
			resetToCustomer: () => set({ mode: "customer" }),
		}),
		{
			name: "user-mode-storage", // localStorage key
		},
	),
);
