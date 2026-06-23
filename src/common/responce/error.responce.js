import { getEnv } from "../../../config/env.service.js";

export const ErrorResponse = ({
  status = 400,
  message = "Something went wrong",
  extra = undefined,
} = {}) => {
  const error = new Error(message);

  error.cause = {
    status,
    extra,
  };

  throw error;
};
export const BadRequestException = (payload = {}) => {
  return ErrorResponse({ status: 400, ...payload });
};

export const UnAuthorizedException = (payload = {}) => {
  return ErrorResponse({ status: 401, ...payload });
};

export const NotFoundException = (payload = {}) => {
  return ErrorResponse({ status: 404, ...payload });
};

export const ConflictException = (payload = {}) => {
  return ErrorResponse({ status: 409, ...payload });
};


export const globalHandlingError = (err, req, res, next) => {
  const isDev = getEnv("MOOD") === "dev";

  const status = err.cause?.status || 500;
  const message = err.message || "Something went wrong";
  const extra = err.cause?.extra || undefined;

  return res.status(status).json({
    success: false,
    message,
    extra,
    ...(isDev && { stack: err.stack }),
  });
};
