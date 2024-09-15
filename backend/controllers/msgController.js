const { timeStamp } = require("console");
const Msg = require("../models/msg");
const User = require("../models/user");
const Group = require("../models/group");

// send a message 
const sendMsg = async (req, res) => {
  try {
    const msg = new Msg({
      ...req.body, 
      timestamp : new Date()
    });
    const sender = await User.findById(req.body.sender);
    const isDirectMsg = req.body.isDirectMsg;
    const receiver = isDirectMsg ? await User.findById(req.body.receiver) : await Group.findById(req.body.group);
    
    if(isDirectMsg){
      // if (!sender.contact.some(contact => contact.receiver.equals(receiver._id))) {
      //     return res.status(400).send("Receiver is not in your contact.")
      // }
      // else{
        const contact = sender.contact.find(contact => contact.receiver.equals(receiver._id));
        contact.lastSeen = new Date();
        await sender.save();
        const contactInReceiver = receiver.contact.find(contact => contact.receiver.equals(sender._id));
        contactInReceiver.lastSeen = new Date();
        await receiver.save();
      // }
    }
    else{
      for(const userId of receiver.participant){
        const user = await User.findById(userId);
        user.group.push(receiver._id);
        await user.save();
      }
    }

    await msg.save();
    res.status(201).send(msg);
  } catch (error) {
    res.status(400).send("error");
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
    const directMsgs = await Msg.find({ sender: req.params.userId, isDirectMsg : true });
    res.send(directMsgs);
  } catch (error) {
    res.status(500).send(error);
  }
}

const getDirectMsgs = async (req, res) => {
  try{
    const senderId = req.params.sid;
    const receiverId = req.params.rid;

    const directMsgs = await Msg.find({sender : senderId, receiver : receiverId, isDirectMsg : true});
    res.send(directMsgs);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { sendMsg, getMsgsByGroup, getDirectMsgsByReceiver, getDirectMsgsBySender, getDirectMsgs};
