import { type RequestEvent } from "@builder.io/qwik-city"
import { moveSnake, resolveBoardAndGetSnakeStatuses } from "../../../../game-engine/functions"

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();
    console.log(game);

    const mySnakeIndex = game.board.snakes.findIndex(snake => snake.id === game.you.id);

    const leftScenario = JSON.parse(JSON.stringify(game.board));
    const rightScenario = JSON.parse(JSON.stringify(game.board));
    const upScenario = JSON.parse(JSON.stringify(game.board));
    const downScenario = JSON.parse(JSON.stringify(game.board));

    moveSnake(leftScenario.snakes[mySnakeIndex], "left");
    moveSnake(rightScenario.snakes[mySnakeIndex], "right");
    moveSnake(upScenario.snakes[mySnakeIndex], "up");
    moveSnake(downScenario.snakes[mySnakeIndex], "down");

    const leftStatuses = resolveBoardAndGetSnakeStatuses(leftScenario);
    const rightStatuses = resolveBoardAndGetSnakeStatuses(rightScenario);
    const upStatuses = resolveBoardAndGetSnakeStatuses(upScenario);
    const downStatuses = resolveBoardAndGetSnakeStatuses(downScenario);

    console.log({ 
        leftStatuses,
        rightStatuses,
        upStatuses,
        downStatuses
        
    })

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: "up",
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

