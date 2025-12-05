"use client";
import {
  ActionIcon,
  Button,
  Container,
  NumberInput,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { trpc } from "@/lib/trpc";
import { socket } from "@/lib/socket";
import { GameRoom, GameRoomJoined } from "server";

export default function Lobby() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [numPlayers, setNumPlayers] = useState<string | number>(4);
  const [playerName, setPlayerName] = useState<string>("");

  async function refreshGames() {
    setLoading(true);
    const r = await trpc.listRooms.query();
    setRooms(r);
    setLoading(false);
  }
  // initial fetch
  useEffect(() => {
    (async () => {
      refreshGames();
    })();
  }, []);

  // subscribe to lobby updates via socket.io
  useEffect(() => {
    socket.on("lobby:updated", (r) => setRooms(r));
    return () => {
      socket.off("lobby:updated");
    };
  }, []);

  const createRoom = async () => {
    await trpc.createRoom.mutate({ name: playerName });
  };

  function savePlayerName(value: string) {
    setPlayerName(value);
    localStorage.setItem("playerName", value);
  }

  useEffect(() => {
    setTimeout(() => {
      refreshGames();
      setPlayerName(localStorage.getItem("playerName") || "");
    }, 10);
  }, []);

  const gameTable = loading ? (
    <p>Loading...</p>
  ) : (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Game</Table.Th>
          <Table.Th>Players</Table.Th>
          <Table.Th>Created</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rooms.map((match) => (
          <Table.Tr key={match.id} onDoubleClick={() => joinGame(match.id)}>
            <Table.Td>{match.name}</Table.Td>
            <Table.Td>{match.players.length}</Table.Td>
            <Table.Td>{new Date(match.createdAt).toLocaleString()}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  async function joinGame(matchID: string) {
    trpc.joinRoom
      .mutate({ roomId: matchID, playerName: playerName })
      .then((info: GameRoomJoined) => {
        const gameInfo = {
          playerName: info.playerName,
          matchID: matchID,
        };
        localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
        router.push(`/game`);
      });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createRoom();
  }

  return (
    <Container>
      <Stack align="flex-start">
        <Title order={1}>StormLight</Title>
        <TextInput
          label="Player name"
          value={playerName}
          onChange={(event) => savePlayerName(event.currentTarget.value)}
        ></TextInput>
        <ActionIcon
          onClick={refreshGames}
          variant="filled"
          aria-label="Refresh"
        >
          <FiRefreshCw />
        </ActionIcon>
        {gameTable}
        <Title order={1}>Create new game</Title>
        <form onSubmit={onSubmit}>
          <Stack align="flex-start">
            <NumberInput
              label="Number of players"
              value={numPlayers}
              onChange={setNumPlayers}
              allowDecimal={false}
              min={1}
              max={8}
            />
            <Button type="submit" variant={"default"}>
              Create Game
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
