import {Request, Response, NextFunction} from "express"
import logger from "../utils/logger";

type Handler = (req: Request, res: Response, next: NextFunction) => void

export const withErrorHandler = (cb: Handler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
           await cb(req, res, next);
        }catch(err: any){
            logger.error(err.message);
            res.status(500).json("unknown error occurred")
        }
    }
}