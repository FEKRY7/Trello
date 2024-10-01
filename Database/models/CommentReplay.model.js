const mongoose = require("mongoose");

const { Types } = mongoose;

const commentReplaySchema = new mongoose.Schema(
  {
    replytext: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
    },
    cardId: {
      type: Types.ObjectId,
      ref: "Card",
    },
    replies: [{
      type: Types.ObjectId,
      ref: "CommentReplay",
    }]
  },
  {
    timestamps: true,
  }
);

const commentReplayModel = mongoose.model("CommentReplay", commentReplaySchema);
module.exports = commentReplayModel;
