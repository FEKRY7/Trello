const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");


const {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardByID
} = require("./board.validators.js");

const {
  CreateBoard,
  GetAllBoards,
  GetAllBoardsOfUser,
  UpdateBoard,
  DeleteBoard,
  GetBoardByID,
  AddTeamMembersToBoardByCreator
} = require("./board.controller.js");

const listRouter = require("../List/list.router.js");

router.use('/:boardId/list', listRouter)


router.route('/')
  .post(
    isAuthenticated,
    isAuthorized("User"),
    validation(createBoard),
    CreateBoard
  )
  .get(GetAllBoards)
  .get(
    isAuthenticated,
    isAuthorized("User"),
    GetAllBoardsOfUser
  )
// Only Loggin User 


router.route('/:boardId')
  .put(
    isAuthenticated,
    isAuthorized("User"),
    validation(updateBoard),
    UpdateBoard
  )
  .delete(
    isAuthenticated,
    isAuthorized("User"),
    validation(deleteBoard),
    DeleteBoard
  )
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getBoardByID),
    GetBoardByID
  )
  .post(
    isAuthenticated,
    isAuthorized("User"),
    AddTeamMembersToBoardByCreator
  )

module.exports = router;









