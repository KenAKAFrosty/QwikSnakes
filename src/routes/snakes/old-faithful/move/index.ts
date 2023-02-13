import { type RequestEvent } from "@builder.io/qwik-city";
import { getMoveOutcomes, getSurvivorsByMove } from "../../../../game-engine/functions";

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();
    if (game.turn < 3) {
        console.log(game); // gonna grab some xamples;
    }
    const trimmedBoard = {
        width: game.board.width,
        height: game.board.height,
        food: game.board.food,
        hazards: game.board.hazards,
        snakes: game.board.snakes.map(snake => {
            return {
                body: snake.body,
                id: snake.id,
                health: snake.health,
                squad: snake.squad
            }
        })
    }
    const mySnakeId = game.you.id;
    const chosenMove = getChosenMove(trimmedBoard, mySnakeId);
    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: chosenMove,
        shout: "I HAVE NO MOUTH BUT I MUST SCREAM"
    })))
}



type TrimmedBoard = { 
    width: number;
    height: number;
    food: Array<{ x: number, y: number }>;
    hazards: Array<{ x: number, y: number }>;
    snakes: Array<TrimmedSnake>
}
export function getChosenMove(trimmedBoard: TrimmedBoard, mySnakeId: string) { 
    // console.time("get move outcomes")
    const outcomes = getMoveOutcomes(trimmedBoard);
    // console.timeEnd("get move outcomes")

    // console.time("get survivors by move")
    const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);
    // console.timeEnd("get survivors by move")

    // console.time("get stay alive choices")
    const maxMySnakeAlive = Math.max(...Object.values(moveSurvivors).map(move => move.mySnakeAlive));
    const stayAliveChoices: string[] = [];
    for (const direction in moveSurvivors) {
        if (moveSurvivors[direction].mySnakeAlive === maxMySnakeAlive) {
            stayAliveChoices.push(direction);
        }
    }
    // console.timeEnd("get stay alive choices")

    //DOUBLE DUTY - This is filtering but we're also mutating the gameBoard to remove dead snakes
    // console.time("Filtering outcomes");
    const stillAliveOutcomes = outcomes.filter(outcome => {
        const mySnake = outcome.gameBoard.snakes.find(snake => snake.id === mySnakeId)!;
        (outcome as any).originalMove = mySnake.lastMoved;
        const keepThisOne = stayAliveChoices.includes(mySnake.lastMoved);
        if (keepThisOne) {
            const corpsesRemoved = outcome.gameBoard.snakes.filter(snake => outcome.statuses[snake.id] === true);
            outcome.gameBoard.snakes = corpsesRemoved;
        }
        return keepThisOne
    }) as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>
    // console.timeEnd("Filtering outcomes");

    const originalMoveDirectionsAndSurvivors: {
        [key in Direction]?: Array<Record<string, {
            enemiesAlive: number;
            mySnakeAlive: number;
        }>>
    } = {}

    // console.time("second turn of getting move outcomes")
    stillAliveOutcomes.forEach(outcome => {
        if (!originalMoveDirectionsAndSurvivors[outcome.originalMove]) {
            originalMoveDirectionsAndSurvivors[outcome.originalMove] = [];
        }
        const newSetOfOutcomes = getMoveOutcomes(outcome.gameBoard);
        const newSurvivors = getSurvivorsByMove(newSetOfOutcomes, mySnakeId);
        originalMoveDirectionsAndSurvivors[outcome.originalMove]!.push(newSurvivors);
    });
    // console.timeEnd("second turn of getting move outcomes")

    // console.time("calculating move scores")
    const originalMoveScores: { [k in Direction]?: number } = {}
    for (const direction in originalMoveDirectionsAndSurvivors) {
        const survivors = originalMoveDirectionsAndSurvivors[direction as Direction];
        let score = 0;
        survivors!.forEach(survivor => {
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
    // console.timeEnd("calculating move scores")

    // console.time("final calculations")
    const maxEnemiesAlive = Math.max(...Object.values(moveSurvivors).map(move => move.enemiesAlive));
    for (const direction of stayAliveChoices) {
        const { enemiesAlive } = moveSurvivors[direction as Direction];
        if (enemiesAlive !== maxEnemiesAlive) {
            originalMoveScores[direction as Direction]! += 2;
        }
    }

    const bestScore = Math.max(...Object.values(originalMoveScores));
    const bestMoves = Object.keys(originalMoveScores).filter(move => originalMoveScores[move as Direction] === bestScore);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)] as Direction;
    // console.timeEnd("final calculations")
    // console.log({ turn: game.turn, moveSurvivors, originalMoveScores, bestMoves, stayAliveChoices })
    return chosenMove;
}