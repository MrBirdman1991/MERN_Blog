import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { createServer } from "../../../src/utils/server";
import db from "../../config/database";

import { createUser, sendConfirmationMail } from "../../../src/services/user.service";

beforeAll(() => {
  db.connect();
});

afterEach(async () => {
  db.reset();
});

afterAll(() => {
  db.close();
});

const userInput = {
    email: "vogel@web.de",
    password: "4forGlesa!",
    userAgent: "PostmanRuntime/7.28.4",
    clientIp: "::1",
  };

  
it("should return true if email was sendet", async() =>{
    const createdUser = await createUser({ ...userInput });

    const isSended = await sendConfirmationMail(createdUser);
    
    expect(isSended).toBe(true);
})

it("should return false if error", async() =>{
   // @ts-ignore
    const isSended = await sendConfirmationMail();
    
    expect(isSended).toBe(false);
})