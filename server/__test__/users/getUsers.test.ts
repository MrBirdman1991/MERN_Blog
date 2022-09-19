import { describe, it, expect, vi, afterEach } from "vitest";
import { getUsersHandler } from "../../src/controllers/user.controller";
import * as UserService from "../../src/services/user.service";
import { createServer } from "../../src/utils/server";
import request from "supertest";

const app = createServer();

const req = {
  body: {},
};

const res = {
  status: vi.fn(() => {
    return { json: vi.fn() };
  }),
  locals: {
    page: 0,
  },
};

const next = vi.fn();

const getUsersPayload = {
  content: [],
  actualPage: 0,
  totalPages: 1,
  pageSize: 10,
  query: {},
};

const ROUTE_USERS = "/api/user/1.0/users";

it("should call getUsers with pageQuery once", async () => {
  const getUsersServiveMock = vi
    .spyOn(UserService, "getUsers")
    .mockReturnValueOnce(Promise.resolve(getUsersPayload));
  // @ts-ignore
  await getUsersHandler(req, res, next);

  expect(getUsersServiveMock).toBeCalledTimes(1);
  expect(getUsersServiveMock).toHaveBeenCalledWith(res.locals.page);
});

it("should call 404 when there is no user in db by page", async () => {
  vi.spyOn(UserService, "getUsers").mockReturnValueOnce(Promise.resolve(false));

  const { statusCode } = await request(app).get(ROUTE_USERS);

  expect(statusCode).toBe(404);
});

it("should return getUsersPayload and 200 response if users found in db", async () => {
  vi.spyOn(UserService, "getUsers").mockReturnValueOnce(
    Promise.resolve(getUsersPayload)
  );

  const { statusCode, body } = await request(app).get(ROUTE_USERS);
  
  expect(statusCode).toBe(200);
  expect(body).toEqual(getUsersPayload)
});


it("should throw 500 status if  getUsers throws", async () => {
  //@ts-ignore
  vi.spyOn(UserService, "getUsers").mockRejectedValueOnce("unknown Error");

  const { statusCode } = await request(app).get(ROUTE_USERS).send();

  expect(statusCode).toBe(500);
});
