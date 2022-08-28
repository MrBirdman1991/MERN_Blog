import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { createServer } from "../src/utils/server";
import * as UserService from "../src/services/user.service";

const registerRoute = "/api/user/1.0/signup";
const app = createServer();

describe("given the user input exist", () => {
  const userInput = {
    email: "bernadette.vogel@web.de",
    password: "4forGlesa!",
    userAgent: "",
    clientIp: "::ffff:127.0.0.1",
  };

  const userId = new mongoose.Types.ObjectId().toString();
  const userPayload = {
    _id: userId,
    email: "bernadette.vogel@web.de",
    password: "$2b$12$4RUurNhh4x9eK5gEn48faeocU61lcPILZ0wAk6vP1YSB4lAwRSg/y",
    userAgent: "PostmanRuntime/7.29.2",
    status: 0,
    ips: ["::ffff:127.0.0.1"],
    createdAt: "2022-08-28T20:15:38.683Z",
    updatedAt: "2022-08-28T20:15:38.683Z",
    __v: 0,
  };

  it("should call findUser service with email param once", async () => {
    const findUserServiceMock = vi
      .spyOn(UserService, "findUser")
      .mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ userPayload });

    await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(findUserServiceMock).toBeCalledTimes(1);
    expect(findUserServiceMock).toHaveBeenCalledWith(userInput.email);
  });

  it("should throw 422 status if user already exists in db", async () => {
    vi.spyOn(UserService, "findUser")
      // @ts-ignore
      .mockResolvedValue(userPayload);

    const { statusCode } = await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(statusCode).toBe(422);
  });

  it("should return 500 status if findUser throws", async () => {
    vi.spyOn(UserService, "findUser").mockRejectedValue(
      "an unknown error occoured"
    );

    const { statusCode } = await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(statusCode).toBe(500);
  });

  it("should call createUser service with userData param once", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    const createUserServiceMock = vi
      .spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ userPayload });

    await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(createUserServiceMock).toBeCalledTimes(1);
    expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
  });

  it("should throw 500 status if createUser throws", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockRejectedValue("an unknown error occoured");

    const { statusCode } = await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(statusCode).toBe(500);
  });

  it("should return userPayload if not exists in db", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    const { body } = await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(body).toEqual({ ...userPayload });
  });
});
