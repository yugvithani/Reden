const express = require("express");
const {
    sendMsg,
    getMsgsByGroup,
    getDirectMsgsByReceiver,
    getDirectMsgsBySender,
    getDirectMsgs
} = require("../controllers/msgController");

const router = express.Router();

// send msg by msg instance
router.post("/", sendMsg);

// get msg by group id
router.get("/group/:groupId", getMsgsByGroup);

// get direct msg by receiver id
router.get("/receiver/:userId", getDirectMsgsByReceiver);

// get direct msg by sender id
router.get("/sender/:userId", getDirectMsgsBySender);

// get direct msg between sender and receiver
router.get("/directMsgBetween/:sid/:rid", getDirectMsgs)

module.exports = router;
