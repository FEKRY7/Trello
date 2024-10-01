const commentModel = require("../../../Database/models/Comment.model.js");
const cardModel = require("../../../Database/models/Card.model.js");
const commentReplayModel = require("../../../Database/models/CommentReplay.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// createNewcommentReplayController
const CreateCommentReplay = async (req, res, next) => {
  try {
    const { cardId, commentId } = req.params;

    // Check if req.user exists and has a valid _id
    if (!req.user || !req.user._id) {
      return First(res, "User is not authenticated", 401, http.FAIL);
    }

    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    const isExistComment = await commentModel.findById(commentId);
    if (!isExistComment) {
      return First(res, "Invalid Comment Id", 404, http.FAIL);
    }

    // Create a new comment reply
    const commentReplay = await commentReplayModel.create({
      replytext: req.body.replytext,
      author: req.user._id,
      cardId,
    });

    isExistComment.replies.push(commentReplay._id);
    await isExistComment.save(); // Make sure to await this operation

    return Second(res, ["Done", commentReplay], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// updatecommentReplay
const UpdateCommentReplay = async (req, res, next) => {
  try {
    // commentId
    const { cardId, commentId, replyId } = req.params

    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    const isExistComment = await commentModel.findById(commentId);
    if (!isExistComment) {
      return First(res, "Invalid Comment Id", 404, http.FAIL);
    }

    const isExistcommentReplay = await commentReplayModel.findById(replyId);
    if (!isExistcommentReplay)
      return First(res, "This commentReplay Is Not Exist", 404, http.FAIL);

    if (isExistcommentReplay.author.toString() !== req.user._id.toString())
      return First(res, "Not Auth To update This Comment", 401, http.FAIL);

    isExistcommentReplay.replytext = req.body.replytext;
    isExistcommentReplay.save();

    return Second(res, ["Done", isExistcommentReplay], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// deletecommentReplay
const DeleteCommentReplay = async (req, res, next) => {
  try {
    const { cardId, commentId, replyId } = req.params;

    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    const isExistComment = await commentModel.findById(commentId);
    if (!isExistComment) {
      return First(res, "Invalid Comment Id", 404, http.FAIL);
    }

    const isExistCommentReplay = await commentReplayModel.findById(replyId);
    if (!isExistCommentReplay) {
      return First(res, "This comment reply does not exist", 404, http.FAIL);
    }

    // Check if the user is the author of the reply
    if (isExistCommentReplay.author.toString() !== req.user._id.toString()) {
      return First(res, "Not authorized to delete this comment reply", 401, http.FAIL);
    }

    // Delete the comment reply
    await commentReplayModel.findByIdAndDelete(replyId);

    // Remove the reply ID from the comment's replies array
    isExistComment.replies.pull(isExistCommentReplay._id);
    await isExistComment.save();

    return Second(res, ["Deleted successfully"], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// getcommentReplayById
const GetCommentReplayById = async (req, res, next) => {
  try {
    const { cardId, commentId, replyId } = req.params

    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    const isExistComment = await commentModel.findById(commentId);
    if (!isExistComment) {
      return First(res, "Invalid Comment Id", 404, http.FAIL);
    }

    const isExistcommentReplay = await commentReplayModel.findById(replyId);
    if (!isExistcommentReplay)
      return First(res, "This commentReplay Is Not Exist", 404, http.FAIL);

    if (isExistcommentReplay.author.toString() !== req.user._id.toString())
      return First(res, "Not Auth To update This Comment", 401, http.FAIL);

    // Return the comments
    return Second(res, ["Done", isExistcommentReplay], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}


// getAllcommentReplays
const GetAllcommentReplays = async (req, res, next) => {
  try {

    const { cardId, commentId } = req.params

    const card = await cardModel.findById(cardId)
    if (!card) return First(res, "Card not found.", 404, http.FAIL);


    const comment = await commentModel.findById(commentId);
    if (!comment) return First(res, "Comment not found.", 404, http.FAIL);


    const commentReplay = await commentReplayModel.find({});

    // Return the commentReplay
    return Second(res, ["Done", commentReplay], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  GetAllcommentReplays,
  GetCommentReplayById,
  CreateCommentReplay,
  DeleteCommentReplay,
  UpdateCommentReplay,
};
