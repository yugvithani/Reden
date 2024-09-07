const Contact = require("../models/contact");

const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getContactsByUser = async (req, res) => {
  try {
    const contacts = await Contact.find({ sender: req.params.userId }).populate("receiver");
    res.send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createContact, getContactsByUser };
