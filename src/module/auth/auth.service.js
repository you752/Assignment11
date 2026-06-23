import UserModel from "../../database/model/user.model.js";
import Joi from "joi";

import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "../../common/responce/error.responce.js";

import {
  HashGenerate,
  CompareHash,
} from "../../common/middleware/security/HashWord.js";

import {
  generateToken,
  GenerateAccessToken,
} from "../../common/middleware/auth/auth.js";

import { sendEmail } from "../../common/utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import { getEnv } from "../../../config/env.service.js";

export const signup = async (data) => {
  const { name, email, password, uniqueAccName } = data;

  if (!name || !email || !password || !uniqueAccName) {
    throw BadRequestException({
      message: "please enter all data",
    });
  }

  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail) {
    throw ConflictException({
      message: "email already taken",
    });
  }

  const existingUsername = await UserModel.findOne({ uniqueAccName });
  if (existingUsername) {
    throw ConflictException({
      message: "username already taken",
    });
  }

  const hashPassword = await HashGenerate(password);
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  const createdUser = await UserModel.create({
    name,
    email,
    password: hashPassword,
    uniqueAccName,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000, 
    isVerified: false,
  });
  await sendEmail({
    to: email,
    subject: "Verify your account",
    text: `Hello ${uniqueAccName}

Your OTP is: ${otp}

This OTP will expire in 10 minutes.`,
    html: `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#080808;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">

          <!-- Title -->
          <p style="margin:0 0 24px;font-size:11px;color:#333;letter-spacing:2px;">SARA7A APP — EMAIL PREVIEW</p>

          <!-- Card -->
          <table width="480" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">

            <!-- Header -->
            <tr>
              <td style="padding:28px 36px;border-bottom:1px solid #1a1a1a;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="width:36px;height:36px;background:#ffffff;border-radius:8px;display:inline-block;text-align:center;line-height:36px;">
                        <span style="font-size:18px;font-weight:700;color:#080808;font-family:monospace;">S</span>
                      </div>
                    </td>
                    <td style="vertical-align:middle;padding-left:12px;">
                      <span style="font-size:16px;font-weight:500;color:#ffffff;">Sara7a App</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:44px 36px 36px;text-align:center;">

                <!-- Lock Icon -->
                <div style="width:52px;height:52px;background:#1a1a1a;border-radius:50%;margin:0 auto 20px;line-height:52px;text-align:center;border:1px solid #2a2a2a;">
                  <span style="font-size:24px;">🔐</span>
                </div>

                <h2 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#ffffff;">Verify your identity</h2>
                <p style="margin:0 0 36px;font-size:14px;color:#555;line-height:1.7;">
                  Hey <span style="color:#aaaaaa;font-weight:600;">${uniqueAccName}</span>, use the code below to complete your verification.
                </p>

                <!-- OTP Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background:#0f0f0f;border:1px solid #2a2a2a;border-radius:12px;padding:24px;text-align:center;">
                      <p style="margin:0 0 10px;font-size:11px;color:#444;letter-spacing:3px;">YOUR OTP CODE</p>
                      <span style="font-size:40px;font-weight:700;letter-spacing:14px;color:#ffffff;font-family:monospace;">${otp}</span>
                    </td>
                  </tr>
                </table>

                <!-- Timer Badge -->
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                  <tr>
                    <td style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:20px;padding:8px 18px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#f59e0b;border-radius:50%;display:inline-block;"></div>
                          </td>
                          <td style="padding-left:8px;font-size:13px;color:#888;vertical-align:middle;">
                            Expires in <strong style="color:#aaa;">10 minutes</strong>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;font-size:12px;color:#333;">If you didn't request this, ignore this email.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 36px;border-top:1px solid #1a1a1a;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:11px;color:#2a2a2a;">© ${new Date().getFullYear()} Sara7a App</td>
                    <td style="font-size:11px;color:#2a2a2a;text-align:right;">All rights reserved</td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `,
  });

  return createdUser;
};
// ana gayb eltemblet dh mn claude 3l4an 4klh fe elaol mkn4 3agbne 
export const login = async (data) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw NotFoundException({
      message: "email wrong, try again",
    });
  }

  const isMatch = await CompareHash(password, user.password);

  if (!isMatch) {
    throw BadRequestException({
      message: "invalid password",
    });
  }

  if (!user.isVerified) {
    throw BadRequestException({
      message: "Please verify your account first",
    });
  }

  const tokens = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    user.role,
  );

  return {
    success: true,
    message: "login success",
    ...tokens,
    user,
  };
};

export const genToken = async (authorization, host) => {
  return await GenerateAccessToken(authorization, host);
};

export const verifyYourAccount = async (data) => {
  const { email, otp } = data;
  const UserData = await UserModel.findOne({ email });
  if (!UserData) {
    NotFoundException({ message: "your account isnot exist" });
  }
  if (UserData.otp != otp) {
    BadRequestException({ message: "otp id Invaild" });
  } else {
    UserData.isVerified = true;
    UserData.otp = null;
    await UserData.save();

    return UserData;
  }
};

const client = new OAuth2Client(getEnv("GOOGLE_CLIENT_ID"));

export const googleLoginService = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: getEnv("GOOGLE_CLIENT_ID"),
  });
  const payload = ticket.getPayload();
  const { email, name, picture, email_verified } = payload;
  if (!email_verified) {
    throw BadRequestException({
      message: "Email not verified by Google",
    });
  }
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({
      name,
      email,
      avatar: picture,
      provider: "google",
      isVerified: true,
    });
  }
  const tokens = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    user.role,
  );
  return {
    success: true,
    message: "google login success",
    ...tokens,
    user,
  };
};
