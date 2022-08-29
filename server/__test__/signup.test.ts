import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import stubTransport from "nodemailer-stub-transport";
import nodemailer from "nodemailer";

import { createServer } from "../src/utils/server";
import * as UserService from "../src/services/user.service";

const registerRoute = "/api/user/1.0/signup";
const app = createServer();

const transport = nodemailer.createTransport(stubTransport());

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
    activationToken:
      "8d45a26add30c9c77c7da6bc8d5501b6106fcb3576d9a9865f717c9fc01ea409d1b00a5a7769f8d593124431a97e9e65da49108a92eec595b110155a841be38d",
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
      .mockResolvedValue({ ...userPayload });

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
      .mockResolvedValue({ ...userPayload });

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

  it("should call sendConfirmationMail service with userPayload param once", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    const sendConfirmationMailServiceMock = vi
      .spyOn(UserService, "sendConfirmationMail")
      // @ts-ignore
      .mockResolvedValue(true);

    await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(sendConfirmationMailServiceMock).toBeCalledTimes(1);
    expect(sendConfirmationMailServiceMock).toHaveBeenCalledWith({
      ...userPayload,
    });
  });

  it("should call delete userHandler when sendConfirmationMail throws", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    vi.spyOn(UserService, "sendConfirmationMail")
      // @ts-ignore
      .mockResolvedValue(false);

    const deleteUserServiceMock = vi
      .spyOn(UserService, "deleteUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    await request(app)
      .post(registerRoute)
      .send({ ...userInput });

      
    expect(deleteUserServiceMock).toHaveBeenCalledWith({
      ...userPayload,
    });
    expect(deleteUserServiceMock).toBeCalledTimes(1);
  });

  it("should not call delete userHandler when sendConfirmationMail succeded", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    vi.spyOn(UserService, "sendConfirmationMail")
      // @ts-ignore
      .mockResolvedValue(true);

    const deleteUserServiceMock = vi
      .spyOn(UserService, "deleteUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    await request(app)
      .post(registerRoute)
      .send({ ...userInput });

      
    expect(deleteUserServiceMock).toBeCalledTimes(0);
  });

  it("should return userPayload if not exists in db", async () => {
    vi.spyOn(UserService, "findUser").mockResolvedValue(false);

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValue({ ...userPayload });

    vi.spyOn(UserService, "sendConfirmationMail").mockResolvedValue(true);

    const { body } = await request(app)
      .post(registerRoute)
      .send({ ...userInput });

    expect(body).toEqual({ ...userPayload });
  });
});

describe("given the user input dont exist", () => {
  describe.each([
    ["email", "", "not valid email"],
    ["email", "stanweb.de", "not valid email"],
    ["password", "", "Password too short - should be 6 chars"],
    ["password", "123", "Password too short - should be 6 chars"],
    ["password", "a".repeat(50), "Password can only be 35 chars long"],
    ["password", "adddddd", "Password requires one uppercase char"],
    ["password", "addHdddd", "Password requires one number"],
    ["password", "addHdddd3", "Password requires one spezial char"],
  ])(
    "check validation input %s",
    (field: string, value: string, expectedMessage: string) => {
      it(`should return "${expectedMessage}" if value of "${field}" is wrong`, async () => {
        const user = {
          email: "stan@web.de",
          password: "1234567",
        };
        // @ts-ignore
        user[field] = value;

        const { statusCode, body } = await request(app)
          .post(registerRoute)
          .send(user);
        const singleError = body.filter((item: any) => item.path[1] === field);
        expect(singleError[0].message).toBe(expectedMessage);
        expect(statusCode).toBe(422);
      });
    }
  );
});
