import { Router } from "express";
import { userGetData, UpDateUserProfile } from "./user.service.js";
import {SuccessResponse} from "../../common/responce/success.responce.js"
import { auth } from "../../common/middleware/auth/auth.js";
import { upload } from "../../common/middleware/multer.js";

const router = Router();

// router.get("/", async (req, res) => {
//   try {
//     const user = await getAllUser();
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(404).json({
//       message: error.message,
//     });
//   }
// });


router.get("/profile", auth(), async (req, res) => {
  let user = await userGetData(req.user.id);
  SuccessResponse({ res, message: "Your Data", data: user });
});
router.put("/UpDateUserProfile", auth(),upload().any() ,async (req, res) => {
  console.log(req.file)
  let user = await UpDateUserProfile(req.user.id,req.body,req.files);
  SuccessResponse({ res, message: "Your Data Updated", data: user });
});

export default router;