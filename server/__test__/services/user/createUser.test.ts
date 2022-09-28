import "dotenv/config";
import { it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import db from "../../config/database";
import {SMTPServer} from "smtp-server";
import { createUser } from "../../../src/services/user.service";



beforeAll(() => {
  db.connect();
});

afterEach(() => {
  db.reset();
  vi.clearAllMocks();
});

afterAll(() => {
  db.close();
});

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
    activationToken: "8d45a26add30c9c77c7da6bc8d5501b6106fcb3576d9a9865f717c9fc01ea409d1b00a5a7769f8d593124431a97e9e65da49108a92eec595b110155a841be38d",
    ips: ["::1"],
    createdAt: "2021-09-30T13:31:07.674Z",
    updatedAt: "2021-09-30T13:31:07.674Z",
    __v: 0,
  };

  it("should create an user by input", async () => {
    const createdUser = await createUser({ ...userInput });
  
    for (const key in userPayload) {
      expect(createdUser).toHaveProperty(key);
    }
  });

  it("should create an user with hashed password", async () => {
    const createdUser = await createUser({ ...userInput });
  
    expect(createdUser.password).not.toBe(userInput.password);
  });

  it("should create user in inactive mode", async () => {
    const createdUser = await createUser({ ...userInput });
  
    expect(createdUser.status).toBe(0);
  });

  it("should create an user with ips array length of one", async () => {
    const createdUser = await createUser({ ...userInput });
  
    expect(createdUser.ips.length).toBe(1);
  })

  it("should contain an activation token", async () => {
    const createdUser = await createUser({ ...userInput });
  
    expect(createdUser.activationToken).toBeTruthy();
  })

  it("should send an email with activationToken", async() => {
    let lastMail: string;

    const server = new SMTPServer({
      authOptional: true,
      onData(stream, session, callback){
        let mailBody: string;

        stream.on("data", (data) => {
          mailBody += data.toString();
        })
        stream.on("end", () => {
          lastMail = mailBody;
          console.log(mailBody)
          callback();
        })
      }
    })

    await server.listen(8587, "localhost");

    await createUser({...userInput});

    await server.close();
  })