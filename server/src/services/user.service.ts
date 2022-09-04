import User, { UserInput, UserDocument } from "../models/user.model";
import { FilterQuery} from "mongoose";
import { UserStatus } from "../models/user.model";

export const createUser = async (userData: UserInput) => {
  return await User.create({
    email: userData.email,
    password: userData.password,
    userAgent: userData.userAgent,
    ips: [userData.clientIp],
  });
};

export async function findUser(query: FilterQuery<UserDocument>) {
  const user = await User.findOne(query);
  if (!query || !user) return false;

  return user;
}

export async function activateUser(token: string) {
  const updatedUser = await User.findOneAndUpdate(
    { activationToken: token },
    { $set: { status: UserStatus.active, activationToken: "" } },
    { new: true }
  );
  
  if(!token || !updatedUser) return false;

  return updatedUser;
}
