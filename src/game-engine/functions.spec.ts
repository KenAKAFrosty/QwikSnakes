import { describe, expect, test } from "vitest"
import {
    getBackwardsDirection,
    getChosenMove,
    getMoveCommands,
    getMoveOutcomes,
    getReasonableDirections,
    getSurvivorsByMove,
    moveSnake,
    resolveBoardAndGetSnakeAliveStatuses
} from "./functions"
import { Direction, Snake, TrimmedBoard, TrimmedSnake } from "./types";



describe("Game engine", () => {
    test("resolve board basic life", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ["width", 11],
            ["height", 11],
            ["food", [[10, 2], [5, 5], [3, 2]]],
            ["snakes", [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 9], [9, 8], [9, 7]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 94,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    squad: '',
                }
            ]],
            ["hazards", []]
        ]))).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', true],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))
    });

    test("resolve board ate own neck", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ['height', 11],
            ['width', 11],
            ['snakes', [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 8], [9, 8], [9, 7]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 94,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    squad: '',
                }
            ]],
            ['food', [[10, 2], [5, 5], [3, 2]]],
            ['hazards', []]
        ]))).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]));

        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ['height', 11],
            ['width', 11],
            ['snakes', [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 7], [9, 8], [9, 7]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 94,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    squad: '',
                }
            ]],
            ['food', [[10, 2], [5, 5], [3, 2]]],
            ['hazards', []]
        ]))).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]));
    });


    test("resolve board basic out of bounds death", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ['height', 11],
            ['width', 11],
            ['snakes', [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 11], [9, 10], [9, 9]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 94,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    squad: '',
                }
            ]],
            ['food', [[10, 2], [5, 5], [3, 2]]],
            ['hazards', []]
        ]))).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))

        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ['height', 11],
            ['width', 11],
            ['snakes', [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 11], [9, 10], [9, 9]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 94,
                    body: [[4, -1], [4, 0], [4, 1], [4, 2]],
                    squad: '',
                }
            ]],
            ['food', [[10, 2], [5, 5], [3, 2]]],
            ['hazards', []]
        ]))).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', false]
        ]));

    });

    test("resolve board health loss / food consumption", () => {
        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ['height', 11],
            ['width', 11],
            ['snakes', [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 9], [9, 8], [9, 7]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 1,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    squad: '',
                }
            ]],
            ['food', [[10, 2], [5, 5], [3, 2]]],
            ['hazards', []]
        ])
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', true],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', false]
        ]));


        expect(resolveBoardAndGetSnakeAliveStatuses(new Map<keyof TrimmedBoard, any>([
            ['height', 11],
            ['width', 11],
            ['snakes', [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[9, 9], [9, 8], [9, 7]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 1,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    shout: '',
                }
            ]],
            ["food", [[10, 2], [4, 4], [3, 2]]],
            ["hazards", []]
        ])
        )).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', true],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))
    })
});


describe("Moving snake", () => {

    test("Basic moves - right", () => {
        const snake: Pick<TrimmedSnake, "body"> = {
            body: [[0, 0], [0, 1], [0, 2]]
        }
        moveSnake(snake as TrimmedSnake, "right");
        expect(snake.body).toEqual([[1, 0], [0, 0], [0, 1]])
    })
    test("Basic moves - up", () => {
        const snake: Pick<TrimmedSnake, "body"> = {
            body: [[0, 0], [1, 0], [2, 0]]
        }
        moveSnake(snake as TrimmedSnake, "up");
        expect(snake.body).toEqual([[0, 1], [0, 0], [1, 0]])
    })
    test("Basic moves - left", () => {
        const snake: Pick<TrimmedSnake, "body"> = {
            body: [[3, 0], [3, 1], [3, 2]]
        }
        moveSnake(snake as TrimmedSnake, "left");
        expect(snake.body).toEqual([[2, 0], [3, 0], [3, 1]])
    })
    test("Basic moves - down", () => {
        const snake: Pick<TrimmedSnake, "body"> = {
            body: [[3, 3], [2, 3], [1, 3]]
        }
        moveSnake(snake as TrimmedSnake, "down");
        expect(snake.body).toEqual([[3, 2], [3, 3], [2, 3]])
    })

    test("Moving down after just ate food (stacked tail)", () => {
        const snake: Pick<TrimmedSnake, "body"> = {
            body: [[3, 3], [2, 3], [1, 3], [1, 3]]
        }
        moveSnake(snake as TrimmedSnake, "down");
        expect(snake.body).toEqual([[3, 2], [3, 3], [2, 3], [1, 3]])
    })
});

