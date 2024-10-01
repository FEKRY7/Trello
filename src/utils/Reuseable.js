const cloudinary = require("./cloud.js");
const otpGenerator = require("otp-generator");
const schedule = require("node-schedule");
const { sendEmail } = require("./sendEmail.js");
const userModel = require("../../Database/models/User.model.js");
const moment = require('moment');
const http = require("../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../utils/httperespons.js");

const checkUserBasices = (isEmailExist, res) => {
  //Check IsEmailConfirmed
  if (!isEmailExist.confirmEmail)
    return First(res, "Confirm Your Email First", 403, http.FAIL);
  //Check isDeleted
  if (isEmailExist.isDeleted)
    return First(res, "Your Account Has Deleted Contact With Support ...", 403, http.FAIL);

  //Check Status
  if (isEmailExist.status == "Blocked")
    return First(res, "Your Account Has Blocked Contact With Support ...", 403, http.FAIL);

};

const URL = (req) => {
  const URL = `${req.protocol}://${req.headers.host}`;
  return URL;
};

const dateHandler = (startDateRange, endtDateRange) => {
  const formattedDate = {
    startDate: startDateRange.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
    endtDate: endtDateRange.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
  };
  return formattedDate;
};

const NotConfirmedEmailsReminder = async () => {
  const notConfirmedUsers = await userModel.find({ confirmEmail: false });
  schedule.scheduleJob("0 0 21 * * *", function () {
    for (let i = 0; i < notConfirmedUsers.length; i++) {
      console.log("Reminder Sent");
      sendEmail({
        to: notConfirmedUsers[i].email,
        subject: "NoReplay (Email Confirmation reminder)",
        text: "This Mail Sent Automatically As Remider To Confirm Your Email Please Do Not Replay",
      });
    }
  });
};

const generateOTP = (n) => {
  const OTP = {
    OTPCode: otpGenerator.generate(n, {
      upperCaseAlphabets: false,
      specialChars: false,
    }),
  };
  return OTP;
};


const generatorLimitTimeOTP = (n) => {
  const OTP = {
    OTPCode: otpGenerator.generate(n, { upperCaseAlphabets: false, specialChars: false }),
    expiredDate: moment().add(2, "minutes").format()
  };
  return OTP
}

const checkBoardAndIsAuthorizedToDelete = async (boardId, req, next) => {
  const board = await boardModel.findById(boardId)
  if (!board) return First(res, "Board Not Found", 404, http.FAIL);
  if (board.createdBy.toString() !== req.user._id.toString())
    return First(res, "You are not authorized to delete this card ... only board owner can do that", 403, http.FAIL);
  return board
}

const checkIsListExist = async (listId, next) => {
  const list = await listModel.findById(listId)
  if (!list) return First(res, "list Not Found", 404, http.FAIL);
  return list
}
const checkIsCardExist = async (cardId, next) => {
  const card = await cardModel.findById(cardId)
  if (!card) return First(res, "card Not Found", 404, http.FAIL);
  return card
}

module.exports = {
  checkUserBasices,
  URL,
  dateHandler,
  NotConfirmedEmailsReminder,
  generateOTP,
  generatorLimitTimeOTP,
  checkBoardAndIsAuthorizedToDelete,
  checkIsListExist,
  checkIsCardExist
};


