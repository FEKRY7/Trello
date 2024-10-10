const mongoose = require("mongoose");

const { Types } = mongoose;

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
  lists: [{
    type: Types.ObjectId,
    ref: 'List'
  }],
  teams: [{
    type: Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })

//p

const BoardModel = mongoose.model("Board", BoardSchema)

module.exports = BoardModel