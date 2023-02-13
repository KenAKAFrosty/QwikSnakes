import { describe, expect, test } from "vitest"
import { getChosenMove } from "~/routes/snakes/old-faithful/move";
import { getBackwardsDirection, getEasyAccessMapFromBoard, getMoveCommands, getMoveOutcomes, getReasonableDirections, getSurvivorsByMove, moveSnake, resolveBoardAndGetSnakeAliveStatuses } from "./functions"


describe("Game engine", () => {
    test("resolve board basic life", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', true],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))
    });

    test("resolve board ate own neck", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]));



        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]));
    });


    test("resolve board basic out of bounds death", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))

        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', false]
        ]));

    });

    test("resolve board health loss / food consumption", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', true],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', false]
        ]));


        expect(resolveBoardAndGetSnakeAliveStatuses({
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
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', true],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))
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
        expect(resolveBoardAndGetSnakeAliveStatuses(board)).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))
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
                statuses: new Map([
                    ["gs_1", true]
                ])
            },
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 }], health: 99, squad: "", lastMoved: "right" }
                    ],
                    width: 11
                },
                statuses: new Map([
                    ["gs_1", true]
                ])
            },
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }], health: 99, squad: "", lastMoved: "down" }
                    ],
                    width: 11
                },
                statuses: new Map([
                    ["gs_1", true]
                ])
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
                statuses: new Map([["gs_1", true]])
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
                statuses: new Map([
                    ["gs_1", true],
                    ["gs_2", true]
                ])
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
                statuses: new Map([
                    ["gs_1", true],
                    ["gs_2", true]
                ])
            },
            {
                gameBoard: {
                    food: [], hazards: [], height: 11, snakes: [
                        { id: "gs_1", body: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [{ x: 10, y: 9 }, { x: 10, y: 8 }, { x: 10, y: 7 }], health: 99, squad: "", lastMoved: "up" }
                    ],
                    width: 11
                },
                statuses: new Map([
                    ["gs_1", true],
                    ["gs_2", true]
                ])
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
    });


});

describe("Grid from Board", () => {

    test("just one small snake no others", () => {

        expect(getEasyAccessMapFromBoard({
            height: 11,
            width: 11,
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
        })).toEqual({
            [0.0]: ["head:gs_1"],
            [0.01]: ["body:gs_1"],
            [0.02]: ["body:gs_1"],
        });

    });

    test("Using 10 y value to demonstrate its behavior", () => {

        expect(getEasyAccessMapFromBoard({
            height: 11,
            width: 11,
            food: [],
            hazards: [],
            snakes: [
                {
                    id: "gs_1",
                    body: [
                        { x: 0, y: 10 },
                        { x: 1, y: 10 },
                        { x: 2, y: 10 },
                        { x: 3, y: 10 },
                        { x: 4, y: 10 },
                        { x: 5, y: 10 },
                        { x: 6, y: 10 },
                        { x: 7, y: 10 },
                        { x: 8, y: 10 },
                        { x: 9, y: 10 },
                        { x: 10, y: 10 },
                    ],
                    health: 100,
                    squad: ""
                }
            ]
        })).toEqual({
            [0.1]: ["head:gs_1"],
            [1.1]: ["body:gs_1"],
            [2.1]: ["body:gs_1"],
            [3.1]: ["body:gs_1"],
            [4.1]: ["body:gs_1"],
            [5.1]: ["body:gs_1"],
            [6.1]: ["body:gs_1"],
            [7.1]: ["body:gs_1"],
            [8.1]: ["body:gs_1"],
            [9.1]: ["body:gs_1"],
            [10.1]: ["body:gs_1"],
        })
    })

    test("no snakes just food and hazards", () => {

        expect(getEasyAccessMapFromBoard({
            height: 11,
            width: 11,
            food: [
                { x: 0, y: 0 },
                { x: 2, y: 4 },
            ],
            hazards: [
                { x: 0, y: 0 },
                { x: 3, y: 7 },
            ],
            snakes: []
        })).toEqual({
            [0.0]: ["food:", "hzrd:"],
            [2.04]: ["food:"],
            [3.07]: ["hzrd:"],
        });

    });

    test("all of em", () => {

        expect(getEasyAccessMapFromBoard({
            height: 11,
            width: 11,
            food: [
                { x: 0, y: 10 }
            ],
            hazards: [
                { x: 0, y: 10 },
            ],
            snakes: [
                {
                    id: "gs_1",
                    body: [
                        { x: 0, y: 10 },
                        { x: 1, y: 10 },
                        { x: 2, y: 10 },
                    ],
                    health: 100,
                    squad: ""
                }
            ]
        })).toEqual({
            [0.1]: ["food:", "hzrd:", "head:gs_1"],
            [1.1]: ["body:gs_1"],
            [2.1]: ["body:gs_1"],
        });

    });
})















test("Speed", () => {

    const testBoard = {
        height: 11,
        width: 11,
        snakes: [
            {
                id: 'gs_hJbrDpT6fMm9SkCGJmt3c4qF',
                name: 'The Snakening Continues',
                latency: '217',
                health: 98,
                body: [{ x: 4, y: 8 }, { x: 4, y: 9 }, { x: 5, y: 9 }],
                head: { x: 4, y: 8 },
                length: 3,
                shout: 'I HAVE NO MOUTH BUT I MUST SCREAM',
                squad: '',
                customizations: { color: '#ac7ef4', head: 'beluga', tail: 'mouse' }
            },
            {
                id: 'gs_qJBgRRyjSqmJDtChfFT3fvC8',
                name: 'alpha',
                latency: '101',
                health: 100,
                body: [{ x: 10, y: 6 }, { x: 10, y: 5 }, { x: 9, y: 5 }, { x: 9, y: 5 }],
                head: { x: 10, y: 6 },
                length: 4,
                shout: '',
                squad: '',
                customizations: { color: '#3e338f', head: 'evil', tail: 'flame' }
            },
            {
                id: 'gs_dMydyR6Tt8ppDkRqHWRpv7R7',
                name: 'Unicorn',
                latency: '98',
                health: 98,
                body: [{ x: 2, y: 6 }, { x: 1, y: 6 }, { x: 1, y: 5 }],
                head: { x: 2, y: 6 },
                length: 3,
                shout: '',
                squad: '',
                customizations: { color: '#f562f0', head: 'scarf', tail: 'present' }
            },
            {
                id: 'gs_cCG399q6GcFHCV4Dj3bCf93X',
                name: 'Stupid snake (Just getting started)',
                latency: '42',
                health: 100,
                body: [{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 1 }],
                head: { x: 4, y: 0 },
                length: 4,
                shout: '',
                squad: '',
                customizations: { color: '#00ff00', head: 'alligator', tail: 'alligator' }
            }
        ],
        food: [{ x: 6, y: 10 }, { x: 0, y: 4 }, { x: 5, y: 5 }],
        hazards: []
    }
    const times = [];

    for (let i = 0; i < 1; i++) {
        const start = Date.now();
        const choseMove = getChosenMove(testBoard, "gs_hJbrDpT6fMm9SkCGJmt3c4qF");
        const end = Date.now();
        times.push(end - start);
    }
    const worstTime = Math.max(...times);
    const bestTime = Math.min(...times);
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(times);
    console.log({ worstTime, bestTime, averageTime });
})

