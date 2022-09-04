import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { createServer } from "../../../src/utils/server";
import db from "../../config/database";

import { activateUser, createUser } from "../../../src/services/user.service";

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

const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  email: "bernadette.vogel@web.de",
  password: "$2b$12$4RUurNhh4x9eK5gEn48faeocU61lcPILZ0wAk6vP1YSB4lAwRSg/y",
  userAgent: "PostmanRuntime/7.29.2",
  activationToken: "",
  status: 1,
  ips: ["::ffff:127.0.0.1"],
  createdAt: "2022-08-28T20:15:38.683Z",
  updatedAt: "2022-08-28T20:15:38.683Z",
  __v: 0,
};

const req = {
  params: {
    token:
      "8d45a26add30c9c77c7da6bc8d5501b6106fcb3576d9a9865f717c9fc01ea409d1b00a5a7769f8d593124431a97e9e65da49108a92eec595b110155a841be38d",
  },
};

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
  
