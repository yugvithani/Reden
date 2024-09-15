const express = require("express");
const { sendMsg, getMsgsByGroup, getDirectMsgsByReceiver, getDirectMsgsBySender, getDirectMsgs } = require("../controllers/msgController");

const router = express.Router();

router.post("/", sendMsg);
router.get("/group/:groupId", getMsgsByGroup);
router.get("/receiver/:userId", getDirectMsgsByReceiver);
router.get("/sender/:userId", getDirectMsgsBySender);
router.get("/directMsgBetween/:sid/:rid", getDirectMsgs)

module.exports = router;
