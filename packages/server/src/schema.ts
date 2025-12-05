import { z } from "zod";

export const diceSchema = z.object({
  count: z.number(),
  name: z.string(),
  faces: z.number(),
});

export type Dice = z.infer<typeof diceSchema>;

export const diceRollSchema = z.object({
  id: z.string(),
  roller: z.string(),
  dice: z.array(diceSchema),
  results: z.array(z.number()),
  total: z.number(),
  seed: z.number(),
  timestamp: z.number(),
});

export type DiceRoll = z.infer<typeof diceRollSchema>;

export const diceStateSchema = z.object({
  currentRoll: diceRollSchema.nullable(),
  history: z.array(diceRollSchema),
});

export type DiceState = z.infer<typeof diceStateSchema>;

export const gameStateSchema = z.object({
  dice: z.record(z.string(), diceStateSchema),
});

export type GameState = z.infer<typeof gameStateSchema>;

export const createRoomSchema = z.object({
  name: z.string().min(1),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomId: z.string(),
  playerName: z.string(),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;

export const gameRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  players: z.array(z.string()),
  createdAt: z.number(),
});

export type GameRoom = z.infer<typeof gameRoomSchema>;

export const gameRoomJoinedSchema = z.object({
  room: gameRoomSchema,
  playerName: z.string(),
});

export type GameRoomJoined = z.infer<typeof gameRoomJoinedSchema>;
