import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { createServer } from "../../../src/utils/server";
import db from "../../config/database";

import { findUser, createUser } from "../../../src/services/user.service";


const app = createServer();
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
  
  it("should return false if user not exists", async () => {
    const existingUser = await findUser( {email: userInput.email} );
  
    expect(existingUser).toBe(false);
  });

  it("should return an user if exists", async () => {
    const createdUser = await createUser({ ...userInput });
    const existingUser = await findUser({email: userInput.email} );
  
    // @ts-ignore
    expect(createdUser.email).toBe(existingUser.email);
    // @ts-ignore
    expect(createdUser._id).toEqual(existingUser._id);
  });
  