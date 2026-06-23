import nodemailer from "nodemailer";
import { getEnv } from "../../../config/env.service.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: getEnv("GOOGLE_ACCOUNT"),
    pass: getEnv("PASSWORD_ACCOUNT"),
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
 const info = await transporter.sendMail({
   from: `"Saraha App" <${getEnv("GOOGLE_ACCOUNT")}>`,
   to,
   subject,
   text,
   html,
 });

  return info;
};


