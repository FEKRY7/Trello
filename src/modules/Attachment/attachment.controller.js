const attachmentModel = require('../../../Database/models/Attachment.model.js')
const boardModel = require('../../../Database/models/Board.model.js')
const listModel = require("../../../Database/models/List.model.js");
const cardModel = require("../../../Database/models/Card.model.js");
const cloudinary = require('../../utils/cloud.js')


// Get all attachments on a card
const GetAllAttachmentsOnCard = async (req, res, next) => {
  try {
    const { boardId, listId, cardId } = req.params;

    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);

    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    const attachments = await attachmentModel.find({ cardId });
    if (!attachments) return First(res, "attachments Is Not Found", 404, http.FAIL);

    return Second(res, ["Done", attachments], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Create a new attachment on a card
const AddNewAttachment = async (req, res, next) => {
  try {
    const { boardId, listId, cardId } = req.params;
    const { fileName, fileType } = req.body;

    // Validate that the user is a member of the board
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    if (!board.teams.includes(req.user._id))
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);

    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    // Check if the card exists
    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Handle post images and videos upload options
    console.log(req.files);
    let files = []; // Initialize the files array

    if (req.files) {
      // If there are files
      if (req.files.files) {
        for (let i = 0; i < req.files.files.length; i++) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.files[i].path,
            { folder: `Trello-Attachments/Card-${card.title}` }
          );
          files.push({ secure_url, public_id });
        }
      }
    }

    // Create a new attachment
    const attachment = await attachmentModel.create({
      files,
      fileName,
      fileType,
      cardId,
      addedBy: req.user._id,
    });

    card.attachments.push(attachment._id);
    await card.save();

    // Return the attachment
    return Second(res, ["Done", attachment], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get an attachment by ID
const GetAttachmentByID = async (req, res, next) => {
  try {

    const { boardId, attachmentId } = req.params

    // Validate that the board exists
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Validate that the user is a member of the board
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    const attachment = await attachmentModel.findById(attachmentId)
    if (!attachment) return First(res, "attachments Is Not Found", 404, http.FAIL);

    return Second(res, ["Done", attachment], 201, http.SUCCESS)

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
}

// Updateat an attachment
const Updateattachment = async (req, res, next) => {
  try {
    const { boardId, listId, cardId, attachmentId } = req.params;

    // Validate that the board exists
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Check if the user is authorized
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    // Validate that the list exists
    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    // Validate that the card exists
    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Validate that the attachment exists
    const attachment = await attachmentModel.findById(attachmentId);
    if (!attachment) return First(res, "attachments Is Not Found", 404, http.FAIL);

    // If files are uploaded, handle the update process
    if (req.files?.files) {
      let newFiles = [];

      // Upload new files to Cloudinary
      for (let i = 0; i < req.files.files.length; i++) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.files.files[i].path,
          { folder: `Trello-Attachments/Card-${card.title}` }
        );
        newFiles.push({ secure_url, public_id });
      }

      // Store new files in the request body
      req.body.files = newFiles;

      // Delete old files from Cloudinary
      if (attachment.files) {
        for (let i = 0; i < attachment.files.length; i++) {
          await cloudinary.uploader.destroy(attachment.files[i].public_id);
        }
      }
    }

    // Update the attachment record
    const updatedAttachment = await attachmentModel.findByIdAndUpdate(
      attachmentId, // Use attachmentId from params
      req.body,
      { new: true }
    );

    return Second(res, ["Done", updatedAttachment], 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// Delete an attachment
const DeleteAttachment = async (req, res, next) => {
  try {
    const { boardId, listId, cardId, attachmentId } = req.params;

    // Validate that the board exists
    const board = await boardModel.findById(boardId);
    if (!board) return First(res, "Board not found.", 404, http.FAIL);

    // Check if the user is authorized
    if (!board.teams.includes(req.user._id)) {
      return First(res, "You are not authorized to view this board.", 403, http.FAIL);
    }

    // Validate that the list exists
    const list = await listModel.findById(listId);
    if (!list) return First(res, "List not found.", 404, http.FAIL);

    // Validate that the card exists
    const card = await cardModel.findById(cardId);
    if (!card) return First(res, "Card not found.", 404, http.FAIL);

    // Validate that the attachment exists
    const attachment = await attachmentModel.findById(attachmentId);
    if (!attachment) return First(res, "attachments Is Not Found", 404, http.FAIL);

    // Delete the files from Cloudinary
    for (let file of attachment.files) {
      await cloudinary.uploader.destroy(file.public_id);
    }

    // Remove the attachment from the card
    card.attachments.pull(attachment._id);
    await card.save();

    // Delete the attachment from the database
    await attachment.deleteOne();

    // Return success response
    return Second(res, "Attachment deleted successfully", 201, http.SUCCESS);

  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


module.exports = {
  GetAllAttachmentsOnCard,
  GetAttachmentByID,
  AddNewAttachment,
  Updateattachment,
  DeleteAttachment,
}



