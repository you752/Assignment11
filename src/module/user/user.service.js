import UserModel from "../../database/model/user.model.js";
import {
  ConflictException,
  globalHandlingError,
} from "../../common/responce/error.responce.js";
import {
  CompareHash,
  HashGenerate,
} from "../../common/middleware/security/HashWord.js";
import { getEnv } from "../../../config/env.service.js";

// export const getAllUser = async () => {
//   try {
//     const user = await UserModel.find();
//     return user;
//   } catch (err) {
//     return {
//       message: "Error fetching users",
//       error: err.message,
//     };
//   }
// };
export const userGetData = async (userId) => {
  const getUser = await UserModel.findById(userId);

  if (!getUser) {
    throw NotFoundException({
      message: "User not found, invalid ID",
    });
  }

  return getUser;
};

export const UpDateUserProfile = async (userId, data , files) => {
  const { name, password, newPassword, uniqueAccName } = data;

  const userData = await UserModel.findById(userId);
  if (!userData) {
    throw NotFoundException({
      message: "User not found",
    });
  }
  const updateData = {};
  if (name) updateData.name = name;
  if (uniqueAccName) {
    const existUniqueAcc = await UserModel.findOne({
      uniqueAccName,
      _id: { $ne: userId },
    });

    if (existUniqueAcc) {
      throw ConflictException({
        message: "unique account name already exists",
      });
    }

    updateData.uniqueAccName = uniqueAccName;
  }

  if (password && newPassword) {
    const comparePassword = await CompareHash(password, userData.password);

    if (!comparePassword) {
      throw new Error("Current password is incorrect");
    }

    updateData.password = await HashGenerate(newPassword);
  }
  
  if (files?.length > 0) {
    updateData.profileImage = `${getEnv("SERVER_URL")}/${files[0].path.replace(/\\/g, "/")}`;
  }
  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData,{

    new: true,
  });
  console.log(files);
  console.log(files);
  console.log(files?.path);
  console.log("profileImage =>", updateData.profileImage);
  return updatedUser;
};
