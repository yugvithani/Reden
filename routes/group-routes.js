const express = require("express");
const { createGroup, getGroups, getGroupById } = require("../controllers/groupController");

const router = express.Router();

router.post("/groups", createGroup);
router.get("/groups", getGroups);
router.get("/groups/:id", getGroupById);

module.exports = router;
