const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    default: Date.now, 
    expires: 3600 // 1 hour expiration
  }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);