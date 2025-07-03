const User = require('../models/Users')

const initialUser = {
    name: "KwesitheDev",
    username: "KwesitheDev",
    password: "password123"
}

const userInDb = async () => {
  return await User.find({});
};


const resetDbWithInitialUser = async () => {
  await User.deleteMany({});
  const user = new User(initialUser);
  await user.save();
};

module.exports = {
    initialUser,
    userInDb,
    resetDbWithInitialUser
}