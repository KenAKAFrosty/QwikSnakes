import { type RequestEvent } from "@builder.io/qwik-city";
import { getMoveOutcomes, getSurvivorsByMove } from "../../../../game-engine/functions";

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
        ["food", game.board.food],
        ["hazards", game.board.hazards],
        ["snakes", game.board.snakes.map(snake => ({
            body: snake.body,
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





type TrimmedBoard = {
    width: number;
    height: number;
    food: Array<{ x: number, y: number }>;
    hazards: Array<{ x: number, y: number }>;
    snakes: Array<TrimmedSnake>;
}
export function getChosenMove(trimmedBoard: Map<keyof TrimmedBoard, any>, mySnakeId: string) {
    console.time("Get move outcomes")
    const outcomes = getMoveOutcomes(trimmedBoard);
    console.timeEnd("Get move outcomes")

    console.time("move survivors")
    const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);
    console.timeEnd("move survivors")


    console.time("stay alive choices")
    const maxMySnakeAlive = Math.max(...Array.from(moveSurvivors.values()).map(tuple => tuple[1]));
    const stayAliveChoices: string[] = [];
    moveSurvivors.forEach((survivors, direction) => {
        if (survivors[1] === maxMySnakeAlive) { stayAliveChoices.push(direction); }
    });
    console.timeEnd("stay alive choices")


    //DOUBLE DUTY - This is filtering but we're also mutating the gameBoard to remove dead snakes
    console.time("still alive outcomes")
    const stillAliveOutcomes = outcomes.filter(outcome => {
        const mySnake = outcome.gameBoard.get("snakes").find((snake: TrimmedSnake) => snake.id === mySnakeId)!;
        (outcome as any).originalMove = mySnake.lastMoved;
        const keepThisOne = stayAliveChoices.includes(mySnake.lastMoved);
        if (keepThisOne) {
            const corpsesRemoved = outcome.gameBoard.get("snakes").filter((snake: TrimmedSnake) => outcome.statuses.get(snake.id) === true);
            outcome.gameBoard.set("snakes", corpsesRemoved);
        }
        return keepThisOne
    }) as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>
    console.timeEnd("still alive outcomes")

    const originalMoveDirectionsAndSurvivors: {
        [key in Direction]?: Array<Record<string, {
            enemiesAlive: number;
            mySnakeAlive: number;
        }>>
    } = {}

    console.time("Round 2 of outcomes")
    stillAliveOutcomes.forEach(outcome => {
        console.time("Round 2 of outcomes 2")
        if (!originalMoveDirectionsAndSurvivors[outcome.originalMove]) {
            originalMoveDirectionsAndSurvivors[outcome.originalMove] = [];
        }
        const newSetOfOutcomes = getMoveOutcomes(outcome.gameBoard);
        console.timeEnd("Round 2 of outcomes 2")

        const newSurvivors = getSurvivorsByMove(newSetOfOutcomes, mySnakeId);

        const newSurvivorResponse = newSurvivors.get(outcome.originalMove);
        if (!newSurvivorResponse) { return; }
        const [enemiesAlive, mySnakeAlive] = newSurvivorResponse;

        originalMoveDirectionsAndSurvivors[outcome.originalMove] = originalMoveDirectionsAndSurvivors[outcome.originalMove] || [];
        originalMoveDirectionsAndSurvivors[outcome.originalMove]!.push({
            [outcome.originalMove]: {
                enemiesAlive,
                mySnakeAlive
            }
        });
    });
    console.timeEnd("Round 2 of outcomes")

    console.time("Survivor calculations/scoring")
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
    console.timeEnd("Survivor calculations/scoring")

    console.time("Final scoring, choosing move")
    const maxEnemiesAlive = Math.max(...Array.from(moveSurvivors.values()).map(tuple => tuple[0]));
    for (const direction of stayAliveChoices) {
        const [enemiesAlive] = moveSurvivors.get(direction)!;
        if (enemiesAlive !== maxEnemiesAlive) {
            originalMoveScores[direction as Direction]! += 2;
        }
    }

    const bestScore = Math.max(...Object.values(originalMoveScores));
    const bestMoves = Object.keys(originalMoveScores).filter(move => originalMoveScores[move as Direction] === bestScore);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)] as Direction;
    console.timeEnd("Final scoring, choosing move")
    return chosenMove;
}