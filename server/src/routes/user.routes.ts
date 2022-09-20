import { Router } from "express";
import {
  signUpHandler,
  activateUserHandler,
  loginUserHandler,
  getUsersHandler,
  getUserHandler
} from "../controllers/user.controller";
import { pagination } from "../middlewares/pagination";
import validate from "../middlewares/validateResource";
import { validateUser } from "../validation/user.validation";

const router = Router();

//@route    POST /api/user/1.0/signup
//@desc     creates an new user in db
//@access   Public
router.post("/signup", validate(validateUser), signUpHandler);

//@route    GET /api/user/1.0/activate/:token
//@desc     creates an new user in db
//@access   Public
router.get("/activate/:token", activateUserHandler);

//@route    POST /api/user/1.0/login
//@desc     logs user in
//@access   Public
router.post("/login",validate(validateUser), loginUserHandler);

//@route    GET /api/user/1.0/users
//@desc     returns back a list of users by pagination
//@access   Public
router.get("/users", pagination, getUsersHandler);

//@route    GET /api/user/1.0/users/:id
//@desc     returns back an user by id
//@access   Public
router.get("/users/:id", getUserHandler);

export default router;
