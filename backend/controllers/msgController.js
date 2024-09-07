const Msg = require("../models/msg");

// send a message 
const sendMsg = async (req, res) => {
  try {
    const msg = new Msg(req.body);
    await msg.save();
    res.status(201).send(msg);
  } catch (error) {
    res.status(400).send(error);
  }
};

// get messages by group
const getMsgsByGroup = async (req, res) => {
  try {
    const msgs = await Msg.find({ group: req.params.groupId });
    res.send(msgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { sendMsg, getMsgsByGroup};
