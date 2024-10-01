const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const signUp = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp()).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi.string(),
    age: joi.number().positive().integer(),
    gender: joi.string().required()
  })
  .required();

const confirmEmail = joi
  .object({
    email: joi.string().email().required(),
    OTP: joi.string().required(),
  })
  .required();

const signIn = joi
  .object({
    email: joi.string().required().email().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email",
    }),
    password: joi.string().required(),
  })
  .required();

const getProfileById = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const forgetPassword = joi
  .object({
    email: joi.string().required().email().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email",
    }),
  })
  .required();

const resetPassword = joi
  .object({
    email: joi.string().required().email(),
    OTP: joi.string().required(),
    newPassword: joi.string().min(5).max(30).required(),
    confirmNewPassword: joi.string().valid(joi.ref('newPassword')).required()
  })
  .required();

const updatePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().min(5).max(30).required(),
    ConfirmNewPassword: joi.string().valid(joi.ref('newPassword')).required()
  })
  .required();

const updateProfile = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    lastName: joi.string(),
    phone: joi.string(),
    age: joi.number().positive().integer(),
  })
  .required();

module.exports = {
  signUp,
  confirmEmail,
  signIn,
  getProfileById,
  forgetPassword,
  resetPassword,
  updatePassword,
  updateProfile
};
