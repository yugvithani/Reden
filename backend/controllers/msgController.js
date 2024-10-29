const Msg = require("../models/msg");
const User = require("../models/user");
const Group = require("../models/group");

const sendMsg = async (req, res) => {
  try {
    const msg = new Msg({
      ...req.body,
      timestamp: new Date()
    });
    const sender = await User.findById(req.body.sender);
    const isDirectMsg = req.body.isDirectMsg;
    const receiver = isDirectMsg ? await User.findById(req.body.receiver) : await Group.findById(req.body.group);

    // only change lastseen if one to one chat
    if (isDirectMsg) {
      const contact = sender.contact.find(contact => contact.receiver.equals(receiver._id));
      contact.lastSeen = new Date();
      await sender.save();
      const contactInReceiver = receiver.contact.find(contact => contact.receiver.equals(sender._id));
      contactInReceiver.lastSeen = new Date();
      await receiver.save();
    }

    // save msg to send msg
    await msg.save();
    res.status(201).send(await msg.populate('sender', 'username'));
  } catch (error) {
    console.log('Error to send message:', error);
    res.status(500).send(error);
  }
};

const getMsgsByGroup = async (req, res) => {
  try {
    // find msg and populate sender for chat screen in frontend
    const msgs = await Msg.find({ group: req.params.groupId }).populate('sender', 'username');
    res.send(msgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDirectMsgsByReceiver = async (req, res) => {
  try {
    const directMsgs = await Msg.find({ receiver: req.params.userId });
    res.send(directMsgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDirectMsgsBySender = async (req, res) => {
  try {
    const directMsgs = await Msg.find({ sender: req.params.userId, isDirectMsg: true });
    res.send(directMsgs);
  } catch (error) {
    res.status(500).send(error);
  }
}

const getDirectMsgs = async (req, res) => {
  try {
    const senderId = req.params.sid;
    const receiverId = req.params.rid;

    // 
    const directMsgs = await Msg.find({ sender: senderId, receiver: receiverId, isDirectMsg: true }).populate('sender', 'username').populate('receiver', 'username');
    res.send(directMsgs);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  sendMsg,
  getMsgsByGroup,
  getDirectMsgsByReceiver,
  getDirectMsgsBySender,
  getDirectMsgs
};
