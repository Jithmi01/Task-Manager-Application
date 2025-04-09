const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nameWithInitials: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },

  experience: { type: String, required: true },
  portfolioURL: { type: String, required: true },
  linkedinURL: { type: String, required: true },
  skills: { type: [String], required: true },

  profilePicture: {
    data: Buffer,
    contentType: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;