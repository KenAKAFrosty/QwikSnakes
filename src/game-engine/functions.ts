export function moveSnake(snake: Snake, direction: "up" | "down" | "left" | "right") {
    const head = snake.body[0];
    let newHead: Snake["body"][number];
    switch (direction) {
        case "up":
            newHead = { x: head.x, y: head.y + 1 };
            break;
        case "down":
            newHead = { x: head.x, y: head.y - 1 };
            break;
        case "left":
            newHead = { x: head.x - 1, y: head.y };
            break;
        case "right":
            newHead = { x: head.x + 1, y: head.y };
            break;
    }

    const length = snake.body.length;
    const hasStackedTail = snake.body[length - 1].x === snake.body[length - 2].x && snake.body[length - 1].y === snake.body[length - 2].y;
    const newSnakeBody: Snake["body"] = [newHead];
    const targetLength = hasStackedTail ? length - 1 : length;
    for (let i = 1; i < targetLength; i++) {
        newSnakeBody.push(snake.body[i - 1]);
    }
    if (hasStackedTail) { newSnakeBody.push(snake.body[length - 1]); }
    snake.body = newSnakeBody;
}



export function resolveBoardAndGetSnakeStatuses(board: GameBoard) {
    const snakeStatuses: Record<string, { alive: boolean }> = {};
    board.snakes.forEach((snake) => {
        const id = snake.id;
        if (snakeStatuses[id]?.alive === false) { return }
        if (isOutOfBounds(snake, board)) {
            snakeStatuses[id] = { alive: false };
            return;
        } 
        if (isCollidedWithSelf(snake)) {
            snakeStatuses[id] = { alive: false };
            return;
        }
        snakeStatuses[id] = { alive: true };
        for (let i = 0; i < board.snakes.length; i++) {
            const otherSnake = board.snakes[i];
            if (id === otherSnake.id) { continue; }
            if (snakeStatuses[otherSnake.id]?.alive === false) { continue; }

            const collisionResult = processCollisionCheck(snake, otherSnake);
            snakeStatuses[id] = collisionResult[id];
            snakeStatuses[otherSnake.id] = collisionResult[otherSnake.id];
            if (snakeStatuses[id].alive === false) { break; }
        }

        snake.health -= 1; //add hazards later
        if (landedOnFood(snake, board)) { snake.health = 100; }
        if (snake.health <= 0) { snakeStatuses[id].alive = false }
    });
    return snakeStatuses
}

export function landedOnFood(snake: Snake, board: GameBoard) {
    const { x, y } = snake.body[0];
    const foodIndex = board.food.findIndex((food) => food.x === x && food.y === y);
    return foodIndex > -1
}

export function isOutOfBounds(snake: Snake, board: GameBoard) {
    // console.log({ body: snake.body, height: board.height, width: board.width })
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
    const outcome = {
        [snake.id]: { alive: true },
        [otherSnake.id]: { alive: true }
    }
    const { x, y } = snake.body[0];
    const otherHead = otherSnake.body[0];
    if (x === otherHead.x && y === otherHead.y) {
        if (snake.body.length === otherSnake.body.length) {
            outcome[snake.id].alive = false;
            outcome[otherSnake.id].alive = false;
            return outcome;
        } else if (snake.body.length > otherSnake.body.length) {
            outcome[otherSnake.id].alive = false;
            return outcome;
        } else {
            outcome[snake.id].alive = false;
            return outcome;
        }
    }

    for (let i = 1; i < otherSnake.body.length; i++) {
        const bodyPart = otherSnake.body[i];
        if (x === bodyPart.x && y === bodyPart.y) {
            outcome[snake.id].alive = false;
            return outcome
        }
    }

    return outcome
}
