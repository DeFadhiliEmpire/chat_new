const express = require("express");

const router = express.Router();

const {
  getMessages,
  createMessages,
  deleteAllMessages,
} = require("../controllers/messageControllers");

//Get all messsages
router.get("/", getMessages);

//post the message
router.post("/", createMessages);

//delete the message
router.delete("/", deleteAllMessages);

module.exports = router;
