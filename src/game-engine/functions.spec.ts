import { describe, expect, test } from "vitest"
import { getBackwardsDirection, getMoveCommands, getMoveOutcomes, getReasonableDirections, getSurvivorsByMove, moveSnake, resolveBoardAndGetSnakeStatuses } from "./functions"


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
                    body: [{ x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 7 }],
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
        });
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
        });

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

describe("Properly gets backwards direction", () => {
    test("up", () => {
        expect(
            getBackwardsDirection({ body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }] } as Snake)
        ).toEqual("up")
    });

    test("down", () => {
        expect(
            getBackwardsDirection({ body: [{ x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }] } as Snake)
        ).toEqual("down")
    });

    test("left", () => {
        expect(
            getBackwardsDirection({ body: [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }] } as Snake)
        ).toEqual("left")
    });

    test("right", () => {
        expect(
            getBackwardsDirection({ body: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] } as Snake)
        ).toEqual("right")
    });
});


describe("Testing directions and move commands calculations", () => {

    test("Reasonable Directions - three small snakes, not using board boundaries", () => {
        const snakes: TrimmedSnake[] = [
            {
                id: "gs_1",
                body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                health: 100,
                squad: ""
            },
            {
                id: "gs_2",
                body: [{ x: 9, y: 4 }, { x: 9, y: 3 }, { x: 9, y: 2 }],
                health: 100,
                squad: ""
            },
            {
                id: "gs_3",
                body: [{ x: 4, y: 9 }, { x: 3, y: 9 }, { x: 2, y: 9 }],
                health: 100,
                squad: ""
            },
        ];
        expect(getReasonableDirections(snakes)).toEqual([
            { id: "gs_1", directions: ["left", "right", "down"] },
            { id: "gs_2", directions: ["left", "right", "up"] },
            { id: "gs_3", directions: ["right", "up", "down"] }
        ])
    });


    test("Reasonable Directions - same three small snakes, but with board boundaries", () => {
        const snakes: TrimmedSnake[] = [
            {
                id: "gs_1",
                body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                health: 100,
                squad: ""
            },
            {
                id: "gs_2",
                body: [{ x: 9, y: 4 }, { x: 9, y: 3 }, { x: 9, y: 2 }],
                health: 100,
                squad: ""
            },
            {
                id: "gs_3",
                body: [{ x: 4, y: 9 }, { x: 3, y: 9 }, { x: 2, y: 9 }],
                health: 100,
                squad: ""
            },
        ];
        expect(getReasonableDirections(snakes, 11, 11)).toEqual([
            { id: "gs_1", directions: ["right"] },
            { id: "gs_2", directions: ["left", "right", "up"] },
            { id: "gs_3", directions: ["right", "up", "down"] }
        ])
    });

    test("Reasonable Directions - one more small snake, checking the other two boundaries", () => {
        const snakes: TrimmedSnake[] = [
            {
                id: "gs_1",
                body: [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 10, y: 8 }],
                health: 100,
                squad: ""
            },
        ];
        expect(getReasonableDirections(snakes, 11, 11)).toEqual([
            { id: "gs_1", directions: ["left"] }
        ])
    });

    test("Move commands - one small snake", () => {
        const input: Array<{ id: string, directions: Direction[] }> = [
            { id: "gs_1", directions: ["left", "right", "down"] },
        ]

        expect(getMoveCommands(input)).toEqual([
            { gs_1: "left" },
            { gs_1: "right" },
            { gs_1: "down" },
        ])
    });


    test("Move commands - two small snakes", () => {
        const input: Array<{ id: string, directions: Direction[] }> = [
            { id: "gs_1", directions: ["left", "right", "down"] },
            { id: "gs_2", directions: ["left", "up"] },
        ]

        expect(getMoveCommands(input)).toEqual([
            { gs_1: "left", gs_2: "left" },
            { gs_1: "left", gs_2: "up" },
            { gs_1: "right", gs_2: "left" },
            { gs_1: "right", gs_2: "up" },
            { gs_1: "down", gs_2: "left" },
            { gs_1: "down", gs_2: "up" },
        ])
    });

    test("Move commands - three small snakes", () => {
        const input: Array<{ id: string, directions: Direction[] }> = [
            { id: "gs_1", directions: ["left", "right", "down"] },
            { id: "gs_2", directions: ["left", "right", "up"] },
            { id: "gs_3", directions: ["right", "up", "down"] }
        ];

        expect(getMoveCommands(input)).toEqual([
            { gs_1: "left", gs_2: "left", gs_3: "right" },
            { gs_1: "left", gs_2: "left", gs_3: "up" },
            { gs_1: "left", gs_2: "left", gs_3: "down" },
            { gs_1: "left", gs_2: "right", gs_3: "right" },
            { gs_1: "left", gs_2: "right", gs_3: "up" },
            { gs_1: "left", gs_2: "right", gs_3: "down" },
            { gs_1: "left", gs_2: "up", gs_3: "right" },
            { gs_1: "left", gs_2: "up", gs_3: "up" },
            { gs_1: "left", gs_2: "up", gs_3: "down" },
            { gs_1: "right", gs_2: "left", gs_3: "right" },
            { gs_1: "right", gs_2: "left", gs_3: "up" },
            { gs_1: "right", gs_2: "left", gs_3: "down" },
            { gs_1: "right", gs_2: "right", gs_3: "right" },
            { gs_1: "right", gs_2: "right", gs_3: "up" },
            { gs_1: "right", gs_2: "right", gs_3: "down" },
            { gs_1: "right", gs_2: "up", gs_3: "right" },
            { gs_1: "right", gs_2: "up", gs_3: "up" },
            { gs_1: "right", gs_2: "up", gs_3: "down" },
            { gs_1: "down", gs_2: "left", gs_3: "right" },
            { gs_1: "down", gs_2: "left", gs_3: "up" },
            { gs_1: "down", gs_2: "left", gs_3: "down" },
            { gs_1: "down", gs_2: "right", gs_3: "right" },
            { gs_1: "down", gs_2: "right", gs_3: "up" },
            { gs_1: "down", gs_2: "right", gs_3: "down" },
            { gs_1: "down", gs_2: "up", gs_3: "right" },
            { gs_1: "down", gs_2: "up", gs_3: "up" },
            { gs_1: "down", gs_2: "up", gs_3: "down" }
        ])
    })

});



