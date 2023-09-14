const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: { type: Buffer, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
