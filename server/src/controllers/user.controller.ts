import { UserStatus } from "../models/user.model";
import { createUser, findUser, updateUser } from "../services/user.service";
import { withErrorHandler } from "../utils/withErrorHandler";

export const signUpHandler = withErrorHandler( async (req, res, next) => {
    const {email, password} = req.body;
    const userAgent = req.get("User-Agent") || "";
    const clientIp = req.clientIp as string;
    
    const isExistingUser = await findUser({email});
    if(isExistingUser) return res.status(422).json("user already exists");

    const createdUser = await createUser({email, password, userAgent, clientIp});
    
    res.status(201).json(createdUser)
})


export const activateUserHandler = withErrorHandler(async (req, res, next) => {
    const token = req.params.token
    const isExistingUser = await findUser({activationToken: req.params.token});
    if(!token || !isExistingUser) return res.status(404).json("user not found");

    await updateUser(isExistingUser, { $set:{ "status" : UserStatus.active }})

    res.status(202).json("User Updated")
})