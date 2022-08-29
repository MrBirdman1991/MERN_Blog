import {Request, Response, NextFunction} from "express"
import { createUser, findUser } from "../services/user.service";
import logger from "../utils/logger";

export const signUpHandler = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;
        const userAgent = req.get("User-Agent") || "";
        const clientIp = req.clientIp as string;

        const isExistingUser = await findUser(email);
        if(isExistingUser) return res.status(422).json("user already exists");

        const createdUser = await createUser({email, password, userAgent, clientIp});
        
        res.status(201).send(createdUser)
    }catch(err: any){
        logger.error(err.message);
        res.status(500).json("an unknown error occoured")
    }
}

