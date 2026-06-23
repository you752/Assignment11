import { Router } from "express";
import {
  signup,
  login,
  genToken,
  verifyYourAccount,
  googleLoginService,
} from "./auth.service.js";
import { SuccessResponse } from "../../common/responce/success.responce.js";
import { auth } from "../../common/middleware/auth/auth.js";
import { validate } from "../../common/middleware/validation.js";
import { signupSchema } from "./auth.vaildation.js";

const router = Router();

router.post("/signup", validate(signupSchema), async (req, res) => {
  let createAccount = await signup(req.body);
  SuccessResponse({res,message: "user added successflly",data: createAccount,});
});

router.post("/login", async (req, res) => {
  let userData = await login(req.body, req.get("host"));
  SuccessResponse({ res, message: "login successfully", data: userData });
});

router.post("/loginWithSocial", async (req, res) => {
  const { token } = req.body;
  const userData = await googleLoginService(token);
  SuccessResponse({res,message: "Google login successfully",data: userData, });
});

router.get("/get-user-data", async (req, res) => {
  let getToken = await genToken(req.headers.authorization, req.get("host"));
  SuccessResponse({ res, message: "Generate Access Token", data: getToken });
});

router.post("/verifyAccount", async (req, res) => {
  let userData = await verifyYourAccount(req.body);
  SuccessResponse({res,message: "user verify is successfully",data: userData,});
});

export default router;
