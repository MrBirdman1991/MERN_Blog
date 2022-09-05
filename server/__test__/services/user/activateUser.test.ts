import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach } from "vitest";
import db from "../../config/database";

import { activateUser, createUser } from "../../../src/services/user.service";


beforeAll(() => {
  db.connect();
});

afterEach(() => {
  db.reset();
});

afterAll(() => {
  db.close();
});


it("should set activationToken to '' and status to 1 ", async () => {
  const userInput = {
    email: "vogel@web.de",
    password: "4forGlesa!",
    userAgent: "PostmanRuntime/7.28.4",
    clientIp: "::1",
  };

  const createdUser = await createUser({ ...userInput });

  const activatedUser = await activateUser(createdUser.activationToken);

  //@ts-ignore
  expect(activatedUser.activationToken).toBe("");
  //@ts-ignore
  expect(activatedUser.status).toBe(1);
});

it("should return false if no user found by token", async() => {
    const activatedUser = await activateUser("not a user");

     //@ts-ignore
     expect(activatedUser).toBe(false);
})

it("should set activationToken to '' and status to 1 ", async () => {
    const userInput = {
      email: "vogel@web.de",
      password: "4forGlesa!",
      userAgent: "PostmanRuntime/7.28.4",
      clientIp: "::1",
    };
  
    const createdUser = await createUser({ ...userInput });
  
    const activatedUser = await activateUser(createdUser.activationToken);
  
    //@ts-ignore
    expect(activatedUser.activationToken).toBe("");
    //@ts-ignore
    expect(activatedUser.status).toBe(1);
  });
  
