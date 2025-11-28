import { Game } from "boardgame.io";

export interface Roll {
  name: string;
  faces: number;
  result: number;
}

export interface Rolls {
  playerID: string;
  rolls: Roll[];
}

export interface StormLightState {
  rolls: Rolls[];
}

export const StormLight: Game<StormLightState> = {
  setup: () => ({ rolls: [] }),
  minPlayers: 2,
  maxPlayers: 8,
  name: "StormLight",
  moves: {
    roll: ({ G, playerID, random }, dice: Roll[]) => {
      const rolls: Roll[] = [];
      for (const d of dice) {
        for (let i = 0; i < d.result; i++) {
          const result = random.Die(d.faces);
          rolls.push({ name: d.name, faces: d.faces, result });
        }
      }
      G.rolls.push({
        playerID,
        rolls: rolls,
      });
    },
  },
};
