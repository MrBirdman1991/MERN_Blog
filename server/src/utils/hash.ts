import bcrypt from "bcrypt";
import { UserDocument } from "../models/user.model";

export async function hashPassword(password: UserDocument["password"]) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}