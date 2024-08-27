const express = require("express");
const { sendMessage, getMessagesByGroup } = require("../controllers/msgController");

const router = express.Router();

router.post("/messages", sendMessage);
router.get("/group/:groupId/messages", getMessagesByGroup);

module.exports = router;
