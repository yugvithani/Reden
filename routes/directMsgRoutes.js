const express = require("express");
const { createDirectMsg, getDirectMsg } = require("../controllers/directMsgController");

const router = express.Router();

router.post("/", createDirectMsg);
router.get("/user/:userId", getDirectMsg);

module.exports = router;
