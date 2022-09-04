import { createUser, findUser, activateUser } from "../services/user.service";
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

    const updatedUser = await activateUser(token);

    if(!updatedUser) return res.status(404).json("no user found");

    res.status(202).json(updatedUser)
})