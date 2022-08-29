import User, { UserDocument, UserInput } from "../models/user.model";
import Mailer from "../utils/Mailer"

const transporter = Mailer.getInstance();

export const createUser = async (userData: UserInput) => {
    return await User.create({
        email: userData.email,
        password: userData.password,
        userAgent: userData.userAgent,
        ips: [userData.clientIp]
    })
};

export async function findUser(email: UserInput["email"]){
    const user = await User.findOne({email});
   if(!email || !user) return false;

   return user;
}

export async function deleteUser(userDocument: UserDocument){
    await userDocument.deleteOne()
}

export async function sendConfirmationMail(user: UserDocument){
  try{
    const url = `${process.env.CLIENT_URI}/?token=${user.activationToken}`
    await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: user.email,
        subject: "Blog registration",
        html: `Bitte auf confirm klicken <a href="${url}">confirm</<a>`
    })
    return true;
  }catch(err){
    return false;
  }
}