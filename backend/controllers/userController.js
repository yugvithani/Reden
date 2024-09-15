const User= require("../models/user");
const Msg = require("../models/msg");
const Group = require("../models/group");

const createUser = async (req, res) => {
  try {
    const user = new User({
      ...req.body, 
      createdAt : new Date(),
      updatedAt : new Date(),
    });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).send();
    user.set({ updatedAt: new Date() });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send();
    
    await Msg.deleteMany({$or: [{sender : userId},{receiver : userId}]});

    const groups = await Group.find({$or: [{admin: userId}, {participant: userId}]});
    for(const group of groups){
      if(group.admin.equals(userId))
        await Group.findByIdAndDelete(group._id);
      else
        await Group.updateOne({_id: group._id}, {$pull: { participant: userId}});
    }

    await User.findByIdAndDelete(userId);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createContact = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const contactId = req.params.cid;
    const contactUser = await User.findById(contactId);

    if (!user || !contactUser) {
      return res.status(404).json({ message: 'User or contact user not found' });
    }

    const contactExists = user.contact.some(contact => contact.receiver.equals(contactId));
    if (contactExists) {
      return res.status(400).json({ message: 'Contact already exists' });
    }

    const contact = {
      receiver : contactId, 
      lastSeen : new Date(),
    };
    const contactForUser = {
      receiver : req.params.id, 
      lastSeen : new Date(),
    };

    user.contact.push(contact);
    contactUser.contact.push(contactForUser);
    await user.save();
    await contactUser.save();

    res.status(201).json({message: 'Contact added successfully'});
  } catch (error) {
    res.status(400).send(error);
  }
};

const getContactsByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) 
      return res.status(404).send({message: 'User is not exist.'});
    res.status(201).send(user.contact);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createContact,
  getContactsByUser
};