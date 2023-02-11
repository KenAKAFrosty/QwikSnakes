import { type RequestEvent } from "@builder.io/qwik-city"

export const onPost = async (event: RequestEvent) => {
    const game: {
        game: Game,
        turn: number,
        board: GameBoard,
        you: Snake
    } = await event.request.json();
    console.log(game);
    event.headers.set("Content-Type", "application/json");
    event.send(new Response(JSON.stringify({
        move: "up",
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

