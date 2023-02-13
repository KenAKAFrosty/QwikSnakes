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
    (snake as TrimmedSnake & { lastMoved: Direction }).lastMoved = direction;
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



export function getEasyAccessMapFromBoard(board: Omit<GameBoard, "snakes"> & { snakes: Array<TrimmedSnake> }) {
    const grid: Record<number, string[]> = {};
    board.food.forEach(item => {
        const key = item.x + (item.y * 0.01);
        if (grid[key]) {
            grid[key].push("food:");
        } else {
            grid[key] = ["food:"];
        }
    })
    board.hazards.forEach(hazard => {
        const key = hazard.x + (hazard.y * 0.01);
        if (grid[key]) {
            grid[key].push("hzrd:");
        } else {
            grid[key] = ["hzrd:"];
        }
    });
    board.snakes.forEach((snake) => {
        snake.body.forEach((part, i) => {
            const { x, y } = part;
            const label = (i === 0) ? "head" : "body";
            const key = x + (y * 0.01);
            const value = `${label}:${snake.id}`;
            if (grid[key]) {
                grid[key].push(value);
            } else {
                grid[key] = [value];
            }
        })
    });
    return grid;
}


export function resolveBoardAndGetSnakeAliveStatuses(board: GameBoard) {
    const snakeAliveStatuses: Record<string, boolean> = {};
    board.snakes.forEach((snake) => {
        const id = snake.id;
        if (snakeAliveStatuses[id] === false) { return }
        if (isOutOfBounds(snake, board)) {
            snakeAliveStatuses[id] = false;
            return;
        }
        if (isCollidedWithSelf(snake)) {
            snakeAliveStatuses[id] = false;
            return;
        }
        snake.health -= 1; //add hazards later
        if (landedOnFood(snake, board)) {
            snake.health = 100;
            snake.body.push(snake.body[snake.body.length - 1])
        }
        if (snake.health <= 0) {
            snakeAliveStatuses[id] = false;
            return;
        }
        

        snakeAliveStatuses[id] = true;

        for (let i = 0; i < board.snakes.length; i++) {
            const otherSnake = board.snakes[i];
            if (id === otherSnake.id) { continue; }
            if (snakeAliveStatuses[otherSnake.id] === false) { continue; }
            // console.time("processCollisionCheck")
            const collisionResult = processCollisionCheck(snake, otherSnake);
            // console.timeEnd("processCollisionCheck")
            snakeAliveStatuses[id] = collisionResult[id];
            snakeAliveStatuses[otherSnake.id] = collisionResult[otherSnake.id];
            if (snakeAliveStatuses[id] === false) { break; }
        }

    });
    return snakeAliveStatuses
}

export function landedOnFood(snake: Snake, board: GameBoard) {
    const { x, y } = snake.body[0];
    const foodIndex = board.food.findIndex((food) => food.x === x && food.y === y);
    return foodIndex > -1
}

export function isOutOfBounds(snake: Snake, board: GameBoard) {
    const { x, y } = snake.body[0];
    return x < 0 || x >= board.width || y < 0 || y >= board.height
}

export function isCollidedWithSelf(snake: Snake) {
    const { x, y } = snake.body[0];
    for (let i = 1; i < snake.body.length; i++) {
        const bodyPart = snake.body[i];
        if (x === bodyPart.x && y === bodyPart.y) { return true }
    }
    return false;
}

export function processCollisionCheck(snake: Snake, otherSnake: Snake) {
    const snakeId = snake.id;
    const otherSnakeId = otherSnake.id;
    const outcome = {
        [snakeId]: true,
        [otherSnakeId]: true
    }
    const { x, y } = snake.body[0];
    const otherHead = otherSnake.body[0];
    if (x === otherHead.x && y === otherHead.y) {
        if (snake.body.length === otherSnake.body.length) {
            outcome[snakeId] = false;
            outcome[otherSnakeId] = false;
            return outcome;
        } else if (snake.body.length > otherSnake.body.length) {
            outcome[otherSnakeId] = false;
            return outcome;
        } else {
            outcome[snakeId] = false;
            return outcome;
        }
    }

    for (let i = otherSnake.body.length - 1; i >= 0; i--) {
        const bodyPart = otherSnake.body[i];
        if (x === bodyPart.x && y === bodyPart.y) {
            outcome[snakeId] = false;
            return outcome
        }
    }

    return outcome
}




