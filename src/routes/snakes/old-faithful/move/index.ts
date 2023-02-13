import { type RequestEvent } from "@builder.io/qwik-city";
import { getMoveOutcomes, getSurvivorsByMove } from "../../../../game-engine/functions";

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();

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
    const outcomes = getMoveOutcomes(trimmedBoard);
    const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);

    //moveSurvivors is a Map(). It's a string key with [number, number] value. I want the max of all the first number of the value
    console.log('1!!')
    const maxMySnakeAlive = Math.max(...Array.from(moveSurvivors.values()).map(tuple => tuple[1]));
    console.log('2!!')
    const stayAliveChoices: string[] = [];
    moveSurvivors.forEach((survivors, direction) => {
        if (survivors[1] === maxMySnakeAlive) { stayAliveChoices.push(direction); }
    });


    //DOUBLE DUTY - This is filtering but we're also mutating the gameBoard to remove dead snakes
    // console.time("Filtering outcomes");
    const stillAliveOutcomes = outcomes.filter(outcome => {
        const mySnake = outcome.gameBoard.snakes.find(snake => snake.id === mySnakeId)!;
        (outcome as any).originalMove = mySnake.lastMoved;
        const keepThisOne = stayAliveChoices.includes(mySnake.lastMoved);
        if (keepThisOne) {
            const corpsesRemoved = outcome.gameBoard.snakes.filter(snake => outcome.statuses.get(snake.id) === true);
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

    stillAliveOutcomes.forEach(outcome => {
        if (!originalMoveDirectionsAndSurvivors[outcome.originalMove]) {
            originalMoveDirectionsAndSurvivors[outcome.originalMove] = [];
        }
        const newSetOfOutcomes = getMoveOutcomes(outcome.gameBoard);
        const newSurvivors = getSurvivorsByMove(newSetOfOutcomes, mySnakeId);
        console.log('weird 2.5, this fires?')
        const [enemiesAlive, mySnakeAlive] = newSurvivors.get(outcome.originalMove)!;
        console.log({enemiesAlive, mySnakeAlive})
        originalMoveDirectionsAndSurvivors[outcome.originalMove]!.push({
            [outcome.originalMove]: {
                enemiesAlive,
                mySnakeAlive
            }
        });
    });
    console.log('numbers dont even matter anymore')
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
    console.log('3!!')
    const maxEnemiesAlive = Math.max(...Array.from(moveSurvivors.values()).map(tuple => tuple[0]));
    for (const direction of stayAliveChoices) {
        console.log('4!!')
        const [enemiesAlive] = moveSurvivors.get(direction)!;
        if (enemiesAlive !== maxEnemiesAlive) {
            originalMoveScores[direction as Direction]! += 2;
        }
    }

    const bestScore = Math.max(...Object.values(originalMoveScores));
    const bestMoves = Object.keys(originalMoveScores).filter(move => originalMoveScores[move as Direction] === bestScore);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)] as Direction;

    return chosenMove;
}