describe("Perform move on snake then assess outcome", () => {
    test("basic move. if goes left, will be out of bounds", () => {
        const board = new Map<keyof TrimmedBoard, any>([
            ["height", 11],
            ["width", 11],
            ["snakes", [
                {
                    id: 'gs_yjxcD4dGd9yVF6ycGW6bW8gb',
                    health: 92,
                    body: [[0, 9], [0, 8], [0, 7]],
                    squad: '',
                },
                {
                    id: 'gs_x8HRCtPFT7cHFwwhMWQGWTW4',
                    health: 94,
                    body: [[4, 4], [4, 3], [3, 3], [2, 3]],
                    shout: '',
                }
            ]],
            ["food", [[10, 2], [4, 4], [3, 2]]],
            ["hazards", []]
        ]);

        moveSnake(board.get("snakes")[0], "left");
        expect(resolveBoardAndGetSnakeAliveStatuses(board)).toEqual(new Map([
            ['gs_yjxcD4dGd9yVF6ycGW6bW8gb', false],
            ['gs_x8HRCtPFT7cHFwwhMWQGWTW4', true]
        ]))
    });
})

describe("Properly gets backwards direction", () => {
    test("up", () => {
        expect(
            getBackwardsDirection({ body: [[0, 0], [0, 1], [0, 2]] } as TrimmedSnake)
        ).toEqual("up")
    });

    test("down", () => {
        expect(
            getBackwardsDirection({ body: [[0, 2], [0, 1], [0, 0]] } as TrimmedSnake)
        ).toEqual("down")
    });

    test("left", () => {
        expect(
            getBackwardsDirection({ body: [[2, 0], [1, 0], [0, 0]] } as TrimmedSnake)
        ).toEqual("left")
    });

    test("right", () => {
        expect(
            getBackwardsDirection({ body: [[0, 0], [1, 0], [2, 0]] } as TrimmedSnake)
        ).toEqual("right")
    });
});


