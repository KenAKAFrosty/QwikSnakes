export type TrimmedBoard = {
    width: GameBoard["width"];
    height: GameBoard["height"];
    food: GameBoard["food"];
    hazards: GameBoard["hazards"];
    snakes: Array<TrimmedSnake>
}
export type Coordinates = [number, number]

export function moveSnake(snake: TrimmedSnake, direction: "up" | "down" | "left" | "right") {
    const body = snake.body;
    for (let i = body.length - 1; i >= 0; i--) {
        if (i !== 0) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
        } else {
            switch (direction) {
                case "up":
                    body[i].y++;
                    break;
                case "down":
                    body[i].y--;
                    break;
                case "left":
                    body[i].x--;
                    break;
                case "right":
                    body[i].x++;
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
    if (head.x === second.x) {
        if (head.y > second.y) { return "down" }
        return "up"
    }
    if (head.x > second.x) { return "left" }
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
    const { x, y } = snake.body[0];
    const foodIndex = board.get("food").findIndex((food: Coordinates) => food[0] === x && food[1] === y);
    return foodIndex > -1
}

export function isOutOfBounds(snake: TrimmedSnake, board: Map<keyof GameBoard, any>) {
    const { x, y } = snake.body[0];
    return x < 0 || x >= board.get("width") || y < 0 || y >= board.get("height")
}

export function isCollidedWithSelf(snake: TrimmedSnake) {
    const { x, y } = snake.body[0];
    for (let i = 1; i < snake.body.length; i++) {
        const bodyPart = snake.body[i];
        if (x === bodyPart.x && y === bodyPart.y) { return true }
    }
    return false;
}

export function processCollisionCheck(snake: TrimmedSnake, otherSnake: Snake, snakeAliveStatuses: Map<string, boolean>) {
    const snakeId = snake.id;
    const otherSnakeId = otherSnake.id;
    const { x, y } = snake.body[0];
    const otherHead = otherSnake.body[0];
    if (x === otherHead.x && y === otherHead.y) {
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
        const bodyPart = otherSnake.body[i];
        if (x === bodyPart.x && y === bodyPart.y) {
            snakeAliveStatuses.set(snakeId, false);
            snakeAliveStatuses.set(otherSnakeId, true);
            return
        }
    }

    snakeAliveStatuses.set(snakeId, true);
    snakeAliveStatuses.set(otherSnakeId, true);
}




export function getMoveOutcomes(trimmedBoard: Map<keyof TrimmedBoard, any>) {
    console.time("1")
    const reasonableDirections = getReasonableDirections(
        trimmedBoard.get("snakes") as TrimmedSnake[],
        trimmedBoard.get("width") as number,
        trimmedBoard.get("height") as number
    );
    console.timeEnd("1")
    console.time("2")
    const moveCommands = getMoveCommands(reasonableDirections);
    console.timeEnd("2")

    // const outcomes: Array<{ gameBoard: Map<keyof TrimmedBoard, any>, statuses: ReturnType<typeof resolveBoardAndGetSnakeAliveStatuses> }> = [];

    console.time("3")
    const outcomes = moveCommands.map((command, i) => {
        const scenario = new Map<keyof TrimmedBoard, any>([
            ["width", trimmedBoard.get("width")],
            ["height", trimmedBoard.get("height")],
            ["food", trimmedBoard.get("food").map((food: Coordinates) => [food[0], food[1]])],
            ["hazards", trimmedBoard.get("hazards").map((hazard: Coordinates) => [hazard[0], hazard[1]])],
            ["snakes", trimmedBoard.get("snakes").map((snake: TrimmedSnake) => moveSnake({
                id: snake.id,
                body: snake.body.map(bodyPart => ({ x: bodyPart.x, y: bodyPart.y })),
                health: snake.health,
                squad: snake.squad,
            },
                command[snake.id]
            ))]
        ]);
        return { gameBoard: scenario, statuses: resolveBoardAndGetSnakeAliveStatuses(scenario) }
    })
    console.timeEnd("3")

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
            const { x, y } = snake.body[0];
            if (x === 0) { invalidDirections.push("left") }
            if (x === width - 1) { invalidDirections.push("right") }
            if (y === 0) { invalidDirections.push("down") }
            if (y === height - 1) { invalidDirections.push("up") }
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
