import User, {  UserInput } from "../models/user.model";



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