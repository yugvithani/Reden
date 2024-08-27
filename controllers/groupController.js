const Group = require("../models/group");

const createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
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
    if (!group) return res.status(404).send();
    res.send(group);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createGroup, getGroups, getGroupById };
