import Joi from "joi";

const createContactValidation = Joi.object({
  first_name: Joi.string().max(100).min(3).required(),
  last_name: Joi.string().max(100).min(3).optional(),
  email: Joi.string().max(100).email().optional(),
  phone: Joi.string().max(100).min(11).regex(/^\d+$/).optional(),
});

const updateContactValidation = Joi.object({
  id: Joi.number().positive().required(),
  first_name: Joi.string().max(100).min(3).required(),
  last_name: Joi.string().max(100).min(3).optional(),
  email: Joi.string().max(100).email().optional(),
  phone: Joi.string().max(100).min(11).regex(/^\d+$/).optional(),
});

const getContactValidation = Joi.number().required();

const searchContactValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
});

const removeContactValidation = getContactValidation.positive();

export {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
  removeContactValidation,
};
