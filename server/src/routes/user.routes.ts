import {Router} from "express";
import { signUpHandler } from "../controllers/user.controller";

const router = Router();

//@route    POST /api/user/1.0/signup
//@desc     creates an new user in db
//@access   Public
router.post("/signup", signUpHandler)


export default router;