describe("Get move outcomes", () => {
    test("One small snake", () => {
        const trimmedBoard: {
            width: GameBoard["width"];
            height: GameBoard["height"];
            food: GameBoard["food"];
            hazards: GameBoard["hazards"];
            snakes: Array<TrimmedSnake>
        } = {
            width: 11,
            height: 11,
            food: [],
            hazards: [],
            snakes: [
                {
                    id: "gs_1",
                    body: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }],
                    health: 100,
                    squad: ""
                }
            ]
        }

        const outcomes = [
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 }], health: 99, squad: "", lastMoved: "left" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true }
                }
            },
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 }], health: 99, squad: "", lastMoved: "right" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true }
                }
            },
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }], health: 99, squad: "", lastMoved: "down" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true }
                }
            }
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    });

    test("One small snake against a corner", () => {
        const trimmedBoard: {
            width: GameBoard["width"];
            height: GameBoard["height"];
            food: GameBoard["food"];
            hazards: GameBoard["hazards"];
            snakes: Array<TrimmedSnake>
        } = {
            width: 11,
            height: 11,
            food: [],
            hazards: [],
            snakes: [
                {
                    id: "gs_1",
                    body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                    health: 100,
                    squad: ""
                }
            ]
        }

        const outcomes = [
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }], health: 99, squad: "", lastMoved: "right" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true }
                }
            }
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    });

    test("Two small snakes against opposite corners", () => {
        const trimmedBoard: {
            width: GameBoard["width"];
            height: GameBoard["height"];
            food: GameBoard["food"];
            hazards: GameBoard["hazards"];
            snakes: Array<TrimmedSnake>
        } = {
            width: 11,
            height: 11,
            food: [],
            hazards: [],
            snakes: [
                {
                    id: "gs_1",
                    body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                    health: 100,
                    squad: ""
                },
                {
                    id: "gs_2",
                    body: [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 10, y: 8 }],
                    health: 100,
                    squad: ""
                }
            ]
        }

        const outcomes = [
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [{ x: 9, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 9 }], health: 99, squad: "", lastMoved: "left" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true },
                    gs_2: { alive: true }
                }
            }
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    });

    test("Two small snakes, one against corner, one against wall", () => {
        const trimmedBoard: {
            width: GameBoard["width"];
            height: GameBoard["height"];
            food: GameBoard["food"];
            hazards: GameBoard["hazards"];
            snakes: Array<TrimmedSnake>
        } = {
            width: 11,
            height: 11,
            food: [],
            hazards: [],
            snakes: [
                {
                    id: "gs_1",
                    body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                    health: 100,
                    squad: ""
                },
                {
                    id: "gs_2",
                    body: [{ x: 10, y: 8 }, { x: 10, y: 7 }, { x: 10, y: 6 }],
                    health: 100,
                    squad: ""
                }
            ]
        }

        const outcomes = [
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [{ x: 9, y: 8 }, { x: 10, y: 8 }, { x: 10, y: 7 }], health: 99, squad: "", lastMoved: "left" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true },
                    gs_2: { alive: true }
                }
            },
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [{ x: 10, y: 9 }, { x: 10, y: 8 }, { x: 10, y: 7 }], health: 99, squad: "", lastMoved: "up" }
                    ],
                    width: 11
                },
                statuses: {
                    gs_1: { alive: true },
                    gs_2: { alive: true }
                }
            },
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    })

    test("Getting move survivors - then multi-round of outcome simulation", () => {
        const exampleBoard = {
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'gs_ptxF68hPjTwRtvgFmyFM3xbV',
                    name: 'The Snakening Continues',
                    latency: '31',
                    health: 93,
                    body: [{ x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }],
                    head: { x: 7, y: 2 },
                    length: 4,
                    shout: 'AHHHHHHHH I\'M A SNAKE',
                    squad: '',
                    customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
                },
                {
                    id: 'gs_6G9xhJ8fVvfvRfqQ4XR43SbR',
                    name: 'Hungry Bot',
                    latency: '1',
                    health: 93,
                    body: [{ x: 3, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 4, y: 3 }],
                    head: { x: 4, y: 5 },
                    length: 4,
                    shout: '',
                    squad: '',
                    customizations: { color: '#00cc00', head: 'alligator', tail: 'alligator' }
                }
            ],
            food: [{ x: 5, y: 5 }, { x: 8, y: 1 }],
            hazards: []
        }

        const mySnakeId = "gs_ptxF68hPjTwRtvgFmyFM3xbV";
        const outcomes = getMoveOutcomes(exampleBoard);
        const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);
        expect(moveSurvivors).toEqual({
            left: { enemiesAlive: 2, mySnakeAlive: 3 },
            right: { enemiesAlive: 3, mySnakeAlive: 3 },
            down: { enemiesAlive: 3, mySnakeAlive: 0 },
        });

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

        let numberOfNewOutcomes = 0;
        stillAliveOutcomes.forEach(outcome => {
            if (!originalMoveDirectionsAndSurvivors[outcome.originalMove]) {
                originalMoveDirectionsAndSurvivors[outcome.originalMove] = [];
            }
            const newSetOfOutcomes = getMoveOutcomes(outcome.gameBoard);
            numberOfNewOutcomes += newSetOfOutcomes.length;
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
        console.log(chosenMove);
    });


})