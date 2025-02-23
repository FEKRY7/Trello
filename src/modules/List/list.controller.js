const boardModel = require('../../../Database/models/Board.model.js')
const listModel = require("../../../Database/models/List.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// get all lists on a board
const GetAllListOnBorad = async (req, res, next) => {
  try {
    const { boardId } = req.params
    //check board existing
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);


    // check that the user is a member of the board
    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);


    // Get all lists on the board
    const lists = await listModel.find({ boardId })
    if (!lists) return First(res, "No lists found in this board.", 404, http.FAIL);

    return Second(res, ["Done", lists], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get a board by ID
const GetListByID = async (req, res, next) => {
  try {
    const { boardId, listId } = req.params

    //check board existing
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // check that the user is a member of the board
    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);

    const list = await listModel.findById(listId)
    if (!list) return First(res, "list not found.", 404, http.FAIL);

    return Second(res, ["Done", list], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const CreateList = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const { title, position } = req.body

    const board = await boardModel.findById(boardId)
    if (!board) return First(res, "Board Is Not Found", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(
        res,
        "You are not authorized to create lists on this board.",
        403,
        http.FAIL
      );

    const list = await listModel.create({ title, position, boardId })
    board.lists.push(list._id)
    await board.save()

    return Second(res, ['Done', list], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

const UpdateList = async (req, res, next) => {
  try {
    const { boardId, listId } = req.params
    const { title, position } = req.body

    const board = await boardModel.findById(boardId)
    if (!board) return First(res, "Board Is Not Found", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(
        res,
        "You are not authorized to update lists on this board.",
        403,
        http.FAIL
      );

    const list = await listModel.findById(listId)
    if (!list) return First(res, "list Is Not Found", 404, http.FAIL);

    list.title = title
    list.position = position
    list.save()

    return Second(res, ["Done", list], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}


const DeleteList = async (req, res, next) => {
  try {
    const { boardId, listId } = req.params
    const board = await boardModel.findById(boardId)
    if (!board) return First(res, "Board Not Found", 404, http.FAIL);

    if (board.createdBy.toString() !== req.user._id.toString())
      return First(
        res,
        "You are not authorized to delete this list ... only board owner can do that"
        ,
        403,
        http.FAIL
      );

    const list = await listModel.findById(listId)
    if (!list) return First(res, "list Not Found", 404, http.FAIL);

    await list.deleteOne();
    board.lists.pull(list._id)
    await board.save()
    return Second(res, ["List deleted successfully"], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

module.exports = {
  GetAllListOnBorad,
  CreateList,
  GetListByID,
  UpdateList,
  DeleteList,
};
