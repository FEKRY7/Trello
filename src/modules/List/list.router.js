const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  getAllListOnBorad,
  createList,
  getListByID,
  updateList,
  deleteList,
} = require("./list.validators.js");

const {
  GetAllListOnBorad,
  CreateList,
  GetListByID,
  UpdateList,
  DeleteList,
} = require("./list.controller.js");

router.route('/:boardId')
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getAllListOnBorad),
    GetAllListOnBorad
  )
  .post(
    isAuthenticated,
    isAuthorized("User"),
    validation(createList),
    CreateList
  )

router.route('/:boardId/:listId')
  .get(
    isAuthenticated,
    isAuthorized("User"),
    validation(getListByID),
    GetListByID
  )
  .put(
    isAuthenticated,
    isAuthorized("User"),
    validation(updateList),
    UpdateList
  )
  .delete(
    isAuthenticated,
    isAuthorized("User"),
    validation(deleteList),
    DeleteList
  )


module.exports = router;


