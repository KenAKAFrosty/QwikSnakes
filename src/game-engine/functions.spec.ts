import { describe, expect, test } from "vitest"
import { moveSnake, resolveBoardAndGetSnakeStatuses } from "./functions"


describe("Game engine", () => {
    test("resolve board basic life", () => {
        expect(resolveBoardAndGetSnakeStatuses({
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 9, y: 7 }],
                    head: { x: 9, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 94,
                    body: [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 2 }],
            hazards: []
        }
        )).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: true },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: true }
        })
    });

    test("resolve board ate own neck", () => {
        expect(resolveBoardAndGetSnakeStatuses({
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 9, y: 8 }, { x: 9, y: 8 }, { x: 9, y: 7 }],
                    head: { x: 9, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 94,
                    body: [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 2 }],
            hazards: []
        }
        )).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: false },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: true }
        })
    });


    test("resolve board basic out of bounds death", () => {
        expect(resolveBoardAndGetSnakeStatuses({
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 9, y: 11 }, { x: 9, y: 10 }, { x: 9, y: 9 }],
                    head: { x: 9, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 94,
                    body: [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 2 }],
            hazards: []
        }
        )).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: false },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: true }
        })

        expect(resolveBoardAndGetSnakeStatuses({
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 9, y: 11 }, { x: 9, y: 10 }, { x: 9, y: 9 }],
                    head: { x: 9, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 94,
                    body: [{ x: 4, y: -1 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 2 }],
            hazards: []
        }
        )).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: false },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: false }
        })
    });

    test("resolve board health loss / food consumption", () => {
        expect(resolveBoardAndGetSnakeStatuses({
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 9, y: 7 }],
                    head: { x: 9, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 1,
                    body: [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 2 }],
            hazards: []
        }
        )).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: true },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: false }
        });


        expect(resolveBoardAndGetSnakeStatuses({
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 9, y: 7 }],
                    head: { x: 9, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 1,
                    body: [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 4, y: 4 }, { x: 3, y: 2 }],
            hazards: []
        }
        )).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: true },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: true }
        })
    })
});


describe("Moving snake", () => {

    test("Basic moves - right", () => {
        const snake: Pick<Snake, "body"> = {
            body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
        }
        moveSnake(snake as Snake, "right");
        expect(snake.body).toEqual([{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }])
    })
    test("Basic moves - up", () => {
        const snake: Pick<Snake, "body"> = {
            body: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
        }
        moveSnake(snake as Snake, "up");
        expect(snake.body).toEqual([{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }])
    })
    test("Basic moves - left", () => {
        const snake: Pick<Snake, "body"> = {
            body: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }]
        }
        moveSnake(snake as Snake, "left");
        expect(snake.body).toEqual([{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 1 }])
    })
    test("Basic moves - down", () => {
        const snake: Pick<Snake, "body"> = {
            body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }]
        }
        moveSnake(snake as Snake, "down");
        expect(snake.body).toEqual([{ x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }])
    })

    test("Moving down after just ate food (stacked tail)", () => {
        const snake: Pick<Snake, "body"> = {
            body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 3 }]
        }
        moveSnake(snake as Snake, "down");
        expect(snake.body).toEqual([{ x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }])
    })
});

describe("Perform move on snake then assess outcome", () => {
    test("basic move. if goes left, will be out of bounds", () => {
        const board = {
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    name: 'The Snakening Continues',
                    latency: '128',
                    health: 92,
                    body: [{ x: 0, y: 9 }, { x: 0, y: 8 }, { x: 0, y: 7 }],
                    head: { x: 0, y: 9 },
                    length: 3,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 94,
                    body: [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
                    head: { x: 4, y: 4 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 10, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 2 }],
            hazards: []
        };

        moveSnake(board.snakes[0], "left");
        expect(resolveBoardAndGetSnakeStatuses(board)).toEqual({
            'gs_yjxcD4dGd9yVF6ycGW6bW8gb': { alive: false },
            'gs_x8HRCtPFT7cHFwwhMWQGWTW4': { alive: true }
        })
    });
})