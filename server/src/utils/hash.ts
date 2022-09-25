import bcrypt from "bcrypt";
import {  UserDocument, UserInput } from "../models/user.model";

export async function hashPassword(password: UserInput["password"]) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}

export async function comparedPassword(userPassword: UserInput["password"], hashedPassword: UserDocument["password"]){
    return bcrypt.compare(userPassword, hashedPassword);
}