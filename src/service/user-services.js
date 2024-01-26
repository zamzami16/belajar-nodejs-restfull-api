import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/ResponseError.js";
import {
  getUserValidation,
  loginUserValidation,
  logoutUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, `Username ${user.username} already exists.`);
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "username or password wrong!");
  }

  const isPasswordSame = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordSame) {
    throw new ResponseError(401, "username or password wrong!");
  }

  const token = uuid().toString();
  return await prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const get = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found.");
  }

  return user;
};

const update = async (request) => {
  const userRequest = validate(updateUserValidation, request);

  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      username: userRequest.username,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "User not found");
  }

  const data = {};
  if (userRequest.name) {
    data.name = userRequest.name;
  }

  if (userRequest.password) {
    data.password = await bcrypt.hash(userRequest.password, 10);
  }

  const user = await prismaClient.user.update({
    data: data,
    where: {
      username: userRequest.username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "No user found");
  }

  return user;
};

const logout = async (username) => {
  username = validate(logoutUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  const deleted = await prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
      name: true,
    },
  });
  return deleted;
};

export default { register, login, get, update, logout };
