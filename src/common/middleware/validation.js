import Joi from "joi";
import { BadRequestException } from "../responce/error.responce.js";

export const validate = (Schema) => {
  return (req, res, next) => {
    let { value, error } = Schema.validate(req.body, { abortEarly: false });
    console.log(value, error);
    if (error) {
      BadRequestException({ message: "validation error", extra: error });
    }
    next();
  };
};
