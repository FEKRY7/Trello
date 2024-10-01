const mongoose = require("mongoose");

const { Types } = mongoose;

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    age: Number,
    phone: String,
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    boards: [{
      type: Types.ObjectId,
      ref: 'Board'
    }],
    OTP: { OTPCode: { type: String }, expiredDate: { type: Date } },
    OTPSentTimes: {
      type: Number,
      default: 0
    }

  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
