const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");
const { fileUpload, fileValidation } = require("../../utils/fileUpload.js");

const {
  getAllAttachmentsOnCard,
  addNewAttachment,
  deleteAttachment,
  getAttachmentByID,
  updateattachment
} = require("./attachment.validators.js");

const {
  GetAllAttachmentsOnCard,
  GetAttachmentByID,
  AddNewAttachment,
  Updateattachment,
  DeleteAttachment,
} = require("./attachment.controller.js");


router.route("/:boardId/:listId/:cardId")
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getAllAttachmentsOnCard),
    GetAllAttachmentsOnCard
  )
  .post(
    isAuthenticated,
    isAuthorized("User"),
    fileUpload(fileValidation.imageVideosPdfWord).fields([
      { name: "files", maxCount: 10 }
    ]),
    validation(addNewAttachment),
    AddNewAttachment
  );

router.get(
  "/:boardId/:attachmentId",
  isAuthenticated,
  isAuthorized("User"),
  validation(getAttachmentByID),
  GetAttachmentByID
);



router.route("/:boardId/:listId/:cardId/:attachmentId")
  .put(
    isAuthenticated,
    isAuthorized("User"),
    fileUpload(fileValidation.imageVideosPdfWord).fields([
      { name: "files", maxCount: 10 }
    ]),
    validation(updateattachment),
    Updateattachment
  )
  .delete(
    isAuthenticated,
    isAuthorized("User"),
    validation(deleteAttachment),
    DeleteAttachment
  );

module.exports = router;