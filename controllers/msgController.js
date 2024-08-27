const Message = require("../models/msg");

const sendMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getMessagesByGroup = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId }).populate("sender");
    res.send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { sendMessage, getMessagesByGroup};
