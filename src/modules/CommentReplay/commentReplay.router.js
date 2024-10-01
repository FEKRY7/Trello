const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  getCommentReplayById,
  createNewCommentReplay,
  deleteCommentReplay,
  updateCommentReplay,
} = require("./commentReplay.validators.js");

const {
  GetAllcommentReplays,
  GetCommentReplayById,
  CreateCommentReplay,
  DeleteCommentReplay,
  UpdateCommentReplay,
} = require("./commentReplay.controller.js");

router
  .route("/:cardId/:commentId")
  .get(GetAllcommentReplays)
  .post(
    isAuthenticated,
    isAuthorized("User"),
    validation(createNewCommentReplay),
    CreateCommentReplay
  );

router
  .route("/:cardId/:commentId/:replyId")
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getCommentReplayById),
    GetCommentReplayById
  )
  .put(
    isAuthenticated,
    isAuthorized("User"),
    validation(updateCommentReplay),
    UpdateCommentReplay
  )
  .delete(
    isAuthenticated,
    isAuthorized("User"),
    validation(deleteCommentReplay),
    DeleteCommentReplay
  )

module.exports = router;
