import {it, describe, expect} from "vitest";
import request from "supertest";
import { createServer } from "../src/utils/server";


const app = createServer();
const ROUTE = "/api/helper/1.0"

describe("/api/helper/1.0", () => {
    it("should return 200 if app is running", async() => {
        await request(app).get(`${ROUTE}/healthcheck`).expect(200);
    })
})
