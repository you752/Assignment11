import express from "express";
import {
  globalHandlingError,
  NotFoundException,
} from "./common/responce/error.responce.js";
import { getEnv } from "../config/env.service.js";
import { SuccessResponse } from "./common/responce/success.responce.js";
import { HashGenerate, CompareHash } from "./common/middleware/security/HashWord.js";
import { connectDB } from "./database/connection.js";
import userRouter from "./module/user/user.controller.js";
import authRouter from "./module/auth/auth.controller.js";
import { fileURLToPath } from "url";
import path from "path";


export const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  const hi = await HashGenerate("youssef");
  console.log(hi);
  const h = await CompareHash("youssef", hi);
  console.log(h);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // app.get("/", (req, res) => {
  //   res.send("youssef");
  // });

  // app.get("/test", (req, res) => {
  //   SuccessResponse({
  //     res,
  //     message: "Done from SuccessResponse",
  //     status: 201,
  //   });
  // });

  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use((req, res, next) => {
    NotFoundException({
      message: "URL not found",
    });
  });

  app.use(globalHandlingError);

  await connectDB();

  app.listen(getEnv("PORT"), () => {
    console.log(`Server is running on port ${getEnv("PORT")}`);
  });
};