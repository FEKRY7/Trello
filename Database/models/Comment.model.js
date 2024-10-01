const mongoose = require('mongoose')

const { Types } = mongoose

const CommentSchema = new mongoose.Schema(
  {
    text: {
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
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;



