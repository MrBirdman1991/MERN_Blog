import User, {  UserInput, UserDocument } from "../models/user.model";
import {FilterQuery, UpdateQuery} from "mongoose";

export const createUser = async (userData: UserInput) => {
    return await User.create({
        email: userData.email,
        password: userData.password,
        userAgent: userData.userAgent,
        ips: [userData.clientIp]
    })
};


export async function findUser(query: FilterQuery<UserDocument>){
    const user = await User.findOne(query);
   if(!query || !user) return false;

   return user;
}

export async function updateUser(user: UserDocument, updateQuery: UpdateQuery<UserDocument>){
    return  await user.update(updateQuery).exec();
}