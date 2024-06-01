const User = require("../models/User");
//======================================================================//

//======================================================================//
module.exports = {
  createUser,
  getUser,
  getSingleUser,
  updatetSingleUser,
  deleteUser,
  addSkillsToUser,
};
//======================================================================//

//======================================================================//
async function createUser(req, res) {
  try {
    const user = await User.create(req.body);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json("No Beuno:(");
  }
}
//======================================================================//

//======================================================================//
async function getUser(req, res) {
  try {
    const user = await User.find({});

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json("No Beuno with retrieving a all the users :(");
  }
}
//======================================================================//

//======================================================================//
// Get a single user useFindById)()
async function getSingleUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json("No Beuno with retrieving a single user :(");
  }
}
//======================================================================//

//======================================================================//
// Update a single user
async function updatetSingleUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json("No Beuno with your update :(");
  }
}
//-----------------------------------------------------------------------//
async function addSkillsToUser(req, res) {
  try {
    // Find the user by id and use findById()
    const user = await User.findById(req.params.id);

    user.skills = user.skills.concat(req.body.skills);

    await user.save();

    res.send(user);
    // res.status(200).json(user);
  } catch (err) {
    res.status(400).json("No Beuno with adding a skill :(");
  }
}
//======================================================================//

//======================================================================//
// Delete a single user
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json("No Beuno with deleting a single user :(");
  }
}
