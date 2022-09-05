import { it, expect, vi, afterEach } from "vitest";
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
const res = {
  status: vi.fn(() => {
    return { json: vi.fn() };
  }),
};
const next = vi.fn();

const ROUTE_ACTIVATE = `/api/user/1.0/activate/${req.params.token}`;

it("should call activateUser with url param once", async () => {
  const activateUserServiceMock = vi
    .spyOn(UserService, "activateUser")
    .mockReturnValueOnce(Promise.resolve({ ...userPayload }));

  // @ts-ignore
  await activateUserHandler(req, res, next);

  expect(activateUserServiceMock).toBeCalledTimes(1);
  expect(activateUserServiceMock).toHaveBeenCalledWith(req.params.token);
});

it("should throw 500 status if activateUser throws", async () => {
  //@ts-ignore
  vi.spyOn(UserService, "activateUser").mockRejectedValueOnce("unknown Error");

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE).send();

  expect(statusCode).toBe(500);
});

it("should return 404 status if no user is found", async () => {
  // @ts-ignore
  vi.spyOn(UserService, "activateUser")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve(false));

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE);

  expect(statusCode).toBe(404);
});

it("should return 202 status if user updated", async () => {
  // @ts-ignore
  vi.spyOn(UserService, "activateUser")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve({ ...userPayload }));

  const { statusCode } = await request(app).get(ROUTE_ACTIVATE);

  expect(statusCode).toBe(202);
});

it("should return activation token of '' and status of 1 if update succeded", async () => {
  // @ts-ignore
  vi.spyOn(UserService, "activateUser")
    // @ts-ignore
    .mockReturnValueOnce(Promise.resolve({ ...userPayload }));

  const { body } = await request(app).get(ROUTE_ACTIVATE);

  expect(body.activationToken).toBe("");
  expect(body.status).toBe(1);
});
