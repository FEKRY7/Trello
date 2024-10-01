const mongoose = require("mongoose");

const { Types } = mongoose;

const CardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['ToDo', 'Doing', 'Done'],
        default: "ToDo",
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    assignTo: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        require: true,
        min: Date.now()
    },
    listId: {
        type: Types.ObjectId,
        ref: 'List'
    },
    comments: [{
        type: Types.ObjectId,
        ref: 'Comment'
    }],
    attachments: [{
        type: Types.ObjectId,
        ref: 'Attachment'
    }]
}, { timestamps: true })

const CardModel = mongoose.model("Card", CardSchema)

module.exports = CardModel