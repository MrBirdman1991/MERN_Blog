import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach } from "vitest";
import db from "../../config/database";
import mongoose from "mongoose";

import { findUserById, createUser } from "../../../src/services/user.service";

beforeAll(() => {
  db.connect();
});

afterEach(() => {
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
  

const userId = new mongoose.Types.ObjectId().toString();
it("should return false if user not exists", async () => {
  const existingUser = await findUserById(userId);

  expect(existingUser).toBe(false);
});

it("should return an user if exists", async () => {
  const createdUser = await createUser({ ...userInput });
  const existingUser = await findUserById(createdUser._id.toString());

 
  // @ts-ignore
  expect(createdUser._id).toEqual(existingUser._id);
});
