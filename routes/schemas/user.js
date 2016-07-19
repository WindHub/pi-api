const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  grpId: Number,
  registerAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);

module.exports = {
  Schema: { userSchema: userSchema },
  User: User
};
