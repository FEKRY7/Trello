const mongoose = require("mongoose");

const { Types } = mongoose;

const AttachmentSchema = new mongoose.Schema({
  files: [{
    secure_url: String,
    public_id: String
  }],
  fileName: String,
  fileType: String,
  cardId: {
    type: Types.ObjectId,
    ref: 'Card'
  },
  addedBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true })

const AttachmentModel = mongoose.model("Attachment", AttachmentSchema)

module.exports = AttachmentModel