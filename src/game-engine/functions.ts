import type { Coordinates, Direction, GameBoard, TrimmedBoard, TrimmedSnake } from "./types";
const DIRECTIONS = ["up", "right", "down", "left"] as const;


export function moveSnake(snake: TrimmedSnake, direction: "up" | "down" | "left" | "right") {
    for (let i = snake.body.length - 1; i >= 0; i--) {
        if (i !== 0) {
            snake.body[i][0] = snake.body[i - 1][0];
            snake.body[i][1] = snake.body[i - 1][1];
        } else {
            switch (direction) {
                case "up":
                    snake.body[i][1]++;
                    break;
                case "down":
                    snake.body[i][1]--;
                    break;
                case "left":
                    snake.body[i][0]--;
                    break;
                case "right":
                    snake.body[i][0]++;
                    break;
            }
        }
    }
    snake.lastMoved = direction;
    return snake;
}

export function getBackwardsDirection(snake: TrimmedSnake) {
    if (snake.body[0][0] === snake.body[1][0]) {
        if (snake.body[0][1] > snake.body[1][1]) { return "down" }
        return "up"
    }
    if (snake.body[0][0] > snake.body[1][0]) { return "left" }
    return "right"
}



export function resolveBoardAndGetSnakeAliveStatuses(board: Map<keyof GameBoard, any>) {
    const snakeAliveStatuses = new Map<string, boolean>();

    board.get("snakes").forEach((snake: TrimmedSnake) => {
        if (snakeAliveStatuses.get(snake.id) === false) { return }
        if (isOutOfBounds(snake, board)) {
            snakeAliveStatuses.set(snake.id, false);
            return;
        }
        if (isCollidedWithSelf(snake)) {
            snakeAliveStatuses.set(snake.id, false);
            return;
        }
        snake.health -= 1; //add hazards later
        if (landedOnFood(snake, board)) {
            snake.health = 100;
            snake.body.push(snake.body[snake.body.length - 1])
        }
        if (snake.health <= 0) {
            snakeAliveStatuses.set(snake.id, false);
            return;
        }

        snakeAliveStatuses.set(snake.id, true);
        for (let i = 0; i < board.get("snakes").length; i++) {
            if (snake.id === board.get("snakes")[i].id) { continue; }
            if (snakeAliveStatuses.get(board.get("snakes")[i].id) === false) { continue; }
            processCollisionCheck(snake, board.get("snakes")[i], snakeAliveStatuses);
            if (snakeAliveStatuses.get(snake.id) === false) { break; }
        }
    });
    return snakeAliveStatuses
}

export function landedOnFood(snake: TrimmedSnake, board: Map<keyof GameBoard, any>) {
    return (board.get("food") as Coordinates[]).some(food => food[0] === snake.body[0][0] && food[1] === snake.body[0][1]);
}

export function isOutOfBounds(snake: TrimmedSnake, board: Map<keyof GameBoard, any>) {
    return snake.body[0][0] < 0 ||
        snake.body[0][0] >= board.get("width") ||
        snake.body[0][1] < 0 ||
        snake.body[0][1] >= board.get("height")
}

export function isCollidedWithSelf(snake: TrimmedSnake) {
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[0][0] === snake.body[i][0] && snake.body[0][1] === snake.body[i][1]) {
            return true
        }
    }
    return false;
}

export function processCollisionCheck(snake: TrimmedSnake, otherSnake: TrimmedSnake, snakeAliveStatuses: Map<string, boolean>) {
    if (snake.body[0][0] === otherSnake.body[0][0] && snake.body[0][1] === otherSnake.body[0][1]) {
        if (snake.body.length === otherSnake.body.length) {
            snakeAliveStatuses.set(snake.id, false);
            snakeAliveStatuses.set(otherSnake.id, false);
            return
        } else if (snake.body.length > otherSnake.body.length) {
            snakeAliveStatuses.set(snake.id, true);
            snakeAliveStatuses.set(otherSnake.id, false);
            return
        } else {
            snakeAliveStatuses.set(snake.id, false);
            snakeAliveStatuses.set(otherSnake.id, true);
            return;
        }
    }

    for (let i = otherSnake.body.length - 1; i >= 0; i--) {
        const otherSnakeBodyPart = otherSnake.body[i];
        if (snake.body[0][0] === otherSnakeBodyPart[0] && snake.body[0][1] === otherSnakeBodyPart[1]) {
            snakeAliveStatuses.set(snake.id, false);
            snakeAliveStatuses.set(otherSnake.id, true);
            return
        }
    }

    snakeAliveStatuses.set(snake.id, true);
    snakeAliveStatuses.set(otherSnake.id, true);
}




