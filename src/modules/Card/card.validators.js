const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const createCard = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    title: joi.string().required(),
    description: joi.string(),
    assignTo: joi.string().required(),
    deadline: joi.date().min(Date.now()).required(),
  })
  .required();

const updateCard = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
    title: joi.string(),
    description: joi.string(),
    assignTo: joi.string(),
    deadline: joi.date().min(Date.now()),
  })
  .required();

const deleteCard = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getCardById = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required(),
    cardId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getAllCardsOnList = joi
  .object({
    boardId: joi.string().custom(isValidObjectId).required(),
    listId: joi.string().custom(isValidObjectId).required()
  })
  .required();

module.exports = {
  createCard,
  updateCard,
  deleteCard,
  getCardById,
  getAllCardsOnList
};
