const mongoose = require("mongoose");

const { Types } = mongoose;

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    position: Number,
    boardId: {
        type: Types.ObjectId,
        ref: 'Board'
    },
    cards: [{
        type: Types.ObjectId,
        ref: 'Card'
    }]
}, { timestamps: true })

const ListModel = mongoose.model("List", ListSchema)

module.exports = ListModel
