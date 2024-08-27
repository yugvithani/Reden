const express = require("express");
const { createContact, getContactsByUser } = require("../controllers/contactController");

const router = express.Router();

router.post("/contacts", createContact);
router.get("/users/:userId/contacts", getContactsByUser);

module.exports = router;
