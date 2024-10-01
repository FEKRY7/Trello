const express = require("express");

const userRouter = require("./src/modules/auth/auth.router.js");
const boardRouter = require("./src/modules/Board/board.router.js");
const listRouter = require("./src/modules/List/list.router.js");
const cardRouter = require("./src/modules/Card/card.router.js");
const commentRouter = require("./src/modules/Comment/Comments.router.js");
const commentReplayRouter = require("./src/modules/CommentReplay/commentReplay.router.js");
const attachmentRouter = require("./src/modules/Attachment/attachment.router.js");
const mongodbconnect = require("./Database/dbConnection.js");

const AppRouter = (app) => {
  mongodbconnect();

  // convert Buffer Data
  // Middleware to parse JSON
  app.use(express.json());

  // Routes      
  app.get('/api', (req, res) => {
    return res.send('Home');
  })

  app.use("/api/user", userRouter);
  app.use("/api/board", boardRouter);
  app.use("/api/list", listRouter);
  app.use("/api/card", cardRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/commentReplay", commentReplayRouter);
  app.use("/api/attachment", attachmentRouter);

  // 404 route
  app.use("*", (req, res) => {
    res.status(404).json({ Msg: "I Can't Found" });
  });
};

module.exports = AppRouter;
