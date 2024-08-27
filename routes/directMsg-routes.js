const express = require("express");
const { createDirectMessage, getDirectMessages } = require("../controllers/directMsgController");

const router = express.Router();

router.post("/directmessages", createDirectMessage);
router.get("/users/:userId/directmessages", getDirectMessages);

module.exports = router;
