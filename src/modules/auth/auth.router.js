const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  signUp,
  confirmEmail,
  signIn,
  getProfileById,
  forgetPassword,
  resetPassword,
  updatePassword,
  updateProfile
} = require("./auth.validators.js");

const {
  SignUP,
  ConfirmEmail,
  SignIn,
  GetProfileById,
  GetLogginUserProfile,
  SoftDelete,
  ForgetPassword,
  ResetPassword,
  ChangeUserPassword,
  UpdateProfile,
  LogOut
} = require("./auth.controller.js");

router.post("/signUp", validation(signUp), SignUP);

router.post("/confirmemail", validation(confirmEmail), ConfirmEmail);


router.post("/signIn", validation(signIn), SignIn);

router.get(
  "/profile",
  isAuthenticated,
  isAuthorized("User"),
  GetLogginUserProfile
);

router.get(
  "/profile/:userId",
  validation(getProfileById),
  GetProfileById
);

router.post(
  "/changepassword",
  isAuthenticated,
  isAuthorized("User"),
  validation(updatePassword),
  ChangeUserPassword
);

router.post(
  "/forgetpassword",
  validation(forgetPassword),
  ForgetPassword
);

router.post(
  "/resetpassword",
  validation(resetPassword),
  ResetPassword
);

router.put(
  "/update",
  isAuthenticated,
  isAuthorized("User"),
  validation(updateProfile),
  UpdateProfile
);

router.post(
  "/logout",
  isAuthenticated,
  isAuthorized("User"),
  LogOut
);


router.patch(
  "/softdelete",
  isAuthenticated,
  isAuthorized("User"),
  SoftDelete
);

module.exports = router;




