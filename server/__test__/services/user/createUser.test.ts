import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { createServer } from "../../../src/utils/server";
import db from "../../config/database";

import { createUser } from "../../../src/services/user.service";

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

const userPayload = {
  email: "vogel@web.de",
  password: "$2b$12$3eoTk0l4az3vDY.b/Hlek.zaO9l488p8Bm3NxZ511btd7sWigY/je",
  userAgent: "PostmanRuntime/7.28.4",
  ips: ["::1"],
  createdAt: "2021-09-30T13:31:07.674Z",
  updatedAt: "2021-09-30T13:31:07.674Z",
  __v: 0,
};

it("should create an user by input", async () => {
  const createdUser = await createUser({ ...userInput });

  for (const key in userPayload) {
    expect(createdUser).toHaveProperty(key);
  }
});

it("should create an user with hashed password", async () => {
  const createdUser = await createUser({ ...userInput });

  expect(createdUser.password).not.toBe(userInput.password);
});

it("should create user in inactive mode", async () => {
  const createdUser = await createUser({ ...userInput });

  expect(createdUser.status).toBe(0);
});

it("should create an user with ips array length of one", async () => {
  const createdUser = await createUser({ ...userInput });

  expect(createdUser.ips.length).toBe(1);
})

