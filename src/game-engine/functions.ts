import type { Coordinates, Direction, GameBoard, TrimmedBoard, TrimmedSnake } from "./types";


export function moveSnake(snake: TrimmedSnake, direction: "up" | "down" | "left" | "right") {
    const body = snake.body;
    for (let i = body.length - 1; i >= 0; i--) {
        if (i !== 0) {
            body[i][0] = body[i - 1][0];
            body[i][1] = body[i - 1][1];
        } else {
            switch (direction) {
                case "up":
                    body[i][1]++;
                    break;
                case "down":
                    body[i][1]--;
                    break;
                case "left":
                    body[i][0]--;
                    break;
                case "right":
                    body[i][0]++;
                    break;
            }
        }
    }
    snake.lastMoved = direction;
    return snake;
}

export function getBackwardsDirection(snake: TrimmedSnake) {
    const head = snake.body[0];
    const second = snake.body[1];
    if (head[0] === second[0]) {
        if (head[1] > second[1]) { return "down" }
        return "up"
    }
    if (head[0] > second[0]) { return "left" }
    return "right"
}

export function resolveBoardAndGetSnakeAliveStatuses(board: Map<keyof GameBoard, any>) {
    const snakeAliveStatuses = new Map<string, boolean>();
    board.get("snakes").forEach((snake: TrimmedSnake) => {
        const id = snake.id;
        if (snakeAliveStatuses.get(id) === false) { return }
        if (isOutOfBounds(snake, board)) {
            snakeAliveStatuses.set(id, false);
            return;
        }
        if (isCollidedWithSelf(snake)) {
            snakeAliveStatuses.set(id, false);
            return;
        }
        snake.health -= 1; //add hazards later
        if (landedOnFood(snake, board)) {
            snake.health = 100;
            snake.body.push(snake.body[snake.body.length - 1])
        }
        if (snake.health <= 0) {
            snakeAliveStatuses.set(id, false);
            return;
        }

        snakeAliveStatuses.set(id, true);
        for (let i = 0; i < board.get("snakes").length; i++) {
            const otherSnake = board.get("snakes")[i];
            if (id === otherSnake.id) { continue; }
            if (snakeAliveStatuses.get(otherSnake.id) === false) { continue; }
            processCollisionCheck(snake, otherSnake, snakeAliveStatuses);
            if (snakeAliveStatuses.get(id) === false) { break; }
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
        const bodyPart = snake.body[i];
        if (snake.body[0][0] === bodyPart[0] && snake.body[0][1] === bodyPart[1]) { return true }
    }
    return false;
}

export function processCollisionCheck(snake: TrimmedSnake, otherSnake: TrimmedSnake, snakeAliveStatuses: Map<string, boolean>) {
    const snakeId = snake.id;
    const otherSnakeId = otherSnake.id;
    const snakeHead = snake.body[0];
    const otherSnakeHead = otherSnake.body[0];
    if (snakeHead[0] === otherSnakeHead[0] && snakeHead[1] === otherSnakeHead[1]) {
        if (snake.body.length === otherSnake.body.length) {
            snakeAliveStatuses.set(snakeId, false);
            snakeAliveStatuses.set(otherSnakeId, false);
            return
        } else if (snake.body.length > otherSnake.body.length) {
            snakeAliveStatuses.set(snakeId, true);
            snakeAliveStatuses.set(otherSnakeId, false);
            return
        } else {
            snakeAliveStatuses.set(snakeId, false);
            snakeAliveStatuses.set(otherSnakeId, true);
            return;
        }
    }

    for (let i = otherSnake.body.length - 1; i >= 0; i--) {
        const otherSnakeBodyPart = otherSnake.body[i];
        if (snakeHead[0] === otherSnakeBodyPart[0] && snakeHead[1] === otherSnakeBodyPart[1]) {
            snakeAliveStatuses.set(snakeId, false);
            snakeAliveStatuses.set(otherSnakeId, true);
            return
        }
    }

    snakeAliveStatuses.set(snakeId, true);
    snakeAliveStatuses.set(otherSnakeId, true);
}




export function getMoveOutcomes(trimmedBoard: Map<keyof TrimmedBoard, any>) {
    const reasonableDirections = getReasonableDirections(
        trimmedBoard.get("snakes") as TrimmedSnake[],
        trimmedBoard.get("width") as number,
        trimmedBoard.get("height") as number
    );
    const moveCommands = getMoveCommands(reasonableDirections);

    // const outcomes: Array<{ gameBoard: Map<keyof TrimmedBoard, any>, statuses: ReturnType<typeof resolveBoardAndGetSnakeAliveStatuses> }> = [];

    const outcomes = moveCommands.map(command => {
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
        return { gameBoard: scenario, statuses: resolveBoardAndGetSnakeAliveStatuses(scenario) }
    })

    return outcomes as {
        gameBoard: Map<keyof TrimmedBoard, any>;
        statuses: ReturnType<typeof resolveBoardAndGetSnakeAliveStatuses>;
    }[];
}

export function getReasonableDirections(snakes: Array<TrimmedSnake>, width?: number, height?: number) {
    const validDirections: Direction[] = ["left", "right", "up", "down"];
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
            directions: validDirections.filter(dir => !invalidDirections.includes(dir))
        }
    });
}



