const express = require("express");
const { createDirectMsg, getDirectMsgs } = require("../controllers/directMsgController");

const router = express.Router();

router.post("/", createDirectMsg);
router.get("/user/:userId", getDirectMsgs);

module.exports = router;
