import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import * as UserService from "../../src/services/user.service";
import { createServer } from "../../src/utils/server";
import { loginUserHandler } from "../../src/controllers/user.controller";

const ROUTE_LOGIN = "/api/user/1.0/login";
const app = createServer();

afterEach(() => {
  vi.clearAllMocks();
});

const req = {
  body: {
    email: "julian.vogel@web.de",
    password: "4forGlesa!",
  },
  clientIp: "::ffff:127.0.0.1",
  get: (_x: string) => "PostmanRuntime/7.29.2",
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
  activationToken:
    "8d45a26add30c9c77c7da6bc8d5501b6106fcb3576d9a9865f717c9fc01ea409d1b00a5a7769f8d593124431a97e9e65da49108a92eec595b110155a841be38d",
  status: 0,
  ips: ["::ffff:127.0.0.1"],
  createdAt: "2022-08-28T20:15:38.683Z",
  updatedAt: "2022-08-28T20:15:38.683Z",
  __v: 0,
};

describe("given the user input is correct", () => {
  it("should call findUser service with email param once", async () => {
    const findUserServiceMock = vi
      .spyOn(UserService, "findUser")
      .mockReturnValueOnce(Promise.resolve(false));

    // @ts-ignore
    await loginUserHandler(req, res, next);

    expect(findUserServiceMock).toBeCalledTimes(1);
    expect(findUserServiceMock).toHaveBeenCalledWith({ email: req.body.email });
  });

  it("should return 401 status if no user is found", async () => {
    vi.spyOn(UserService, "findUser")
      // @ts-ignore
      .mockReturnValueOnce(Promise.resolve(false));

    const { statusCode } = await request(app)
      .post(ROUTE_LOGIN)
      .send({ ...req.body });

    expect(statusCode).toBe(401);
  });

  it("should return 401 status if found user status is 0", async () => {
    vi.spyOn(UserService, "findUser")
      // @ts-ignore
      .mockReturnValueOnce(Promise.resolve({ ...userPayload }));

    const { statusCode } = await request(app)
      .post(ROUTE_LOGIN)
      .send({ ...req.body });

    expect(statusCode).toBe(401);
  });

  it("should return 500 status if findUser service throws", async () => {
    // @ts-ignore
    vi.spyOn(UserService, "findUser").mockRejectedValueOnce("unknown Error");

    const { statusCode } = await request(app)
      .post(ROUTE_LOGIN)
      .send({ ...req.body });

    expect(statusCode).toBe(500);
  });

 
});

describe("given the user input isn't correct", () => {
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
          .post(ROUTE_LOGIN)
          .send(user);
        const singleError = body.filter((item: any) => item.path[1] === field);
        expect(singleError[0].message).toBe(expectedMessage);
        expect(statusCode).toBe(422);
      });
    }
  );
});
