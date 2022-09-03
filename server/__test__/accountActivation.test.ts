import { it, expect, vi, afterEach, beforeAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import { createServer } from "../src/utils/server";
import * as UserService from "../src/services/user.service";
import { activateUserHandler } from "../src/controllers/user.controller";

const app = createServer();
afterEach(() => {
  vi.clearAllMocks();
});

const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  email: "bernadette.vogel@web.de",
  password: "$2b$12$4RUurNhh4x9eK5gEn48faeocU61lcPILZ0wAk6vP1YSB4lAwRSg/y",
  userAgent: "PostmanRuntime/7.29.2",
  activationToken:
    "8d45a26add30c9c77c7da6bc8d5501b6106fcb3576d9a9865f717c9fc01ea409d1b00a5a7769f8d593124431a97e9e65da49108a92eec595b110155a841be38d",
  status: 0,
  ips: ["::ffff:127.0.0.1"],
  createdAt: "2022-08-28T20:15:38.683Z",
  updatedAt: "2022-08-28T20:15:38.683Z",
  __v: 0,
};

const ROUTE_ACTIVATE = `/api/user/1.0/activate/${userPayload.activationToken}`;

const req = {
  params: {
    token:
      "8d45a26add30c9c77c7da6bc8d5501b6106fcb3576d9a9865f717c9fc01ea409d1b00a5a7769f8d593124431a97e9e65da49108a92eec595b110155a841be38d",
  },
};
const res = {
  status: vi.fn(() => {
    return { json: vi.fn() };
  }),
};
const next = vi.fn();

it("should call find user with url param once", async () => {
  const findUserServiceMock = vi
    .spyOn(UserService, "findUser")
    .mockReturnValueOnce(Promise.resolve(false));

  // @ts-ignore
  await activateUserHandler(req, res, next);

  expect(findUserServiceMock).toBeCalledTimes(1);
  expect(findUserServiceMock).toHaveBeenCalledWith({
    activationToken: req.params.token,
  });
});

it("should throw 500 status if findUser throws", async () => {
  // @ts-ignore
  vi.spyOn(UserService, "findUser").mockRejectedValueOnce("unknown Error");

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE);

  expect(statusCode).toBe(500);
});

it("should return 404 status if no user is found", async () => {
  // @ts-ignore
  vi.spyOn(UserService, "findUser")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve(false));

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE);

  expect(statusCode).toBe(404);
});

it("should call updateUser once with user and query", async () => {
  // @ts-ignore
  UserService.findUser.mockImplementationOnce(() =>
    Promise.resolve({ ...userPayload })
  );

  const updateUserServiceMock = vi
    .spyOn(UserService, "updateUser")
    // @ts-ignore
    .mockReturnValueOnce({});

  // @ts-ignore
  await activateUserHandler(req, res, next);

  expect(updateUserServiceMock).toBeCalledTimes(1);
  expect(updateUserServiceMock).toBeCalledWith(userPayload, {
    $set: { status: 1 },
  });
});

it("should throw 500 status if updateUser throws", async () => {
  // @ts-ignore
  UserService.findUser.mockImplementationOnce(() =>
    Promise.resolve({ ...userPayload })
  );

  // @ts-ignore
  vi.spyOn(UserService, "updateUser").mockRejectedValueOnce("unknown Error");

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE);

  expect(statusCode).toBe(500);
});

it("should return 202 status if user updated", async() => {
  // @ts-ignore
  UserService.findUser.mockImplementationOnce(() =>
    Promise.resolve({ ...userPayload })
  );

  vi.spyOn(UserService, "updateUser")
    // @ts-ignore
    .mockReturnValueOnce({});

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE);

  expect(statusCode).toBe(202)
});