export function getMoveOutcomes(trimmedBoard: Map<keyof TrimmedBoard, any>) {

    return (getMoveCommands(getReasonableDirections(
        trimmedBoard.get("snakes") as TrimmedSnake[],
        trimmedBoard.get("width") as number,
        trimmedBoard.get("height") as number
    )).map(command => {
        const scenario = new Map<keyof TrimmedBoard, any>([
            ["width", trimmedBoard.get("width")],
            ["height", trimmedBoard.get("height")],
            ["food", trimmedBoard.get("food").map((food: Coordinates) => [food[0], food[1]])],
            ["hazards", trimmedBoard.get("hazards").map((hazard: Coordinates) => [hazard[0], hazard[1]])],
            ["snakes", trimmedBoard.get("snakes").map((snake: TrimmedSnake) => moveSnake({
                id: snake.id,
                body: snake.body.map(bodyPart => [bodyPart[0], bodyPart[1]]),
                health: snake.health,
                squad: snake.squad,
            },
                command[snake.id]
            ))]
        ]);
        return { 
            gameBoard: scenario, 
            statuses: resolveBoardAndGetSnakeAliveStatuses(scenario)
         }

    })) as {
        gameBoard: Map<keyof TrimmedBoard, any>;
        statuses: ReturnType<typeof resolveBoardAndGetSnakeAliveStatuses>;
    }[];

}



export function getReasonableDirections(snakes: Array<TrimmedSnake>, width?: number, height?: number) {
    return snakes.map(snake => {
        const invalidDirections: Direction[] = [getBackwardsDirection(snake)];
        if (width && height) {
            if (snake.body[0][0] === 0) { invalidDirections.push("left") }
            if (snake.body[0][0] === width - 1) { invalidDirections.push("right") }
            if (snake.body[0][1] === 0) { invalidDirections.push("down") }
            if (snake.body[0][1] === height - 1) { invalidDirections.push("up") }
        }
        return {
            id: snake.id,
            directions: DIRECTIONS.filter(dir => !invalidDirections.includes(dir))
        }
    });
}



export function getMoveCommands(
    directionSets: Array<{ id: string, directions: Direction[] }>,
    index = 0,
    current = {}
): Array<Record<string, Direction>> {
    if (index === directionSets.length) { return [current]; }
    const moveCommands: Array<Record<string, Direction>> = [];
    for (let i = 0; i < directionSets[index].directions.length; i++) {

        moveCommands.push(
            ...getMoveCommands(
                directionSets,
                index + 1,
                {
                    ...current,
                    [directionSets[index].id]: directionSets[index].directions[i],
                }
            )
        );
    }

    return moveCommands;
}
/*
This is the simple version with just two arrays for an easy mental map of what it's doing

    export function _getMoveCommands(directionSets: Array<{ id: string, directions: Direction[] }>) {
        const moveCommands: Array<Record<string, Direction>> = []
        for (let i = 0; i < directionSets[0].directions.length; i++) {
            for (let j = 0; j < directionSets[1].directions.length; j++) {
                moveCommands.push({
                    [directionSets[0].id]: directionSets[0].directions[i],
                    [directionSets[1].id]: directionSets[1].directions[j],
                });
            }
        }
        return moveCommands;
    }
*/



/**
 * Return a map of directions to a tuple of [enemiesAlive, mySnakeAlive]
 */
export function getSurvivorsByMove(outcomes: ReturnType<typeof getMoveOutcomes>, mySnakeId: string) {
    //tuple has [0] position for enemiesAlive, [1] position for mySnakeAlive
    const moveSurvivors = new Map<string, [number, number]>();
    outcomes.forEach(outcome => {
        let enemiesAlive = 0;
        let mySnakeAlive = 0;
        outcome.statuses.forEach((isAlive, id) => {
            if (isAlive === false) { return; }
            if (id === mySnakeId) { mySnakeAlive++; }
            else { enemiesAlive++; }
        });
        const me = outcome.gameBoard.get("snakes").find((snake: TrimmedSnake) => snake.id === mySnakeId);
        if (!me) { return; }
        const otherSnakeCount = outcome.gameBoard.get("snakes").length - 1;
        const direction = me.lastMoved;
        const currentTuple = moveSurvivors.get(direction) || [0, 0];
        currentTuple[0] += enemiesAlive / otherSnakeCount;
        currentTuple[1] += mySnakeAlive;
        moveSurvivors.set(direction, currentTuple);
    });

    return moveSurvivors;
}




