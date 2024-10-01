const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const createComment = joi
  .object({
    text: joi.string().required(),
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required()
  })
  .required();

const updateComment = joi
  .object({
    text: joi.string().required(),
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required()
  })
  .required();


const deleteComment = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required()
  })
  .required();

const getCommentById = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    commentId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getAllCommentOnCard = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required()
  })
  .required();

module.exports = {
  getCommentById,
  createComment,
  getAllCommentOnCard,
  deleteComment,
  updateComment,
};
