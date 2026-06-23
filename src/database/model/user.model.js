import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /[A-Z]/.test(value);
      },
      message:
        "Password must be at least 8 characters and contain one uppercase letter",
    },
  },

  phone: String,

  coverImage: String,

  profilePerson: String,

  profileImage: {
    // ✅ ADD THIS
    type: String,
    default: "",
  },

  uniqueAccName: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: Number,
    default: 0,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  avatar: String,
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel
