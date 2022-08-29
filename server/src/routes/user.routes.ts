import {Router} from "express";
import { signUpHandler } from "../controllers/user.controller";
import validate from "../middlewares/validateResource";
import { validateUser } from "../validation/user.validation";

const router = Router();

//@route    POST /api/user/1.0/signup
//@desc     creates an new user in db
//@access   Public
router.post("/signup",validate(validateUser), signUpHandler)


export default router;