const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Other fields in the schema
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  isVerified:{ type: Boolean, required: true },
});
const User = mongoose.model('User', userSchema);

module.exports = User;