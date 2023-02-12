import { type RequestEvent } from "@builder.io/qwik-city";
import { getMoveOutcomes } from "../../../../game-engine/functions";

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();

    //in future will trim board first for performance, but fine for now
    const outcomes = getMoveOutcomes(game.board);
    const livingOutComesWithTotalLivingSnakeCounts = [];
    outcomes.forEach(outcome => {
        if (outcome.statuses[game.you.id].alive === false) { return; }

        let livingSnakeCount = 0;
        for (const id in outcome.statuses) {
            if (outcome.statuses[id].alive) { livingSnakeCount++; }
        }
        livingOutComesWithTotalLivingSnakeCounts.push({ ...outcome, livingSnakeCount });
    });
    console.log(livingOutComesWithTotalLivingSnakeCounts)
    const livingOutcomes = outcomes.filter(outcome => outcome.statuses[game.you.id].alive);
    // const counts = outcomes.filter(outcome => outcome.gameBoard.snakes.length);
    const nonDeathMoves = livingOutcomes.sort((a, b) => Object.keys(b).length - Object.keys(a).length)
        .map(outcome => {
            return outcome.gameBoard.snakes.find(snake => snake.id === game.you.id)!.lastMoved
        })
    const nonDeathMoveCount: Record<Direction, number> = {
        "down": 0,
        "up": 0,
        "left": 0,
        "right": 0
    };
    nonDeathMoves.forEach(move => { nonDeathMoveCount[move] += 1; });
    console.log({ turn: game.turn, moveStillAliveCount: nonDeathMoveCount });
    const bestLifeChance = Math.max(...Object.values(nonDeathMoveCount));
    const bestMoves = Object.keys(nonDeathMoveCount).filter(move => nonDeathMoveCount[move as Direction] === bestLifeChance);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

