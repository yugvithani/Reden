const DirectMsg = require("../models/directMsg");

const createDirectMsg = async (req, res) => {
  try {
    const directMsg = new DirectMsg(req.body);
    await directMsg.save();
    res.status(201).send(directMsg);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getDirectMsgs = async (req, res) => {
  try {
    const directMsgs = await DirectMsg.find({ receiver: req.params.userId }).populate("msg");
    res.send(directMsgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createDirectMsg, getDirectMsgs };
