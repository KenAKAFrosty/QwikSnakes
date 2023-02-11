import { type RequestEvent } from "@builder.io/qwik-city"

export const onPost = async (event: RequestEvent) => {

    event.send(new Response(JSON.stringify({
        move: "up",
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

