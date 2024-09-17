const Group = require("../models/group");
const User = require("../models/user");
const Msg = require("../models/msg")

const createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    const adminId = req.body.admin;
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    admin.group.push(group._id);
    await admin.save();
    
    const userIds = req.body.participant
    const users = await User.find({_id : {$in : userIds}});
    
    if (users.length !== userIds.length) {
      return res.status(400).send("Some participants not found");
    }
    
    for (const user of users) {
      user.group.push(group._id);
      await user.save();
    }
    
    await group.save();
    res.status(201).send(group);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.send(groups);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).send("Group not found");
    res.send(group);
  } catch (error) {
    res.status(500).send(error);
  }
};

const joinGroupByGroupCode = async (req, res) => {
  try {
    const group = await Group.findOne({groupCode : req.params.gid});
    if (!group) return res.status(404).send("Group code is invalid.");
    
    const user = await User.findById(req.params.pid);
    if(user.group.includes(group._id))
      return res.status(404).send("User already in group");

    group.participant.push(user._id);
    user.group.push(group._id);
    await group.save();
    await user.save();
    res.send(group);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteGroup = async (req, res) => {
  try{
    const userId = req.params.uid;
    const groupId = req.params.gid;

    const user = await User.findById(userId);
    const group = await Group.findById(groupId);

    const isAdmin = group.admin.equals(user._id);
    if(isAdmin){
      Msg.deleteMany({group: group._id});
      const admin = await User.findById(userId);
      admin.group.pull(group._id);
      const participant = group.participant
      for(const pid of participant){
        const user = await User.findById(pid);
        user.group.pull(group._id);
        await user.save();
      }
    }
    else{
      return res.status(400).send("Only Admin can delete the Group.");
    }
    console.log(0)
    await Group.deleteOne({_id: groupId});
    console.log(1)
    res.status(200).send("Group deleted successfully.")
  }
  catch{
    res.status(400).send("Failed to delete Group.")
  }
}

module.exports = { createGroup, getGroups, getGroupById, joinGroupByGroupCode, deleteGroup };
