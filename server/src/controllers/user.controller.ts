import {Request, Response, NextFunction} from "express"

export const signUpHandler = async(req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(201)
}