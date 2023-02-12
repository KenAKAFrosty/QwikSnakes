import { type RequestEvent } from "@builder.io/qwik-city"
import { getBackwardsDirection, moveSnake, resolveBoardAndGetSnakeStatuses } from "../../../../game-engine/functions"

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();
    console.log(game.board);

    const mySnakeIndex = game.board.snakes.findIndex(snake => snake.id === game.you.id);
    const nonDeathMoves = [];
    const backwardsDirection = getBackwardsDirection(game.you);
    for (const move of ["left", "right", "up", "down"] as const) {
        if (move === backwardsDirection) { continue; }
        const scenario = JSON.parse(JSON.stringify(game.board));
        moveSnake(scenario.snakes[mySnakeIndex], move);
        const statuses = resolveBoardAndGetSnakeStatuses(scenario);
        if (statuses[game.you.id].alive === true) {
            nonDeathMoves.push(move);
        }
    }

    console.log(nonDeathMoves);
    const chosenMove = nonDeathMoves[Math.floor(Math.random() * nonDeathMoves.length)];

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

