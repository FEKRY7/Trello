const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const createNewCommentReplay = joi
  .object({
    replytext: joi.string().required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required()
  })
  .required();

const updateCommentReplay = joi
  .object({
    replytext: joi.string().required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required(),
    replyId: joi.string().custom(isValidObjectId).required()
  })
  .required();

const deleteCommentReplay = joi
  .object({
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required(),
    replyId: joi.string().custom(isValidObjectId).required()
  })
  .required();

const getCommentReplayById = joi
  .object({
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required(),
    replyId: joi.string().custom(isValidObjectId).required()
  })
  .required();

module.exports = {
  getCommentReplayById,
  createNewCommentReplay,
  deleteCommentReplay,
  updateCommentReplay,
};
