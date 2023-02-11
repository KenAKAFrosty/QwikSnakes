import { type RequestEvent } from "@builder.io/qwik-city"
import { moveSnake, resolveBoardAndGetSnakeStatuses } from "../../../../game-engine/functions"

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();
    console.log(game.turn);

    const mySnakeIndex = game.board.snakes.findIndex(snake => snake.id === game.you.id);
    const nonDeathMoves = [];
    for (const move of ["left", "right", "up", "down"] as const) {
        const scenario = JSON.parse(JSON.stringify(game.board));
        moveSnake(scenario.snakes[mySnakeIndex], move);
        const statuses = resolveBoardAndGetSnakeStatuses(scenario);
        if (statuses[game.you.id].alive === true) {
            nonDeathMoves.push(move);
        }
    }

    console.log(nonDeathMoves)

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: "up",
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

