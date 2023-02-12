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

    //in future will trim board first for performance, but fine for now
    const outcomes = getMoveOutcomes(game.board);
    console.log({ outcomes });
    const nonDeathMoves = outcomes.filter(outcome => outcome.statuses[game.you.id].alive).map(outcome => {
        return outcome.gameBoard.snakes.find(snake => snake.id === game.you.id)!.lastMoved
    })
    console.log({ turn: game.turn, nonDeathMoves });
    const moveStillAliveCount: Record<Direction, number> = {
        "down": 0,
        "up": 0,
        "left": 0,
        "right": 0
    };
    nonDeathMoves.forEach(move => {
        moveStillAliveCount[move] += 1;
    });
    const bestLifeChance = Math.max(...Object.values(moveStillAliveCount));
    const bestMoves = Object.keys(moveStillAliveCount).filter(move => moveStillAliveCount[move as Direction] === bestLifeChance);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

