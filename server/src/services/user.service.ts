import User, { UserInput } from "../models/user.model";



export const createUser = async (userData: UserInput) => {
    return await User.create({
        email: userData.email,
        password: userData.password,
        userAgent: userData.userAgent,
        ips: [userData.clientIp]
    })
};

export async function findUser(query: any){
    const user = await User.findOne({...query});
   if(!query || !user) return false;

   return user;
}