import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import db from "../../config/database";

import { getUsers, createUser } from "../../../src/services/user.service";

beforeAll(() => {
  db.connect();
});

afterEach(() => {
  db.reset();
});

afterAll(() => {
  db.close();
});

const addUsers = async(count: number) =>  {
    for (let i = 0; i < count; i++) {
        await createUser({
          email: `user${i + 1}@gmail.de`,
          password: "123456",
          userAgent: "PostmanRuntime/7.28.4",
          clientIp: "::1",
        });
      }
}

const getUsersPayload = {
  content: [],
  actualPage: 0,
  totalPages: 1,
  pageSize: 10,
  query: {},
};


it("return 10 users when pagesize is 10  and there are 11 users in db", async () => {
  await addUsers(11);  

  const users = await getUsers();
  // @ts-ignore
  expect(users.content.length).toBe(10)
});
