const boardModel = require('../../../Database/models/Board.model.js')
const listModel = require("../../../Database/models/List.model.js");
const cardModel = require("../../../Database/models/Card.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllCardsOnList = async (req, res, next) => {
  try {

    const { boardId, listId } = req.params

    //check board
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);

    //check board
    const list = await listModel.findById(listId);
    if (!list) return First(res, "list not found.", 404, http.FAIL);

    //get cards
    const cards = await cardModel.find({ listId })
    if (!cards) return First(res, "No cards found in this list.", 404, http.FAIL);

    return Second(res, ["Done", cards], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetCardById = async (req, res, next) => {
  try {

    const { boardId, listId, cardId } = req.params
    console.log(req.user._id);

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

    return Second(res, ["Done", card], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// Create a new card
const CreateNewCard = async (req, res, next) => {
  try {
    const { boardId, listId } = req.params;
    req.body.createdBy = req.user._id; // Assign the user ID from the request

    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Check if the user is authorized to create cards in this board
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to create cards on this board.", 403, http.FAIL);
    }

    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    req.body.listId = list._id

    const card = await cardModel.create(req.body);

    // Push the new card to the list's cards array and save the list
    list.cards.push(card._id);
    await list.save();

    return Second(res, ["Card created successfully", card], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateCard = async (req, res, next) => {
  try {
    const { boardId, listId, cardId } = req.params
    const { title, description, assignTo, deadline } = req.body

    const board = await boardModel.findById(boardId)
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to create lists on this board.", 403, http.FAIL);

    const list = await listModel.findById(listId)
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    const card = await cardModel.findById(cardId)
    if (!card) return First(res, "Card not found.", 404, http.FAIL);


    if (req.body.title) card.title = title
    if (req.body.description) card.description = description
    if (req.body.assignTo) card.assignTo = assignTo
    if (req.body.deadline) card.deadline = deadline

    await card.save()

    return Second(res, ["Done", card], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

const DeleteCard = async (req, res, next) => {
  try {
    const { boardId, listId, cardId } = req.params

    const board = await boardModel.findById(boardId)
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (board.createdBy.toString() !== req.user._id.toString())
      return First(res, "You are not authorized to delete this card ... only board owner can do that", 403, http.FAIL);


    const list = await listModel.findById(listId)
    if (!list) return First(res, "List not found.", 404, http.FAIL);


    const card = await cardModel.findById(cardId)
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    await card.deleteOne()
    list.cards.pull(card._id)
    await list.save()

    return Second(res, "Card deleted successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

const GetAllCardAfterDeadLine = async (req, res, next) => {
  try {
    const cardsAfterDeadLine = await cardModel.find({
      deadline: { $lte: new Date() },
      status: { $in: ["ToDo", "Doing"] }
    });

    // If no cards found, send a 404 response
    if (!cardsAfterDeadLine.length) {
      return First(res, "No cards found after the deadline.", 404, http.FAIL);
    }

    return Second(res, ["Done", { cards: cardsAfterDeadLine }], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


module.exports = {
  GetAllCardsOnList,
  CreateNewCard,
  GetCardById,
  UpdateCard,
  DeleteCard,
  GetAllCardAfterDeadLine
}