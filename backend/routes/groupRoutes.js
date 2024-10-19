const express = require("express");
const { createGroup, getGroups, getGroupById, getGroupByGroupCode, joinGroupByGroupCode, deleteGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:gid", getGroupById);
router.get("/groupcode/:gid", getGroupByGroupCode);
router.get("/:gid/:pid", joinGroupByGroupCode);
router.delete("/:uid/:gid", deleteGroup);

module.exports = router;
