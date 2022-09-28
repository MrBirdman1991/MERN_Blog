import { sendAccountActivation } from "../services/email.service";
import {
  createUser,
  findUser,
  activateUser,
  getUsers,
  findUserById,
} from "../services/user.service";
import { comparedPassword } from "../utils/hash";
import { withErrorHandler } from "../utils/withErrorHandler";

export const signUpHandler = withErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userAgent = req.get("User-Agent") || "";
  const clientIp = req.clientIp as string;

  const isExistingUser = await findUser({ email });
  if (isExistingUser) return res.status(422).json("user already exists");

  const createdUser = await createUser({
    email,
    password,
    userAgent,
    clientIp,
  });

  if(createdUser){
    await sendAccountActivation(email, createdUser.activationToken)
  }

  res.status(201).json(createdUser);
});

export const activateUserHandler = withErrorHandler(async (req, res, next) => {
  const token = req.params.token;

  const updatedUser = await activateUser(token);

  if (!updatedUser) return res.status(404).json("no user found");

  res.status(202).json(updatedUser);
});

export const loginUserHandler = withErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await findUser({ email });
  if (
    !existingUser ||
    !existingUser.status ||
    existingUser.activationToken.length !== 0
  )
    return res.status(401).json("no user found");

  const matchedPassword = await comparedPassword(
    password,
    existingUser.password
  );
  if (!matchedPassword) return res.status(401).json("wrong pw");

  res.status(202).json(existingUser);
});

export const getUsersHandler = withErrorHandler(async (req, res, next) => {
  const pageQuery = res.locals.page as number;
  const users = await getUsers(pageQuery);

  if (!users) return res.status(404).json("no users found");

  res.json(users);
});

export const getUserHandler = withErrorHandler(async (req, res, next) => {
  const userId = req.params.id;

  const existingUser = await findUserById(userId);
  if (!existingUser) return res.status(404).json("no users found");

  res.json(existingUser);
});
