const express = require("express");
const { createGroup, getGroups, getGroupById, joinGroupByGroupCode, deleteGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:id", getGroupById);
router.get("/:gid/:pid", joinGroupByGroupCode);
router.delete("/:uid/:gid", deleteGroup);

module.exports = router;
