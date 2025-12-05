import { initTRPC } from "@trpc/server";
import { lobby } from "./lobby"; // implémentation simple d'un lobby en mémoire
import { GameRoomJoined, createRoomSchema, joinRoomSchema } from "./schema";
import { game } from "./game";

const t = initTRPC.create();

export const appRouter = t.router({
  listRooms: t.procedure.query(() => {
    return lobby.getRooms();
  }),

  createRoom: t.procedure.input(createRoomSchema).mutation(({ input }) => {
    const room = lobby.createRoom(input.name);
    game.createGame(room.id, input.name);
    // notify via socket.io (globalThis.io est renseigné dans server.ts)
    globalThis.io?.emit("lobby:updated", lobby.getRooms());
    return room;
  }),

  joinRoom: t.procedure
    .input(joinRoomSchema)
    .mutation<GameRoomJoined>(({ input }) => {
      const room = lobby.joinRoom(input.roomId, input.playerName);
      if (!room) throw new Error("Room not found");
      game.joinGame(input.roomId, input.playerName);
      // notify both lobby and room
      globalThis.io?.emit("lobby:updated", lobby.getRooms());
      globalThis.io
        ?.to(input.roomId)
        .emit("room:joined", { room, playerName: input.playerName });

      globalThis.io
        ?.to(input.roomId)
        .emit("server:state", game.getState(input.roomId));
      return { room, playerName: input.playerName };
    }),
  getRoomById: t.procedure
    .input(joinRoomSchema.pick({ roomId: true }))
    .query(({ input }) => {
      const room = lobby.getById(input.roomId);
      if (!room) throw new Error("Room not found");
      return room;
    }),
  getGameState: t.procedure
    .input(joinRoomSchema.pick({ roomId: true }))
    .query(({ input }) => {
      const state = game.getState(input.roomId);
      return state;
    }),
});

export type AppRouter = typeof appRouter;
