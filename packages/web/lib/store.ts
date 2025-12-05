import { create } from "zustand";
import { GameState } from "server";

interface GameStore extends GameState {
  setStateFromServer: (s: GameState) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  dice: {},
  setStateFromServer: (state) => set(state),
}));
