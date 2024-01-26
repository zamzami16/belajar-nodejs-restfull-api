import Joi from "joi";

const registerUserValidation = Joi.object({
  username: Joi.string().max(100).min(5).required(),
  password: Joi.string().max(100).required(),
  name: Joi.string().max(100).min(5).required(),
});

const loginUserValidation = Joi.object({
  username: Joi.string().max(100).min(5).required(),
  password: Joi.string().max(100).required(),
}).unknown(false);

const getUserValidation = Joi.string().max(100).min(5).required();

const updateUserValidation = Joi.object({
  username: Joi.string().max(100).min(5).required(),
  password: Joi.string().max(100).optional(),
  name: Joi.string().max(100).min(5).optional(),
});

const logoutUserValidation = Joi.string().max(100).min(5).required();

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
  logoutUserValidation,
};
