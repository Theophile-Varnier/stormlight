import { GameState, DiceRoll, Dice } from "./schema";

interface DiceAction {
  type: "ROLL_DICE";
  payload: Dice[];
  playerId: string;
}

type Action = DiceAction;

export function applyAction(state: GameState, action: Action): GameState {
  if (action.type === "ROLL_DICE") {
    const results: number[] = [];
    let total = 0;

    for (const { count, faces } of action.payload) {
      const rollResults = Array.from(
        { length: count },
        () => Math.floor(Math.random() * faces) + 1
      );
      results.push(...rollResults);
      total += rollResults.reduce((a, b) => a + b, 0);
    }

    const roll: DiceRoll = {
      id: Date.now().toString(),
      roller: action.playerId,
      dice: action.payload,
      results,
      total,
      seed: Math.floor(Math.random() * 999999),
      timestamp: Date.now(),
    };
    const res = { ...state };
    res.dice[action.playerId] = {
      currentRoll: roll,
      history: [roll, ...(state.dice[action.playerId]?.history || [])],
    };
    return res;
  }

  return state;
}
