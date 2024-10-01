const boardModel = require('../../../Database/models/Board.model.js')
const userModel = require('../../../Database/models/User.model.js')
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// Get all boards
const GetAllBoards = async (req, res, next) => {
  try {
    const boards = await boardModel.find();

    if (!boards) {
      return First(res, "No boards found", 404, http.FAIL);
    }

    return Second(res, ["Done", boards], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



// Get all boards of loggin user
const GetAllBoardsOfUser = async (req, res, next) => {
  try {
    const boards = await boardModel.find({ createdBy: req.user._id });

    if (!boards) {
      return First(res, "No boards found for this user", 404, http.FAIL);
    }

    return Second(res, ["Done", boards], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// Get a board by ID
const GetBoardByID = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    // Validate boardId
    if (!boardId) {
      return First(res, "Board ID is required", 400, http.FAIL);
    }

    const board = await boardModel.findById(boardId);

    if (!board) {
      return First(res, "Board not found", 404, http.FAIL);
    }

    return Second(res, ["Done", board], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const CreateBoard = async (req, res, next) => {
  try {
    const { title, description, teams } = req.body;
    const createdBy = req.user._id

    if (req.body.teams) {
      for (const member of teams) {
        const user = await userModel.findById(member)
        if (!user)
          return First(res, `This User : ${member} Is Not Exist`, 401, http.FAIL);
      }
    }

    // Add the creator to the board's members list
    const board = await boardModel.create({ title, description, teams, createdBy })

    board.teams.push(req.user._id);
    await board.save();

    return Second(res, ["Done", board], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

// Update a board
const UpdateBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    // Check if boardId is provided
    if (!boardId) {
      return First(res, "Board ID is required", 400, http.FAIL);
    }

    // Find the board by ID
    const board = await boardModel.findById(boardId);

    // Check if the board exists
    if (!board) {
      return First(res, "This board does not exist", 404, http.FAIL);
    }

    // Check if the user is authorized to update the board
    if (board.createdBy.toString() !== req.user._id.toString()) {
      return First(res, "You are not authorized to update this board", 403, http.FAIL);
    }

    // Update fields if provided in the request body
    const { title, description } = req.body;
    if (title) board.title = title;
    if (description) board.description = description;

    // Save the updated board
    await board.save();

    return Second(res, ["Board updated successfully", board], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const DeleteBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    // Validate boardId
    if (!boardId) {
      return First(res, "Board ID is required", 400, http.FAIL);
    }

    // Find the board by ID
    const board = await boardModel.findById(boardId);

    // Check if the board exists
    if (!board) {
      return First(res, "Board not found", 404, http.FAIL);
    }

    // Check if the user is authorized to delete the board
    if (board.createdBy.toString() !== req.user._id.toString()) {
      return First(res, "You are not authorized to delete this board", 403, http.FAIL);
    }

    // Delete the board
    await board.deleteOne();

    return Second(res, "Board deleted successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const AddTeamMembersToBoardByCreator = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { members } = req.body; // Team members to add

    // Find the board by ID
    const board = await boardModel.findById(boardId);

    // Check if the board exists
    if (!board) {
      return First(res, "Board not found", 404, http.FAIL);
    }

    // Check if the user is authorized (board creator)
    if (board.createdBy.toString() !== req.user._id.toString()) {
      return First(res, "You are not authorized to perform this action", 403, http.FAIL);
    }

    // Validate that `members` is provided and is an array
    if (!members || !Array.isArray(members)) {
      return First(res, "Members should be an array of user IDs", 400, http.FAIL);
    }

    // Validate if all members exist in the user collection
    const invalidMembers = await Promise.all(
      members.map(async (memberId) => {
        const user = await userModel.findById(memberId);
        if (!user) return memberId; // Return the invalid memberId
      })
    );

    // Filter out undefined values and check for invalid members
    const invalidUserIds = invalidMembers.filter((id) => id);
    if (invalidUserIds.length > 0) {
      return First(res, `Invalid members: ${invalidUserIds.join(", ")}`, 400, http.FAIL);
    }

    // Add members to the team, using `addToSet` to avoid duplicates
    board.teams.addToSet(...members);
    await board.save();

    return Second(res, ["Members added successfully", board], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



module.exports = {
  CreateBoard,
  GetAllBoards,
  GetAllBoardsOfUser,
  UpdateBoard,
  DeleteBoard,
  GetBoardByID,
  AddTeamMembersToBoardByCreator
}