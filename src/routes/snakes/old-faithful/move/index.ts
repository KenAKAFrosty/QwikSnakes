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

    const mySnakeId = game.you.id;
    const moveOutcomes: Record<string, { enemiesAlive: number, mySnakeAlive: number }> = {};
    outcomes.forEach(outcome => {
        let enemiesAlive = 0;
        let mySnakeAlive = 0;
        for (const id in outcome.statuses) {
            const isAlive = outcome.statuses[id].alive;
            if (isAlive === false) { continue; }
            if (id === mySnakeId) { mySnakeAlive++; }
            else { enemiesAlive++; }
        }
        const direction = outcome.gameBoard.snakes.find(snake => snake.id === mySnakeId)!.lastMoved;
        moveOutcomes[direction] = moveOutcomes[direction] || { enemiesAlive: 0, mySnakeAlive: 0 };
        moveOutcomes[direction].enemiesAlive += enemiesAlive;
        moveOutcomes[direction].mySnakeAlive += mySnakeAlive;
    });

    const maxMySnakeAlive = Math.max(...Object.values(moveOutcomes).map(move => move.mySnakeAlive));
    const stayAliveChoices = [];
    for (const direction in moveOutcomes) {
        if (moveOutcomes[direction].mySnakeAlive === maxMySnakeAlive) {
            stayAliveChoices.push(direction);
        }
    }

    const minEnemiesAlive = Math.min(...stayAliveChoices.map(move => moveOutcomes[move].enemiesAlive));
    const goodMoveChoices = stayAliveChoices.filter(move => moveOutcomes[move].enemiesAlive === minEnemiesAlive);

    console.log({ moveOutcomes, goodMoveChoices, turn: game.turn })
    const chosenMove = goodMoveChoices[Math.floor(Math.random() * goodMoveChoices.length)];

    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "I HAVE NO MOUTH BUT I MUST SCREAM"
    })))
}

