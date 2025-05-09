const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: {
    type: String
  },
  photo: String,
});


const User = mongoose.model("User", userSchema);

module.exports = User;
