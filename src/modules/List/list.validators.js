const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const createList = joi
  .object({
    title: joi.string().required(),
    position: joi.number().positive().integer(),
    boardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getAllListOnBorad = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getListByID = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const updateList = joi
  .object({
    title: joi.string(),
    position: joi.number().positive().integer(),
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const deleteList = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
  })
  .required();


module.exports = {
  getAllListOnBorad,
  createList,
  getListByID,
  updateList,
  deleteList,
};