export function getMoveCommands(
    directionSets: Array<{ id: string, directions: Direction[] }>,
    index = 0,
    current = {}
): Array<Record<string, Direction>> {
    if (index === directionSets.length) { return [current]; }

    const currentDirections = directionSets[index];

    const moveCommands: Array<Record<string, Direction>> = [];
    for (let i = 0; i < currentDirections.directions.length; i++) {

        moveCommands.push(
            ...getMoveCommands(
                directionSets,
                index + 1,
                {
                    ...current,
                    [currentDirections.id]: currentDirections.directions[i],
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
        const direction = outcome.gameBoard.get("snakes").find((snake: TrimmedSnake) => snake.id === mySnakeId)!.lastMoved;
        const currentTuple = moveSurvivors.get(direction) || [0, 0];
        currentTuple[0] += enemiesAlive;
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

    const originalMoveDirectionsAndSurvivors = new Map<Direction, Array<Record<string, [number, number]>>>()
    const round2outcomes = stillAliveOutcomes.flatMap(outcome => {
        if (!originalMoveDirectionsAndSurvivors.has(outcome.originalMove)) {
            originalMoveDirectionsAndSurvivors.set(outcome.originalMove, []);
        }
        const round2outcomes = getMoveOutcomes(outcome.gameBoard);
        const round2survivorResponse = getSurvivorsByMove(round2outcomes, mySnakeId).get(outcome.originalMove);
        console.log({round2survivorResponse})
        if (!round2survivorResponse) { return; }
        originalMoveDirectionsAndSurvivors.get(outcome.originalMove)!.push({
            [outcome.originalMove]: round2survivorResponse
        });
        return round2outcomes as Array<ReturnType<typeof getMoveOutcomes>[number] & { originalMove: Direction }>
    });
    console.log(stillAliveOutcomes.length, round2outcomes.length)
    console.log(originalMoveDirectionsAndSurvivors)
    const originalMoveScores = new Map<Direction, number>();
    originalMoveDirectionsAndSurvivors.forEach((survivors, direction) => {
        let score = 0;
        survivors!.forEach(survivor => {
            const values = Object.values(survivor);
            const enemiesAlive = values.map(v => v[0]);
            const maxEnemiesAlive = Math.max(...enemiesAlive);
            const diffsCount = enemiesAlive.filter(e => e !== maxEnemiesAlive).length;
            score += diffsCount;
            const mySnakeAlive = values.map(v => v[1]);
            const stillAlives = mySnakeAlive.filter(e => e > 0).length;
            score += stillAlives;
        });
        originalMoveScores.set(direction as Direction, score);
    })

    const maxEnemiesAlive = Math.max(...Array.from(moveSurvivors.values()).map(tuple => tuple[0]));
    stayAliveChoices.forEach((_, direction) => {
        const [enemiesAlive] = moveSurvivors.get(direction)!;
        if (enemiesAlive !== maxEnemiesAlive) {
            originalMoveScores.set(direction, originalMoveScores.get(direction)! + 2);
        }
    });
    console.log(originalMoveScores);
    const bestScore = Math.max(...originalMoveScores.values());
    const bestMoves = Array.from(originalMoveScores.keys()).filter(move => originalMoveScores.get(move as Direction) === bestScore);
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)] as Direction;
    return chosenMove;
}