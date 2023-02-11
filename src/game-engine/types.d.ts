type Game = {
    id: string;
    ruleset: {
        name: string;
        version: string;
    };
    timeout: number;
    map: string
    source: "tournament" | "league" | "arena" | "challenge" | "custom"
}

type GameBoard = {
    height: number;
    width: number;
    food: Array<{ x: number, y: number }>;
    hazards: Array<{ x: number, y: number }>;
    snakes: Array<Snake>
}

type Snake = {
    id: string;
    name: string;
    health: number;
    body: Array<{ x: number, y: number }>;
    latency: string;
    head: { x: number, y: number };
    length: number;
    shout: string;
    squad: string;
    customizations: {
        color: string;
        head: string;
        tail: string;
    }
}