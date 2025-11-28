import { Game, Ctx } from "boardgame.io";

export interface Roll {
  name: string;
  faces: number;
  result: number;
}

export interface PlayerState {
  lastRollTimestamp: number;
  lastRoll: Roll[];
}

export interface StormLightState {
  rolls: Record<string, PlayerState>;
  secret: {
    historical: Record<string, PlayerState[]>;
  };
}

export interface DefaultParameters {
  G: StormLightState;
  playerID: string;
}

export interface DefaultMoveParameters extends DefaultParameters {
  random: any;
}

export interface DefaultClientState extends DefaultParameters {
  moves: any;
  ctx: Ctx;
  matchID: string;
}

const roll = ({ G, playerID, random }: DefaultMoveParameters, dice: Roll[]) => {
  const rolls: Roll[] = [];
  for (const d of dice) {
    for (let i = 0; i < d.result; i++) {
      const result = random.Die(d.faces);
      rolls.push({ name: d.name, faces: d.faces, result });
    }
  }
  G.rolls[playerID] = {
    lastRoll: rolls,
    lastRollTimestamp: new Date().getTime(),
  };
  if (!(playerID in G.secret.historical)) {
    G.secret.historical[playerID] = [];
  }
  G.secret.historical[playerID].push(G.rolls[playerID]);
};

export const StormLight: Game<StormLightState> = {
  setup: () => ({ rolls: {}, secret: { historical: {} } }),
  minPlayers: 2,
  maxPlayers: 8,
  name: "StormLight",
  phases: {
    default: {
      start: true,
      turn: {
        activePlayers: {
          all: true,
        },
      },
    },
  },
  moves: {
    roll: {
      move: roll,
      client: false,
    },
  },
  playerView: ({ G }) => {
    const { secret, ...res } = G;
    return res;
  },
};
