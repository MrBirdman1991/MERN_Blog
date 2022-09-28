import nodemailer from "nodemailer";
//@ts-ignore
import nodemailerStub from "nodemailer-stub";
import { UserInput } from "../models/user.model";

const transporter = nodemailer.createTransport(nodemailerStub.stubTransport);

export const sendAccountActivation = async (email: UserInput["email"], activationToken: string) => {
    const url = `${process.env.CLIENT_URI}/${activationToken}`;
    await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: email,
      subject: "Blog registration",
      html: `Bitte auf confirm klicken <a href="${url}">confirm</<a>`,
    });
}