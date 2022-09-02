import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import Request from "express";

import { createServer } from "../src/utils/server";
import * as UserService from "../src/services/user.service";
import { signUpHandler } from "../src/controllers/user.controller";

const ROUTE_SIGNUP = "/api/user/1.0/signup";
const app = createServer();

afterEach(() => {
  vi.clearAllMocks();
});

describe("given the user input exist", () => {
  const req = {
    body: {
      email: "julian.vogel@web.de",
      password: "4forGlesa!",
    },
    clientIp: "::ffff:127.0.0.1",
    get: () => "PostmanRuntime/7.29.2",
  };

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

  const res = {
    status: vi.fn(() => {
      return { json: vi.fn() };
    }),
  };
  const next = vi.fn();

  it("should call findUser service with email param once", async () => {
    const findUserServiceMock = vi
      .spyOn(UserService, "findUser")
      .mockReturnValueOnce(Promise.resolve(false));

    // @ts-ignore
    await signUpHandler(req, res, next);

    expect(findUserServiceMock).toBeCalledTimes(1);
    expect(findUserServiceMock).toHaveBeenCalledWith(req.body.email);
  });

  it("should throw 422 status if user already exists in db", async () => {
    vi.spyOn(UserService, "findUser")
      // @ts-ignore
      .mockReturnValueOnce(Promise.resolve({ ...userPayload }));

    const { statusCode } = await request(app)
      .post(ROUTE_SIGNUP)
      .send({ ...req.body });

    expect(statusCode).toBe(422);
  });

  it("should throw 500 status if findUser throws", async () => {
    // @ts-ignore
    vi.spyOn(UserService, "findUser").mockRejectedValueOnce("unknown Error");

    const { statusCode } = await request(app)
      .post(ROUTE_SIGNUP)
      .send({ ...req.body });

    expect(statusCode).toBe(500);
  });

  it("should call createUser once if user not exists", async () => {
    // @ts-ignore
    UserService.findUser.mockImplementationOnce(() => Promise.resolve(false));

    const createUserServiceMock = vi
      .spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValueOnce(Promise.resolve({ ...userPayload }));

    // @ts-ignore
    await signUpHandler(req, res, next);

    expect(createUserServiceMock).toBeCalledTimes(1);
  });
});
