import { applyAction } from "./applyAction";
import { DiceState, GameState } from "./schema";

const states: Record<string, GameState> = {};

export const game = {
  getInitState() {
    let gameState: DiceState = {
      currentRoll: null,
      history: [],
    };
    return gameState;
  },

  createGame(roomId: string, name: string): GameState {
    const initialState: Record<string, DiceState> = {};
    initialState[name] = this.getInitState();
    states[roomId] = { dice: initialState };
    return states[roomId];
  },

  joinGame(roomId: string, playerName: string): GameState {
    const state = this.getState(roomId);
    state.dice[playerName] = this.getInitState();
    return state;
  },

  getState(roomId: string): GameState {
    return states[roomId];
  },

  applyAction(roomId: string, action: any): GameState {
    const currentState = this.getState(roomId);
    const newState = applyAction(currentState, action);
    states[roomId] = newState;
    return newState;
  },
};
