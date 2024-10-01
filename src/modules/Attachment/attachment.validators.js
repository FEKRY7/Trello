const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const addNewAttachment = joi
  .object({
    files: joi.array().items(joi.string().uri()).max(10),
    fileName: joi.string(),
    fileType: joi.string(),
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required()
  })
  .required();


const updateattachment = joi
  .object({
    files: joi.array().items(joi.string().uri()).max(10),
    fileName: joi.string(),
    fileType: joi.string(),
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    attachmentId: joi.string().custom(isValidObjectId).required(),
  })
  .required();


const deleteAttachment = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    attachmentId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getAllAttachmentsOnCard = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required()
  })
  .required();

const getAttachmentByID = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    attachmentId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

module.exports = {
  getAllAttachmentsOnCard,
  addNewAttachment,
  deleteAttachment,
  getAttachmentByID,
  updateattachment
};