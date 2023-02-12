import { type RequestEvent } from "@builder.io/qwik-city";
import { getMoveOutcomes, getSurvivorsByMove } from "../../../../game-engine/functions";

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();

    //in future will trim board first for performance, but fine for now
    const mySnakeId = game.you.id;
    const outcomes = getMoveOutcomes(game.board);
    const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);

    const maxMySnakeAlive = Math.max(...Object.values(moveSurvivors).map(move => move.mySnakeAlive));
    const stayAliveChoices: string[] = [];
    for (const direction in moveSurvivors) {
        if (moveSurvivors[direction].mySnakeAlive === maxMySnakeAlive) {
            stayAliveChoices.push(direction);
        }
    }

    //DOUBLE DUTY - This is filtering but we're also mutating the gameBoard to remove dead snakes
    const stillAliveOutcomes = outcomes.filter(outcome => {
        const mySnake = outcome.gameBoard.snakes.find(snake => snake.id === mySnakeId)!;
        (outcome as any).originalMove = mySnake.lastMoved;
        const keepThisOne = stayAliveChoices.includes(mySnake.lastMoved);
        if (keepThisOne) {
            const corpsesRemoved = outcome.gameBoard.snakes.filter(snake => outcome.statuses[snake.id].alive === true);
            outcome.gameBoard.snakes = corpsesRemoved;
        }
        return keepThisOne
    }) as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>


    const originalMoveDirectionsAndSurvivors: Record<
        Direction,
        Array<Record<string, {
            enemiesAlive: number;
            mySnakeAlive: number;
        }>>
    > = {}

    stillAliveOutcomes.forEach(outcome => {
        if (!originalMoveDirectionsAndSurvivors[outcome.originalMove]) {
            originalMoveDirectionsAndSurvivors[outcome.originalMove] = [];
        }
        const newSetOfOutcomes = getMoveOutcomes(outcome.gameBoard);
        const newSurvivors = getSurvivorsByMove(newSetOfOutcomes, mySnakeId);
        originalMoveDirectionsAndSurvivors[outcome.originalMove].push(newSurvivors);
    });

    const originalMoveScores: Record<Direction, number> = {}
    for (const direction in originalMoveDirectionsAndSurvivors) {
        const survivors = originalMoveDirectionsAndSurvivors[direction as Direction];
        let score = 0;
        survivors.forEach(survivor => {
            const values = Object.values(survivor);

            const enemiesAlive = values.map(v => v.enemiesAlive);
            const maxEnemiesAlive = Math.max(...enemiesAlive);
            const diffsCount = enemiesAlive.filter(e => e !== maxEnemiesAlive).length;
            score += diffsCount;
            const mySnakeAlive = values.map(v => v.mySnakeAlive);
            const stillAlives = mySnakeAlive.filter(e => e > 0).length;
            score += stillAlives;
        });
        originalMoveScores[direction as Direction] = score;
    }

    const maxEnemiesAlive = Math.max(...Object.values(moveSurvivors).map(move => move.enemiesAlive));
    for (const direction in moveSurvivors) {
        const { enemiesAlive } = moveSurvivors[direction as Direction];
        if (enemiesAlive !== maxEnemiesAlive) {
            originalMoveScores[direction as Direction] += 2;
        }
    }

    const bestScore = Math.max(...Object.values(originalMoveScores));
    const bestMoves = Object.keys(originalMoveScores).filter(move => originalMoveScores[move as Direction] === bestScore);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)] as Direction;
    console.log({ turn: game.turn, moveSurvivors, originalMoveScores, bestMoves })
    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "I HAVE NO MOUTH BUT I MUST SCREAM"
    })))
}

