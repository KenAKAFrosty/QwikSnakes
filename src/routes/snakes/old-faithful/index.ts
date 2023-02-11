import type { RequestEvent } from "@builder.io/qwik-city";

export const onGet = async (event: RequestEvent) => {
    const config = {
        "apiversion": "1",
        "author": "KenAKAFrosty",
        "color": "#ac7ef4",
        "head": "beluga",
        "tail": "mouse",
        "version": "0.0.1-alpha"
    }
    event.send(new Response(JSON.stringify(config)));
}

export const onPost = async (event: RequestEvent) => {

    event.send(new Response(JSON.stringify({ 
        move: "up",
        shout: "AHHHHHHHH I'M A SNAKE"
    })))
}

