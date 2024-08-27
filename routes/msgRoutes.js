const express = require("express");
const { sendMsg, getMsgsByGroup } = require("../controllers/msgController");

const router = express.Router();

router.post("/", sendMsg);
router.get("/group/:groupId", getMsgsByGroup);

module.exports = router;
