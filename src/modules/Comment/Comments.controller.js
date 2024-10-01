const boardModel = require('../../../Database/models/Board.model.js')
const listModel = require("../../../Database/models/List.model.js");
const cardModel = require("../../../Database/models/Card.model.js");
const commentModel = require("../../../Database/models/Comment.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// Get all comments on a card
const GetAllCommentOnCard = async (req, res, next) => {
  try {

    const { boardId, listId, cardId } = req.params

    // Validate that the user is a member of the board
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    const list = await listModel.findById(listId)
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    const card = await cardModel.findById(cardId)
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Get all comments on the card
    const comments = await commentModel.find({ cardId });
    if (!comments) return First(res, "No Comments found in this card.", 404, http.FAIL);

    // Return the comments
    return Second(res, ["Done", comments], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

// Get a comment by ID
const GetCommentById = async (req, res, next) => {
  try {
    const { boardId, listId, cardId, commentId } = req.params

    //check board
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);

    //check board
    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    //get cards
    const card = await cardModel.findById(cardId)
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Get all comments on the card
    const comment = await commentModel.findById(commentId);
    if (!comment) return First(res, "Comment not found.", 404, http.FAIL);

    // Return the comments
    return Second(res, ["Done", comment], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

const CreateNewComment = async (req, res, next) => {
  try {
    const { boardId, listId, cardId } = req.params;

    // Validate that the board exists
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Validate that the user is a member of the board
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    // Validate that the list exists
    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    // Validate that the card exists
    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Create a new comment
    const comment = await commentModel.create({
      text: req.body.text,
      author: req.user._id,
      cardId
    });

    // Return the new comment
    return Second(res, ["Comment created successfully", comment], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Update a comment
const UpdateComment = async (req, res, next) => {
  try {
    const { boardId, listId, cardId, commentId } = req.params;
    const { text } = req.body;

    // Validate that the board exists
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Validate that the user is a member of the board
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    // Validate that the list exists
    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    // Validate that the card exists
    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Get the comment by ID
    const comment = await commentModel.findById(commentId);

    // Check if the comment exists
    if (!comment) return First(res, "Comment not found.", 404, http.FAIL);

    // Check if the user is the author of the comment or the board creator
    if (comment.author.toString() !== req.user._id.toString() && board.createdBy.toString() !== req.user._id.toString()) {
      return First(res, "You are not authorized to update this comment.", 403, http.FAIL);
    }

    // Update the comment text
    comment.text = text;
    await comment.save();

    // Return the updated comment
    return Second(res, ["Comment updated successfully", comment], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Delete a comment
const DeleteComment = async (req, res, next) => {
  try {
    const { boardId, listId, cardId, commentId } = req.params;

    // Validate that the board exists
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Validate that the user is a member of the board
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    // Validate that the list exists
    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    // Validate that the card exists
    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Get the comment by ID
    const comment = await commentModel.findById(commentId);
    if (!comment) return First(res, "Comment not found.", 404, http.FAIL);

    // Check if the user is the author of the comment or the board creator
    if (
      comment.author.toString() !== req.user._id.toString() &&
      board.createdBy.toString() !== req.user._id.toString()
    ) {
      return First(res, "You are not authorized to delete this comment.", 403, http.FAIL);
    }

    // Delete the comment
    await comment.deleteOne();

    // Remove the comment from the card's comments array
    card.comments.pull(comment._id);
    await card.save();

    // Return a success response
    return Second(res, "Comment deleted successfully.", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  GetAllCommentOnCard,
  GetCommentById,
  CreateNewComment,
  DeleteComment,
  UpdateComment
}
