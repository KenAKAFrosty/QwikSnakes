import { type RequestEvent } from "@builder.io/qwik-city";
import { getMoveOutcomes } from "../../../../game-engine/functions";

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();
    console.log(game.board);

    const mySnakeIndex = game.board.snakes.findIndex(snake => snake.id === game.you.id);

    //in future will trim board first for performance, but fine for now
    const outcomes = getMoveOutcomes(game.board);
    console.log({ outcomes });
    const nonDeathMoves = outcomes.filter(outcome => outcome.statuses[mySnakeIndex].alive).map(outcome => {
        return outcome.gameBoard.snakes.find(snake => snake.id === game.you.id)!.lastMove
    })
    console.log({ nonDeathMoves });
    const chosenMove = nonDeathMoves[Math.floor(Math.random() * nonDeathMoves.length)];

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

