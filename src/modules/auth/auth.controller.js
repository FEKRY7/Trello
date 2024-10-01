const userModel = require('../../../Database/models/User.model.js')
const CryptoJS = require('crypto-js')
const bcrypt = require('bcrypt')
const { generatorLimitTimeOTP, generateOTP, checkUserBasices } = require('../../utils/Reuseable.js')
const { sendEmail, createHTML } = require('../../utils/sendEmail.js')
const jwt = require("jsonwebtoken");
const tokenModel = require("../../../Database/models/Token.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// signup 
const SignUP = async (req, res, next) => {
  try {

    const isEmailExist = await userModel.findOne({ email: req.body.email });
    if (isEmailExist?.isDeleted) {
      return First(res, "Deleted and Will Build BL based On Requirments", 401, http.FAIL);
    }
    if (isEmailExist) return First(res, "This Email In Use", 409, http.FAIL);


    req.body.password = await bcrypt.hash(req.body.password, 5);
    if (req.body.phone) {
      req.body.phone = CryptoJS.AES.encrypt(req.body.phone, process.env.CRYPTOKEY).toString()
    }

    const OTP = generateOTP(6)
    req.body.OTP = OTP

    const html = createHTML(OTP);


    const user = await userModel.create(req.body);

    if (
      !sendEmail({
        to: user.email,
        subject: "Confirmation Email",
        text: "Please Click The Below Link To Confirm Your Email",
        html,
      })
    )
      return First(res, "There is someting Wrong with Email Sender", 404, http.FAIL);

    return Second(res, ["User Created Successfully", user], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

const ConfirmEmail = async (req, res, next) => {
  try {
    const { email, OTP } = req.body;

    // Check if the email exists in the database
    const isValidEmail = await userModel.findOne({ email });

    if (!isValidEmail) {
      return First(res, "Please enter a valid email", 404, http.FAIL);
    }

    // Check if the email has already been confirmed
    if (isValidEmail.confirmEmail) {
      return First(
        res,
        "Email already confirmed. Please go to the login page.",
        400,
        http.FAIL
      );
    }

    // Check if OTP exists and matches the input OTP
    if (!isValidEmail.OTP || isValidEmail.OTP.OTPCode !== OTP) {
      return First(res, "Invalid OTP", 400, http.FAIL);
    }

    // Mark the email as confirmed
    isValidEmail.confirmEmail = true;
    await isValidEmail.save();

    // Send success response
    return Second(res, "Your email is confirmed successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const isEmailExist = await userModel.findOne({ email });
    if (!isEmailExist) {
      return First(res, "Email is wrong", 400, http.FAIL);
    }

    // Compare the entered password with the stored hash
    const isPasswordMatch = bcrypt.compare(password, isEmailExist.password);
    if (!isPasswordMatch) {
      return First(res, "Password is wrong", 400, http.FAIL);
    }

    // Check if the email is confirmed, user is not deleted, and status is valid
    const basicsCheckResponse = checkUserBasices(isEmailExist, res);
    if (basicsCheckResponse) {
      return; // Exit if the response is already sent
    }

    // Check if the account is deleted
    if (isEmailExist.isDeleted) {
      return First(res, "Not registered email or deleted account", 403, http.FAIL);
    }

    // Create JWT payload
    const payload = {
      id: isEmailExist._id,
      name: `${isEmailExist.firstName} ${isEmailExist.lastName}`,
      email
    };

    // Generate access token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 // 1 hour
    });

    // Generate refresh token
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 7 // 1 week
    });

    // Save the token (optional step)
    await tokenModel.create({ token, user: isEmailExist._id });

    // Mark user as logged in
    isEmailExist.isLoggedIn = true;

    await isEmailExist.save();

    // Send success response with tokens
    return Second(res, ["Sign-in successful", token, refreshToken], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// logout
const LogOut = async (req, res, next) => {
  try {
    // Check if the user object is present in the request
    if (!req.user) {
      return First(res, "User not found in request", 400, http.FAIL);
    }

    // Mark the user as logged out
    req.user.isLoggedIn = false;
    await req.user.save();

    // Send a success response
    return Second(res, "Logged out successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



// Get loggedIn User Profile
const GetLogginUserProfile = async (req, res, next) => {
  try {
    // Fetch the logged-in user profile using the user ID from the request
    const user = await userModel.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return First(res, "User not found", 404, http.FAIL);
    }

    // Return user profile data
    return Second(res, ["User profile fetched successfully", user], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// Get  User  By Id
const GetProfileById = async (req, res, next) => {
  try {
    // Fetch user by ID from request parameters
    const user = await userModel.findById(req.params.userId);

    // Check if the user exists
    if (!user) {
      return First(res, "User not found", 404, http.FAIL);
    }

    // Return user profile data
    return Second(res, ["User profile fetched successfully", user], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



// Changing User Password must logged in
const ChangeUserPassword = async (req, res, next) => {
  try {
    let { oldPassword, newPassword, ConfirmNewPassword } = req.body;

    // Check if the old password matches the current password in the database
    const isPasswordMatch = bcrypt.compare(oldPassword, req.user.password);
    if (!isPasswordMatch) {
      return First(res, "Old password is incorrect", 400, http.FAIL);
    }

    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      return First(
        res,
        "New password cannot be the same as the old password",
        400,
        http.FAIL
      );
    }

    // Validate that newPassword and ConfirmNewPassword match
    if (newPassword !== ConfirmNewPassword) {
      return First(res, "New password and confirmation do not match", 400, http.FAIL);
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 5);

    // Update the user's password
    req.user.password = hashedNewPassword;
    await req.user.save();

    return Second(res, "Password updated successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const ForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the email is registered
    const isValidEmail = await userModel.findOne({ email });
    if (!isValidEmail) {
      return First(res, "Email not registered", 404, http.FAIL);
    }

    // Check if the maximum number of OTPs has been sent
    if (isValidEmail.OTPSentTimes >= process.env.MAXOTPSMS) {
      return First(res, "OTP already sent. Please check your email.", 401, http.FAIL);
    }

    // Generate OTP with a time limit
    const OTP = generatorLimitTimeOTP(6);
    console.log("Generated OTP (for debugging):", OTP); // Consider removing or masking this for production

    // Store OTP in user document and increment sent times
    isValidEmail.OTP = OTP;
    isValidEmail.OTPSentTimes = (isValidEmail.OTPSentTimes || 0) + 1; // Increment sent times

    await isValidEmail.save();

    // Prepare the email text
    const text = `Use this code to reset your password: ${OTP.OTPCode}. This code is valid for 2 minutes.`;

    // Send the email with the OTP
    sendEmail({
      to: email,
      subject: "Password Reset Request",
      text
    });

    return Second(res, "OTP sent. Check your email.", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const ResetPassword = async (req, res, next) => {
  try {
    let { email, OTP, newPassword, confirmNewPassword } = req.body;

    // Check if the email is registered
    const isValidEmail = await userModel.findOne({ email });
    if (!isValidEmail) {
      return First(res, "Email not registered", 404, http.FAIL);
    }

    // Check if the OTP matches
    if (isValidEmail.OTP.OTPCode !== OTP) {
      return First(res, "Invalid OTP", 400, http.FAIL);
    }

    // Check if the OTP has expired
    if (isValidEmail.OTP.expiredDate < new Date()) {
      return First(res, "Expired OTP", 400, http.FAIL);
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return First(res, "New password and confirmation do not match", 400, http.FAIL);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Use a stronger hash cost

    // Update the user's password and reset login status
    isValidEmail.password = hashedPassword;
    isValidEmail.isLoggedIn = false; // Log out from any device
    isValidEmail.OTPSentTimes = 0; // Reset OTP sent times
    isValidEmail.OTP = generateOTP(10)

    await isValidEmail.save();

    return Second(res, "Password changed successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



// Updaing User
const UpdateProfile = async (req, res, next) => {
  try {
    let { firstName, lastName, age, phone } = req.body;

    // Optional: Validate the input fields
    if (!firstName && !lastName && !age && !phone) {
      return First(res, "At least one field must be provided for update.", 400, http.FAIL);
    }

    // Encrypt the phone number if provided
    if (phone) {
      phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTOKEY).toString();
      req.body.phone = phone; // Add the encrypted phone back to req.body
    }

    // Update user profile and return the updated user
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });

    // Check if user was found and updated
    if (!user) {
      return First(res, "This user does not exist", 404, http.FAIL);
    }

    return Second(res, ["User info updated successfully", user], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};




// // Soft Delete  => instead of delete user data we keep in and make mark it as isDelete = True
// And will Handle addational logic Soon
const SoftDelete = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
      isLoggedIn: false,
      isDeleted: true,
    }, { new: true }); // Optionally return the updated user

    if (!user) {
      return First(res, "This user does not exist.", 404, http.FAIL);
    }

    return Second(res, "User activated as soft deleted.", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


module.exports = {
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
}