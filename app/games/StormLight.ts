import { Game } from "boardgame.io";

export interface StormLightState {
  nextRoll: string | undefined;
}

export const StormLight: Game<StormLightState> = {
  setup: () => ({ nextRoll: undefined }),

  moves: {
    roll: ({ G, playerID }, roll) => {
      G.nextRoll = roll;
    },
  },
};
