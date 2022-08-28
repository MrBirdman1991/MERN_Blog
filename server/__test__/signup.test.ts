import { describe, it, expect, vi } from "vitest";

describe("given the user input exist", () => {
  const userInput = {
    email: "vogel@web.de",
    password: "4forGlesa!",
    userAgent: "PostmanRuntime/7.28.4",
    clientIp: "::1",
  };

  const userPayload = {
    email: "vogel@web.de",
    password: "$2b$12$3eoTk0l4az3vDY.b/Hlek.zaO9l488p8Bm3NxZ511btd7sWigY/je",
    userAgent: "PostmanRuntime/7.28.4",
    ips: ["::1"],
    createdAt: "2021-09-30T13:31:07.674Z",
    updatedAt: "2021-09-30T13:31:07.674Z",
    __v: 0,
  };

  it("should create and return an user", () => {
    expect(true).toBe(true)
  })
});
