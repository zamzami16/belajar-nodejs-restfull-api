import Joi from "joi";

export const createAddressValidation = Joi.object({
  street: Joi.string().min(3).optional(),
  city: Joi.string().optional(),
  province: Joi.string().optional(),
  country: Joi.string().required(),
  postal_code: Joi.string().max(10).required(),
});

export const updateAddressvalidation = Joi.object({
  id: Joi.number().positive().required(),
  street: Joi.string().min(3).optional(),
  city: Joi.string().optional(),
  province: Joi.string().optional(),
  country: Joi.string().required(),
  postal_code: Joi.string().max(10).required(),
});

export const getAddressValidation = Joi.number().positive().required();

export const removeAddressValidation = getAddressValidation;
