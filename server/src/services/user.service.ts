import User, { UserInput, UserDocument } from "../models/user.model";
import { FilterQuery } from "mongoose";
import { UserStatus } from "../models/user.model";

export const createUser = async (userData: UserInput) => {
  return await User.create({
    email: userData.email,
    password: userData.password,
    userAgent: userData.userAgent,
    ips: [userData.clientIp],
  });
};

export async function findUser(query: FilterQuery<UserDocument> = {}) {
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

  if (!token || !updatedUser) return false;

  return updatedUser;
}

export async function getUsers(
  actualPage: number = 0,
  pageSize: number = 10,
  query: FilterQuery<UserDocument> = {}
) {
  const users = await User.find(query).sort({ createdAt: -1 }).limit(pageSize).skip(actualPage * pageSize);
  const usersCount = await User.countDocuments(query);
  if(!users || users.length === 0) return false;

  return {
    content: [...users],
    actualPage,
    totalPages: Math.ceil(usersCount / pageSize),
    pageSize,
    query
  };
}
