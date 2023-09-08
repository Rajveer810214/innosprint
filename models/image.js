const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: { type: Buffer, required: true }, // Specify that image is of type Buffer
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }, // Add a timestamp field to store the creation date and time
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
