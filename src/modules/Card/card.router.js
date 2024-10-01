const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  getAllCardsOnList,
  createCard,
  getCardById,
  updateCard,
  deleteCard
} = require("./card.validators.js");

const {
  GetAllCardsOnList,
  CreateNewCard,
  GetCardById,
  UpdateCard,
  DeleteCard,
  GetAllCardAfterDeadLine
} = require("./card.controller.js");


router.route('/:boardId/:listId')
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getAllCardsOnList),
    GetAllCardsOnList
  )
  .post(
    isAuthenticated,
    isAuthorized("User"),
    validation(createCard),
    CreateNewCard
  )

router.route('/:boardId/:listId/:cardId')
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getCardById),
    GetCardById
  )
  .put(
    isAuthenticated,
    isAuthorized("User"),
    validation(updateCard),
    UpdateCard
  )
  .delete(
    isAuthenticated,
    isAuthorized("User"),
    validation(deleteCard),
    DeleteCard
  )

router.get(
  '/deadline',
  isAuthenticated,
  isAuthorized("User"),
  GetAllCardAfterDeadLine
)

module.exports = router;