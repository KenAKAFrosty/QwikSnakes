import { type RequestEvent } from "@builder.io/qwik-city";
import type { Game, GameBoard, Snake, TrimmedBoard } from "~/game-engine/types";
import { getChosenMove } from "../../../../game-engine/functions";

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();

    const trimmedBoard = new Map<keyof TrimmedBoard, any>([
        ["width", game.board.width],
        ["height", game.board.height],
        ["food", game.board.food.map(food => [food.x, food.y])],
        ["hazards", game.board.hazards.map(hazard => [hazard.x, hazard.y])],
        ["snakes", game.board.snakes.map(snake => ({
            body: snake.body.map(bodyPart => [bodyPart.x, bodyPart.y]),
            id: snake.id,
            health: snake.health,
            squad: snake.squad
        }))]
    ])
    const mySnakeId = game.you.id;
    const chosenMove = getChosenMove(trimmedBoard, mySnakeId);
    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "I HAVE NO MOUTH BUT I MUST SCREAM"
    })))
}