export function getChosenMove(trimmedBoard: Map<keyof TrimmedBoard, any>, mySnakeId: string) {
    const outcomes = getMoveOutcomes(trimmedBoard);
    const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);
    const maxMySnakeAlive = Math.max(...Array.from(moveSurvivors.values()).map(tuple => tuple[1]));
    const stayAliveChoices = new Map<Direction, true>()
    moveSurvivors.forEach((survivors, direction) => {
        if (survivors[1] === maxMySnakeAlive) { stayAliveChoices.set(direction as Direction, true); }
    });

    //DOuBLE DUTY - This is filtering but we're also mutating the gameBoard to remove dead snakes and eaten food
    const stillAliveOutcomes = outcomes.filter(outcome => {
        const mySnake = outcome.gameBoard.get("snakes").find((snake: TrimmedSnake) => snake.id === mySnakeId)!;
        (outcome as any).originalMove = mySnake.lastMoved;
        const keepThisOne = stayAliveChoices.has(mySnake.lastMoved);
        if (keepThisOne) {
            for (let i = outcome.gameBoard.get("food").length - 1; i >= 0; i--) { //think we'll want to move this to resolveBoardAndGetSnakeAliveStatuses
                const food = outcome.gameBoard.get("food")[i];
                outcome.gameBoard.get("snakes").forEach((snake: TrimmedSnake) => {
                    if (snake.body[0][0] === food[0] && snake.body[0][1] === food[1]) {
                        outcome.gameBoard.get("food").splice(i, 1);
                    }
                })
            }
            outcome.gameBoard.set("snakes", outcome.gameBoard.get("snakes").filter((snake: TrimmedSnake) => outcome.statuses.get(snake.id) === true));

        }
        return keepThisOne
    }) as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>

    const originalMoveDirectionsAndSurvivors = new Map<Direction, Array<Record<string, [number, number]>>>();

    const round2 = stillAliveOutcomes.flatMap(outcome => {
        if (!originalMoveDirectionsAndSurvivors.has(outcome.originalMove)) {
            originalMoveDirectionsAndSurvivors.set(outcome.originalMove, []);
        }
        const round2outcomes = getMoveOutcomes(outcome.gameBoard);
        const round2survivorResponse = getSurvivorsByMove(round2outcomes, mySnakeId).get(outcome.originalMove);
        if (round2survivorResponse) {
            originalMoveDirectionsAndSurvivors.get(outcome.originalMove)!.push({
                [outcome.originalMove]: round2survivorResponse
            });
        }
        return round2outcomes as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>
    }).filter(item => item);

    
    round2.flatMap(outcome => {
        if (!originalMoveDirectionsAndSurvivors.has(outcome.originalMove)) {
            originalMoveDirectionsAndSurvivors.set(outcome.originalMove, []);
        }
        const round3outcomes = getMoveOutcomes(outcome.gameBoard);
        const round3survivorResponse = getSurvivorsByMove(round3outcomes, mySnakeId).get(outcome.originalMove);
        if (round3survivorResponse) {
            originalMoveDirectionsAndSurvivors.get(outcome.originalMove)!.push({
                [outcome.originalMove]: round3survivorResponse
            });
        }
        return round3outcomes as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>
    });

    const originalMoveScores = new Map<Direction, number>();
    originalMoveDirectionsAndSurvivors.forEach((survivors, direction) => {
        let score = 0;
        const enemiesAliveSum = survivors.reduce((sum, s) => sum + s[direction][0], 0)
        const stillAliveSum = survivors.reduce((sum, s) => sum + s[direction][1], 0)
        score += (stillAliveSum || 0) - (enemiesAliveSum || 0);
        originalMoveScores.set(direction as Direction, score);
    })

    console.log(originalMoveScores);
    const bestScore = Math.max(...originalMoveScores.values());
    const bestMoves = Array.from(originalMoveScores.keys()).filter(move => originalMoveScores.get(move as Direction) === bestScore);
    if (bestMoves.length === 1) {
        return bestMoves[0] as Direction;
    }


    //This feels like a fever dream. It shouldn't be this crazy to find nearest food direction? But wahtever it works for now.
    const mySnakeHead = trimmedBoard.get("snakes").find((snake: TrimmedSnake) => snake.id === mySnakeId)!.body[0] as Coordinates;
    const nearestFoodDistancesByDirection = new Map<Direction, number>();
    let nearestFoodDistance = 99999;
    bestMoves.forEach(move => {
        const coordsAfterMove = getCoordsAfterMove(mySnakeHead, move);
        const distanceToNearestFoodAfterMove = (trimmedBoard.get("food") as Coordinates[]).map(food => getDistanceBetweenCoords(food, coordsAfterMove)).sort((a, b) => a - b)[0];
        if (distanceToNearestFoodAfterMove < nearestFoodDistance) {
            nearestFoodDistance = distanceToNearestFoodAfterMove;
        }
        nearestFoodDistancesByDirection.set(move, distanceToNearestFoodAfterMove);
    });
    const moveNearestToFood = Array.from(nearestFoodDistancesByDirection.keys()).filter(move => nearestFoodDistancesByDirection.get(move as Direction) === nearestFoodDistance)[0];
    return moveNearestToFood as Direction;
}

function getCoordsAfterMove(coords: [number, number], direction: Direction): [number, number] {
    switch (direction) {
        case "up": return [coords[0], coords[1] + 1];
        case "down": return [coords[0], coords[1] - 1];
        case "left": return [coords[0] - 1, coords[1]];
        case "right": return [coords[0] + 1, coords[1]];
    }
}

function getDistanceBetweenCoords(coords1: [number, number], coords2: [number, number]) {
    return Math.abs(coords1[0] - coords2[0]) + Math.abs(coords1[1] - coords2[1]);
}