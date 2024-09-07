const express = require("express");
const { createContact, getContactsByUser } = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContact);
router.get("/user/:userId", getContactsByUser);

module.exports = router;
