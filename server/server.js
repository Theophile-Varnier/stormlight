// src/server.js
const bgioPkg = require("boardgame.io/server");
const { Server, Origins, FlatFile } = bgioPkg.default ?? bgioPkg;

const stormPkg = require("../dist/app/game/StormLight");
const { StormLight } = stormPkg.default ?? stormPkg;

// console.log(`My game is ${StormLight}`);

const server = Server({
  games: [StormLight],
  origins: [Origins.LOCALHOST],
  // db: new FlatFile({
  //   dir: "./db",
  // }),
});

server.run(8000);
