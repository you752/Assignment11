import jwt from "jsonwebtoken";
import { getEnv } from "../../../../config/env.service.js";
import UserModel from "../../../database/model/user.model.js";

export const ROLES = {
  USER: 0,
  ADMIN: 1,
};

const SIGNATURES = {
  [ROLES.USER]: getEnv("USER_SIGNATURE"),
  [ROLES.ADMIN]: getEnv("ADMIN_SIGNATURE"),
};

const REFRESH_SIGNATURES = {
  [ROLES.USER]: getEnv("USER_REFRESH_SIGNATURE"),
  [ROLES.ADMIN]: getEnv("ADMIN_REFRESH_SIGNATURE"),
};

export const generateToken = (payload, role = ROLES.USER) => {
  const accessSignature = SIGNATURES[role];
  const refreshSignature = REFRESH_SIGNATURES[role];

  if (!accessSignature || !refreshSignature) {
    throw new Error("Invalid role or missing signature");
  }

  const accessToken = jwt.sign(payload, accessSignature, {
    expiresIn: "1h",
    audience: String(role),
  });

  const refreshToken = jwt.sign(payload, refreshSignature, {
    expiresIn: "1y",
    audience: String(role),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const decodeAccessToken = (token, role = ROLES.USER) => {
  return jwt.verify(token, SIGNATURES[role], {
    audience: String(role),
  });
};

export const decodeRefreshToken = (token, role = ROLES.USER) => {
  return jwt.verify(token, REFRESH_SIGNATURES[role], {
    audience: String(role),
  });
};

export const auth = (role = ROLES.USER) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new Error("Authorization header is required");
      }

      const [flag, token] = authorization.split(" ");

      if (!flag || !token) {
        throw new Error("Invalid token format");
      }

      if (flag !== "Bearer") {
        throw new Error("Invalid authorization type");
      }

      const decoded = decodeAccessToken(token, role);

      const user = await UserModel.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export const GenerateAccessToken = (refreshToken) => {
  try {
    const decodedUnsafe = jwt.decode(refreshToken);

    const role = Number(decodedUnsafe?.aud);

    if (role === undefined) {
      throw new Error("Invalid token role");
    }

    const refreshSecret = REFRESH_SIGNATURES[role];
    const accessSecret = SIGNATURES[role];

    const verified = jwt.verify(refreshToken, refreshSecret);

    const accessToken = jwt.sign(
      {
        id: verified.id,
        email: verified.email,
        role,
      },
      accessSecret,
      {
        expiresIn: "1h",
        audience: String(role),
      },
    );
    return { accessToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
