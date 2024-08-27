const DirectMessage = require("../models/directMsg");

const createDirectMessage = async (req, res) => {
  try {
    const directMessage = new DirectMessage(req.body);
    await directMessage.save();
    res.status(201).send(directMessage);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getDirectMessages = async (req, res) => {
  try {
    const directMessages = await DirectMessage.find({ participants: req.params.userId }).populate("messages");
    res.send(directMessages);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createDirectMessage, getDirectMessages };
