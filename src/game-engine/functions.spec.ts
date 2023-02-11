import {describe, expect, test} from "vitest"
import { add } from "./functions"


describe("Game engine", ()=> { 
    test("add", () => { 
        expect(add(1, 2)).toBe(3)
    })
})