const Group = require("../models/group");
const User = require("../models/user");
const Msg = require("../models/msg")

const createGroup = async (req, res) => {
  try {
    // Function to generate a random 6-digit group code
    const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

    let groupCode;
    let isUnique = false;

    // Ensure the generated group code is unique
    while (!isUnique) {
      groupCode = generateCode();
      const existingGroup = await Group.findOne({ groupCode });
      isUnique = !existingGroup; // If no group with this code exists, it's unique
    }

    const adminId = req.body.admin;
    const admin = await User.findById(adminId); // Find the admin (creator of the group)
    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    const userIds = req.body.participants; // Frontend should pass 'participants' array
    const users = await User.find({ _id: { $in: userIds } });

    // Check if all participants exist
    if (users.length !== userIds.length) {
      return res.status(400).send("Some participants not found");
    }

    // Create a new group with the participants' IDs and the generated group code
    const group = new Group({
      ...req.body,
      groupCode: groupCode, // Assign the generated group code
      participant: userIds // Assign participants as an array of ObjectIds
    });

    // Add the group's ObjectId to the admin's group array
    admin.group.push(group._id);
    await admin.save(); // Save the updated admin

    // Save the group reference in each participant's group array
    for (const user of users) {
      user.group.push(group._id); // Add group to each user's group array
      await user.save(); // Save each participant after updating
    }

    // Save the group document in the database
    await group.save();

    const io = req.app.get('socketio');
    io.to(req.body.admin).emit('group-created', group); // Notify only the admin and notify participants
    let len = req.body.participants.length;
    while(len--){
      io.to(req.body.participants[len]).emit('group-created', group); 
    }

    res.status(201).send(group); // Respond with the created group
  } catch (error) {
    console.error('Error creating group:', error);
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
    const group = await Group.findById(req.params.gid).populate('admin','username');   
    if (!group) return res.status(404).send("Group not found");
    res.send(group);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getGroupByGroupCode = async (req, res) => {
  try {
    const group = await Group.findOne({ groupCode : req.params.gid});   
    if (!group) return res.status(404).send("Group not found");
    res.send(group);
  } catch (error) {
    res.status(500).send(error);
  }
};

const joinGroupByGroupCode = async (req, res) => {
  try {
    const group = await Group.findOne({ groupCode: req.params.gid });
    if (!group) return res.status(404).send("Group code is invalid.");

    const user = await User.findById(req.params.pid);
    if (user.group.includes(group._id))
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
  try {
    const userId = req.params.uid;
    const groupId = req.params.gid;

    const user = await User.findById(userId);
    const group = await Group.findById(groupId);

    const isAdmin = group.admin.equals(user._id);
    if (isAdmin) {
      Msg.deleteMany({ group: group._id });
      const admin = await User.findById(userId);
      admin.group.pull(group._id);
      const participant = group.participant
      for (const pid of participant) {
        const user = await User.findById(pid);
        user.group.pull(group._id);
        await user.save();
      }
    }
    else {
      return res.status(400).send("Only Admin can delete the Group.");
    }
    await Group.deleteOne({ _id: groupId });
    res.status(200).send("Group deleted successfully.")
  }
  catch {
    res.status(400).send("Failed to delete Group.")
  }
}

module.exports = { createGroup, getGroups, getGroupById, getGroupByGroupCode, joinGroupByGroupCode, deleteGroup };
