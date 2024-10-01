const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  getCommentById,
  createComment,
  getAllCommentOnCard,
  deleteComment,
  updateComment,
} = require("./Comments.validators.js");

const {
  GetAllCommentOnCard,
  GetCommentById,
  CreateNewComment,
  DeleteComment,
  UpdateComment,
} = require("./Comments.controller.js");

router.route('/:boardId/:listId/:cardId')
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getAllCommentOnCard),
    GetAllCommentOnCard
  )
  .post(
    isAuthenticated,
    isAuthorized("User"),
    validation(createComment),
    CreateNewComment
  )

router.route('/:boardId/:listId/:cardId/:commentId')
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getCommentById),
    GetCommentById
  )
  .put(
    isAuthenticated,
    isAuthorized("User"),
    validation(updateComment),
    UpdateComment
  )
  .delete(
    isAuthenticated,
    isAuthorized("User"),
    validation(deleteComment),
    DeleteComment
  )

module.exports = router;