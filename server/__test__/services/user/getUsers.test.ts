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

it("return 11 users when pagesize is 20  and there are 11 users in db and pagesize is not given", async () => {
  await addUsers(11);  

  const users = await getUsers(0, 20);
  // @ts-ignore
  expect(users.content.length).toBe(11)
});

it("should only return users by query", async () => {
  await addUsers(11);  

  const users = await getUsers(0, 10, {email: "user2@gmail.de"});
  // @ts-ignore
  expect(users.content.length).toBe(1)
});

it("should only return users from the second page", async () => {
  await addUsers(15);  

  const users = await getUsers(1, 10);
  // @ts-ignore
  expect(users.content.length).toBe(5)
});

it("should have same keys then payload", async () => {
  await addUsers(1);  

  const users = await getUsers();
  // @ts-ignore
  for (const key in getUsersPayload) {
    expect(users).toHaveProperty(key);
  }
});

it("should filter the users by Date", async () => {
  await createUser({
    email: `userOne@gmail.de`,
    password: "123456",
    userAgent: "PostmanRuntime/7.28.4",
    clientIp: "::1",
  });
  const createdUserTwo = await createUser({
    email: `userTwo@gmail.de`,
    password: "123456",
    userAgent: "PostmanRuntime/7.28.4",
    clientIp: "::1",
  });


  const users = await getUsers();
  // @ts-ignore
  expect(users.content[0].email).toBe(createdUserTwo.email)
});

it("should return false if no user is is found by page", async () => {
  await addUsers(1);  

  const users = await getUsers(65);
  // @ts-ignore
  expect(users).toBe(false)
});