import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-z]+$/),
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#!@$%^&*-]).{8,}$/),
  uniqueAccName: Joi.string().required(),
  phone: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  profileImage: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#!@$%^&*-]).{8,}$/),
});
