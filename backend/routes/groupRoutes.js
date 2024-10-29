const express = require("express");
const {
    createGroup,
    getGroups,
    getGroupById,
    getGroupByGroupCode,
    joinGroupByGroupCode,
    deleteGroup,
} = require("../controllers/groupController");

const router = express.Router();

// create Group by group obj
router.post("/", createGroup);

// get all groups
router.get("/", getGroups);

// get group by id
router.get("/:gid", getGroupById);

// get group by group code
router.get("/groupcode/:gcode", getGroupByGroupCode);

// join group by group code
router.get("/:gcode/:pid", joinGroupByGroupCode);

// delete group by group id
router.delete("/:uid/:gid", deleteGroup);

module.exports = router;
