import { it, expect, vi, afterEach } from "vitest";
import * as UserService from "../../src/services/user.service";
import mongoose from "mongoose";
import { getUserHandler } from "../../src/controllers/user.controller";
import { createServer } from "../../src/utils/server";
import request from "supertest";

const USER_ROUTE = "/api/user/1.0/users/631d9c5a6bd4408b83ded18b";

const app = createServer();
afterEach(() => {
  vi.clearAllMocks();
});

const req = {
  params: {
    id: "631d9c5a6bd4408b83ded18b",
  },
};
const res = {
  status: vi.fn(() => {
    return { json: vi.fn() };
  }),
};
const next = vi.fn();

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

it("should call find user with id param once", async () => {
  const findeUserServiceMock = vi
    .spyOn(UserService, "findUserById")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve(userPayload));

  // @ts-ignore
  await getUserHandler(req, res, next);

  expect(findeUserServiceMock).toBeCalledTimes(1);
  expect(findeUserServiceMock).toBeCalledWith(req.params.id);
});

it("should throw 500 if findUserById throws", async () => {
  vi.spyOn(UserService, "findUserById")
    // @ts-ignore
    .mockRejectedValueOnce("unknown Error");

  // @ts-ignore
  const { statusCode } = await request(app).get(USER_ROUTE).send();

  expect(statusCode).toBe(500);
});

it("should return 404 status if no user found", async () => {
  vi.spyOn(UserService, "findUserById")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve(false));

  // @ts-ignore
  const { statusCode } = await request(app).get(USER_ROUTE).send();

  expect(statusCode).toBe(404);
});

it("should return existing User with 200 status", async () => {
  vi.spyOn(UserService, "findUserById")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve(userPayload));

  // @ts-ignore
  const { statusCode, body } = await request(app).get(USER_ROUTE).send();

  expect(statusCode).toBe(200);
  expect(body).toEqual(userPayload);
});