export function getMoveOutcomes(trimmedBoard: {
    width: GameBoard["width"];
    height: GameBoard["height"];
    food: GameBoard["food"];
    hazards: GameBoard["hazards"];
    snakes: Array<TrimmedSnake>
}) {
    // console.time("reasonable directions")
    const reasonableDirections = getReasonableDirections(trimmedBoard.snakes, trimmedBoard.width, trimmedBoard.height);
    // console.timeEnd("reasonable directions")

    // console.time("get move commands")
    const moveCommands = getMoveCommands(reasonableDirections);
    // console.timeEnd("get move commands")

    const outcomes: Array<{ gameBoard: typeof trimmedBoard, statuses: ReturnType<typeof resolveBoardAndGetSnakeAliveStatuses> }> = [];

    moveCommands.forEach((command, i) => {
        const scenario = {
            width: trimmedBoard.width,
            height: trimmedBoard.height,
            food: trimmedBoard.food.map(food => ({ x: food.x, y: food.y })),
            hazards: trimmedBoard.hazards.map(hazard => ({ x: hazard.x, y: hazard.y })),
            snakes: trimmedBoard.snakes.map(snake => ({
                id: snake.id,
                body: snake.body.map(bodyPart => ({ x: bodyPart.x, y: bodyPart.y })),
                health: snake.health,
                squad: snake.squad,
            }))
        }

        // console.time("move commands")
        scenario.snakes.forEach(snake => moveSnake(snake, command[snake.id]));
        // console.timeEnd("move commands")

        // console.time("Resolve board");
        const snakeAliveStatuses = resolveBoardAndGetSnakeAliveStatuses(scenario as GameBoard);
        // console.timeEnd("Resolve board");
        outcomes[i] = { gameBoard: scenario, statuses: snakeAliveStatuses }
    })

    return outcomes as {
        gameBoard: Omit<typeof trimmedBoard, "snakes"> & { snakes: Array<TrimmedSnake & { lastMoved: Direction }> };
        statuses: ReturnType<typeof resolveBoardAndGetSnakeAliveStatuses>;
    }[];
}

export function getReasonableDirections(snakes: Array<TrimmedSnake>, width?: number, height?: number) {
    const validDirections: Direction[] = ["left", "right", "up", "down"];
    return snakes.map(snake => {
        const invalidDirections: Direction[] = [];
        invalidDirections.push(getBackwardsDirection(snake));
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




export function getSurvivorsByMove(outcomes: ReturnType<typeof getMoveOutcomes>, mySnakeId: string) {
    const moveSurvivors: Record<string, { enemiesAlive: number, mySnakeAlive: number }> = {};
    outcomes.forEach(outcome => {
        let enemiesAlive = 0;
        let mySnakeAlive = 0;
        for (const id in outcome.statuses) {
            const isAlive = outcome.statuses[id] === true;
            if (isAlive === false) { continue; }
            if (id === mySnakeId) { mySnakeAlive++; }
            else { enemiesAlive++; }
        }
        const direction = outcome.gameBoard.snakes.find(snake => snake.id === mySnakeId)!.lastMoved;
        moveSurvivors[direction] = moveSurvivors[direction] || { enemiesAlive: 0, mySnakeAlive: 0 };
        moveSurvivors[direction].enemiesAlive += enemiesAlive;
        moveSurvivors[direction].mySnakeAlive += mySnakeAlive;
    });
    return moveSurvivors;
}
