const express = require("express");
const { createGroup, getGroups, getGroupById } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:id", getGroupById);

module.exports = router;
