const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const createBoard = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
  })
  .required();

const updateBoard = joi
  .object({
    title: joi.string(),
    description: joi.string(),
    boardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const deleteBoard = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getBoardByID = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();


module.exports = {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardByID
};
