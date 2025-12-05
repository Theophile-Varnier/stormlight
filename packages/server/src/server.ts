import { Server } from "socket.io";
import { GameState } from "./schema";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./trpcRouter";
import { game } from "./game";
import { socketRooms } from "./lobby";
import cors from "cors";

const handler = createHTTPServer({
  router: appRouter,
  createContext: () => ({}),
  middleware: cors(),
});

const io = new Server(handler, {
  cors: { origin: "*" },
});

globalThis.io = io as any;

io.on("connection", (socket) => {
  socket.on("client:action", (action) => {
    const roomId = socketRooms[socket.id];
    if (!roomId) return;
    let gameState: GameState = game.getState(roomId);
    gameState = game.applyAction(roomId, action);
    io.to(roomId).emit("server:state", gameState);
  });

  socket.on("room:join", ({ roomId }) => {
    socketRooms[socket.id] = roomId;
    socket.join(roomId);
  });
});

const PORT = Number(process.env.PORT || 4000);

// handler.start returns the underlying http server; we pass our existing one
handler.listen(PORT);
