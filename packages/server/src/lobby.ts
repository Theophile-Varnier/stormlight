import { GameRoom } from "./schema";

const rooms: GameRoom[] = [];

const playerRooms: Record<string, string> = {};

export const socketRooms: Record<string, string> = {};

export const lobby = {
  getRooms(): GameRoom[] {
    return rooms;
  },

  getById(roomId: string): GameRoom | undefined {
    return rooms.find((r) => r.id === roomId);
  },

  createRoom(name: string): GameRoom {
    const room: GameRoom = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      name,
      players: [],
      createdAt: Date.now(),
    };
    rooms.push(room);
    return room;
  },

  joinRoom(roomId: string, playerName: string): GameRoom | null {
    const r = rooms.find((x) => x.id === roomId);
    if (!r) return null;
    if (!r.players.includes(playerName)) r.players.push(playerName);
    playerRooms[playerName] = roomId;
    return r;
  },
};
