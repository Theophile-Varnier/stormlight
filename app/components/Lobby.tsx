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
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

export function Lobby() {
  const router = useRouter();
  const [instances, setInstances] = useState<LobbyAPI.MatchList | undefined>(
    undefined
  );
  const [game, setGame] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [numPlayers, setNumPlayers] = useState<string | number>(4);
  const [playerName, setPlayerName] = useState<string>("");
  const lobbyClient = new LobbyClient({ server: "http://localhost:8000" });

  async function refreshGames() {
    setLoading(true);
    lobbyClient.listGames().then((games) => {
      setGame(games[0]);
      lobbyClient.listMatches(games[0]).then((matches) => {
        setInstances(matches);
        setLoading(false);
      });
    });
  }

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
        {instances?.matches.map((match) => (
          <Table.Tr
            key={match.matchID}
            onDoubleClick={() => joinGame(match.matchID)}
          >
            <Table.Td>{match.matchID}</Table.Td>
            <Table.Td>{`${match.players.filter((p) => p.name).length}/${
              match.players.length
            }`}</Table.Td>
            <Table.Td>{new Date(match.createdAt).toLocaleString()}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  async function joinGame(matchID: string) {
    lobbyClient
      .joinMatch(game, matchID, {
        playerName: playerName,
      })
      .then((player) => {
        const gameInfo = {
          playerID: player.playerID,
          credentials: player.playerCredentials,
          matchID: matchID,
        };
        localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
        router.push(`/game`);
      });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    lobbyClient
      .createMatch(game, {
        numPlayers: parseInt(numPlayers.toString()),
      })
      .then(() => {
        refreshGames();
      });
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