describe("Testing directions and move commands calculations", () => {

    test("Reasonable Directions - three small snakes, not using board boundaries", () => {
        const snakes: TrimmedSnake[] = [
            {
                id: "gs_1",
                body: [[0, 0], [0, 1], [0, 2]],
                health: 100,
                squad: ""
            },
            {
                id: "gs_2",
                body: [[9, 4], [9, 3], [9, 2]],
                health: 100,
                squad: ""
            },
            {
                id: "gs_3",
                body: [[4, 9], [3, 9], [2, 9]],
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
                body: [[0, 0], [0, 1], [0, 2]],
                health: 100,
                squad: ""
            },
            {
                id: "gs_2",
                body: [[9, 4], [9, 3], [9, 2]],
                health: 100,
                squad: ""
            },
            {
                id: "gs_3",
                body: [[4, 9], [3, 9], [2, 9]],
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
                body: [[10, 10], [10, 9], [10, 8]],
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
        const trimmedBoard = new Map<keyof TrimmedBoard, any>([
            ["width", 11],
            ["height", 11],
            ["food", []],
            ["hazards", []],
            ["snakes", [
                {
                    id: "gs_1",
                    body: [[5, 5], [5, 6], [5, 7]],
                    health: 100,
                    squad: ""
                }
            ]]
        ]);

        const outcomes = [
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[4, 5], [5, 5], [5, 6]], health: 99, squad: "", lastMoved: "left" }
                    ]]
                ]),
                statuses: new Map([
                    ["gs_1", true]
                ])
            },
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[6, 5], [5, 5], [5, 6]], health: 99, squad: "", lastMoved: "right" }
                    ]]
                ]),
                statuses: new Map([
                    ["gs_1", true]
                ])
            },
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[5, 4], [5, 5], [5, 6]], health: 99, squad: "", lastMoved: "down" }
                    ]]
                ]),
                statuses: new Map([
                    ["gs_1", true]
                ])
            }
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    });

    test("One small snake against a corner", () => {
        const trimmedBoard = new Map<keyof TrimmedBoard, any>([
            ["width", 11],
            ["height", 11],
            ["food", []],
            ["hazards", []],
            ["snakes", [
                {
                    id: "gs_1",
                    body: [[0, 0], [0, 1], [0, 2]],
                    health: 100,
                    squad: ""
                }
            ]]
        ])

        const outcomes = [
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[1, 0], [0, 0], [0, 1]], health: 99, squad: "", lastMoved: "right" }
                    ]]
                ]),
                statuses: new Map([["gs_1", true]])
            }
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    });

    test("Two small snakes against opposite corners", () => {
        const trimmedBoard = new Map<keyof TrimmedBoard, any>([
            ["width", 11],
            ["height", 11],
            ["food", []],
            ["hazards", []],
            ["snakes", [
                {
                    id: "gs_1",
                    body: [[0, 0], [0, 1], [0, 2]],
                    health: 100,
                    squad: ""
                },
                {
                    id: "gs_2",
                    body: [[10, 10], [10, 9], [10, 8]],
                    health: 100,
                    squad: ""
                }
            ]]
        ]);

        const outcomes = [
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[1, 0], [0, 0], [0, 1]], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [[9, 10], [10, 10], [10, 9]], health: 99, squad: "", lastMoved: "left" }
                    ]]
                ]),
                statuses: new Map([
                    ["gs_1", true],
                    ["gs_2", true]
                ])
            }
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    });

    test("Two small snakes, one against corner, one against wall", () => {
        const trimmedBoard = new Map<keyof TrimmedBoard, any>([
            ["width", 11],
            ["height", 11],
            ["food", []],
            ["hazards", []],
            ["snakes", [
                {
                    id: "gs_1",
                    body: [[0, 0], [0, 1], [0, 2]],
                    health: 100,
                    squad: ""
                },
                {
                    id: "gs_2",
                    body: [[10, 8], [10, 7], [10, 6]],
                    health: 100,
                    squad: ""
                }
            ]]
        ])

        const outcomes = [
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[1, 0], [0, 0], [0, 1]], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [[9, 8], [10, 8], [10, 7]], health: 99, squad: "", lastMoved: "left" }
                    ]]
                ]),
                statuses: new Map([
                    ["gs_1", true],
                    ["gs_2", true]
                ])
            },
            {
                gameBoard: new Map<keyof TrimmedBoard, any>([
                    ["width", 11],
                    ["height", 11],
                    ["food", []],
                    ["hazards", []],
                    ["snakes", [
                        { id: "gs_1", body: [[1, 0], [0, 0], [0, 1]], health: 99, squad: "", lastMoved: "right" },
                        { id: "gs_2", body: [[10, 9], [10, 8], [10, 7]], health: 99, squad: "", lastMoved: "up" }
                    ]]
                ]),
                statuses: new Map([
                    ["gs_1", true],
                    ["gs_2", true]
                ])
            },
        ];

        expect(getMoveOutcomes(trimmedBoard)).toEqual(outcomes)
    })

    test("Getting move survivors - then multi-round of outcome simulation", () => {
        const exampleBoard = new Map<keyof TrimmedBoard, any>([
            ["width", 11],
            ["height", 11],
            ["snakes", [
                {
                    id: 'gs_ptxF68hPjTwRtvgFmyFM3xbV',
                    health: 93,
                    body: [[4, 6], [4, 7], [4, 8], [4, 9], [4, 10]],
                    squad: '',
                },
                {
                    id: 'gs_6G9xhJ8fVvfvRfqQ4XR43SbR',
                    health: 93,
                    body: [[3, 5], [4, 5], [4, 4], [4, 3]],
                    squad: '',
                }
            ]],
            ["food", [[5, 5], [8, 1]]],
            ["hazards", []]
        ]);

        const mySnakeId = "gs_ptxF68hPjTwRtvgFmyFM3xbV";
        const outcomes = getMoveOutcomes(exampleBoard);
        const moveSurvivors = getSurvivorsByMove(outcomes, mySnakeId);
        expect(moveSurvivors).toEqual(new Map([
            ["left", [2, 3]],
            ["right", [3, 3]],
            ["down", [3, 0]]
        ]));
    });
});


test("Speed", () => {

    const testBoard = new Map<keyof TrimmedBoard, any>([
        ["height", 11],
        ["width", 11],
        ["snakes", [
            {
                id: 'gs_hJbrDpT6fMm9SkCGJmt3c4qF',
                name: 'The Snakening Continues',
                health: 98,
                body: [[4, 8], [4, 9], [5, 9]],
                squad: '',
            },
            {
                id: 'gs_qJBgRRyjSqmJDtChfFT3fvC8',
                health: 100,
                body: [[10, 6], [10, 5], [9, 5], [9, 5]],
                squad: '',
            },
            {
                id: 'gs_dMydyR6Tt8ppDkRqHWRpv7R7',
                health: 98,
                body: [[2, 6], [1, 6], [1, 5]],
                squad: '',
            },
            {
                id: 'gs_cCG399q6GcFHCV4Dj3bCf93X',
                health: 100,
                body: [[4, 0], [4, 1], [5, 1], [5, 1]],
                squad: '',
            }
        ]],
        ["food", [[6, 10], [0, 4], [5, 5]]],
        ["hazards", []]
    ]);
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

