import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import { createServer } from "../../src/utils/server";
import * as UserService from "../../src/services/user.service";
import { signUpHandler } from "../../src/controllers/user.controller";

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
    get: (_x: string) => "PostmanRuntime/7.29.2",
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
    expect(findUserServiceMock).toHaveBeenCalledWith({email: req.body.email});
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

  it("should call createUser once with user param if user not exists", async () => {
    // @ts-ignore
    UserService.findUser.mockImplementationOnce(() => Promise.resolve(false));

    const createUserServiceMock = vi
      .spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValueOnce(Promise.resolve({ ...userPayload }));

    // @ts-ignore
    await signUpHandler(req, res, next);

    expect(createUserServiceMock).toBeCalledTimes(1);
    expect(createUserServiceMock).toHaveBeenCalledWith({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.get("UserAgent"),
      clientIp: req.clientIp,
    });
  });

  it("should throw 500 status if createUser throws", async () => {
    // @ts-ignore
    UserService.findUser.mockImplementationOnce(() => Promise.resolve(false));
    vi.spyOn(UserService, "createUser").mockRejectedValueOnce("unknown Error");

    const { statusCode } = await request(app)
      .post(ROUTE_SIGNUP)
      .send({ ...req.body });

    expect(statusCode).toBe(500);
  });

  it("should return userPayload with 201 status if user not exists in db", async () => {
    // @ts-ignore
    UserService.findUser.mockImplementationOnce(() => Promise.resolve(false));

    vi.spyOn(UserService, "createUser")
      // @ts-ignore
      .mockResolvedValueOnce(Promise.resolve({ ...userPayload }));

    const { statusCode, body } = await request(app)
      .post(ROUTE_SIGNUP)
      .send({ ...req.body });

    expect(statusCode).toBe(201);
    expect(body).toEqual(userPayload);
  });
});

describe("given the user input doesn't exist", () => {
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
          .post(ROUTE_SIGNUP)
          .send(user);
        const singleError = body.filter((item: any) => item.path[1] === field);
        expect(singleError[0].message).toBe(expectedMessage);
        expect(statusCode).toBe(422);
      });
    }
  );
});


