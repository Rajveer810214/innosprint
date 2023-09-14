const express = require('express');
const cors = require('cors');
const multerConfig = require('../../middleware/multerConfig.js'); // Import the multerConfig
const axios = require('axios'); // Import axios
const FormData = require('form-data'); // Import the FormData library
const router = express.Router();
const fetchuser = require('../../middleware/fetchUser.js');
const image = require('../../models/image.js');
const User = require('../../models/User.js');
router.use(express.json());
router.use(cors());

// Set up storage for image uploads using Multer
router.post('/registerimage', multerConfig.single('image'), fetchuser, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const imageBuffer = req.file.buffer; // Get the image buffer data from req.file.buffer
  try {
    const story = await image.create({
      image: imageBuffer, // Save the image buffer in the database
      user: req.student.id,
    });
    res.status(200).json({ success: true, message: 'File uploaded successfully.', story });
  } catch (error) {
    console.error('Error occurred while processing the image:', error);
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
});
router.post('/checkimage', multerConfig.single('image'), fetchuser, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const imageBuffer = req.file.buffer;
  try {
    console.log(imageBuffer);
    const userId = req.student.id;
    const userImage = await image.findOne({ user: userId });

    if (!userImage) {
      return res.status(404).json({ error: 'User image not found.' });
    }
    const formData = new FormData();
    // Append the user's image
    formData.append('image1', req.file.buffer, {
      filename: 'user_image.jpg',
      contentType: 'image/jpeg',
    });

    // Append the new image
    formData.append('image2',userImage.image, {
      filename: 'new_image.jpg',
      contentType: 'image/jpeg',
    });

    // Make an HTTP POST request to the Flask API
    const response = await axios.post('http://127.0.0.1:5000/compare', formData, {
      timeout: 30000,
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Handle the response from the Flask API
    console.log('API Response:', response.data);

    res.status(200).json({ success: true, message: 'Files uploaded and recognized successfully.' });
  } catch (error) {
    console.error('Error occurred while processing the images:', error);
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
});

// router.post('/upload', fetchuser, async (req, res) => {
//    const imageBuffer = req.body.buffer //req.file.buffer; // Get the image buffer data from req.file.buffer
//    try {
//      const story = await image.create({
//        image: imageBuffer, // Save the image buffer in the database
//        user: req.student.id,
//      });
//      res.status(200).json({ success: true, message: 'File uploaded successfully.' });
//    } catch (error) {
//      console.error('Error occurred while processing the image:', error);
//      return res.status(500).json({ error: 'Internal server error occurred' });
//    }
//  });
router.get('/getimage', fetchuser, async (req, res) => {
  try {
    const userId = req.student.id;
    const Image = await image.findOne({ user: userId }); 
    const ImageId = Image._id;
    const foundImage = await image.findById(ImageId);

    if (!foundImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Assuming you have a base64 image string in `Image.image`
    const base64ImageData = Image.image;

    // Convert the base64 image data to a Buffer
    const binaryImageData = Buffer.from(base64ImageData, 'base64');
    console.log(binaryImageData)
    // Set the appropriate content type based on the image type (e.g., JPEG)
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type as needed

    // Send the binary image data as the response
    res.send(binaryImageData);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
});



module.exports = router;
