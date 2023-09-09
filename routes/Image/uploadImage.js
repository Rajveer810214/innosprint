// const express = require('express');
// const cors = require('cors');
// const multerConfig = require('../../middleware/multerConfig.js'); // Import the multerConfig
// const router = express.Router();
// const fetchuser = require('../../middleware/fetchUser.js');
// const image = require('../../models/image.js');
// const User = require('../../models/User.js');
// router.use(cors());

// // Set up storage for image uploads using Multer
// router.post('/upload', multerConfig.single('image'), fetchuser, async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded.' });
//   }

//   const imageBuffer = req.file.buffer; // Get the image buffer data from req.file.buffer

//   try {
//     const story = await image.create({
//       image: imageBuffer, // Save the image buffer in the database
//       user: req.student.id,
//     });
//     res.status(200).json({ success: true, message: 'File uploaded successfully.', story });
//   } catch (error) {
//     console.error('Error occurred while processing the image:', error);
//     return res.status(500).json({ error: 'Internal server error occurred' });
//   }
// });

// router.get('/getimage',fetchuser, async (req, res) => {
//   try {
//     // const imageId = req.params.id;
//     const userId = req.student.id;
//     // console.log(userId)
//     const Image = await image.findOne({ user: userId });    // Find the image by its ID in the database
//     const ImageId=Image._id
//     const foundImage = await image.findById(ImageId);
//     if (!foundImage) {
//       return res.status(404).json({ error: 'Image not found' });
//     }
//     // Set the appropriate content type based on the image type (e.g., JPEG)
//     res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type as needed
//     // Send the image buffer as the response
//     res.send(Image.image);
//   } catch (error) {
//     console.error('Error occurred while fetching the image:', error);
//     return res.status(500).json({ error: 'Internal server error occurred' });
//   }
// });
// module.exports = router;

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

// // Set up storage for image uploads using Multer
// router.post('/upload', multerConfig.single('image'), fetchuser, async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded.' });
//   }

//   const imageBuffer = req.file.buffer; // Get the image buffer data from req.file.buffer

//   try {
//     const story = await image.create({
//       image: imageBuffer, // Save the image buffer in the database
//       user: req.student.id,
//     });

//     // Send the uploaded image for face recognition to the Flask API
//     const formData = new FormData();
//     formData.append('image', imageBuffer, {
//       filename: 'image.jpg', // Replace with the desired filename
//       contentType: 'image/jpeg', // Adjust content type as needed
//     });

//     // Make an HTTP POST request to the Flask API
//     const response = await axios.post('http://127.0.0.1:5000/', formData, {
//   timeout: 30000, // Set a timeout of 30 seconds (adjust as needed)
//   headers: {
//     ...formData.getHeaders(),
//   },
// });


//     // Handle the response from the Flask API
//     console.log('API Response:', response.data);

//     res.status(200).json({ success: true, message: 'File uploaded and recognized successfully.', story });
//   } catch (error) {
//     console.error('Error occurred while processing the image:', error);
//     return res.status(500).json({ error: 'Internal server error occurred' });
//   }
// });
router.post('/upload', multerConfig.single('image'), fetchuser, async (req, res) => {
   const imageBuffer = req.body.buffer //req.file.buffer; // Get the image buffer data from req.file.buffer
   console.log(imageBuffer)
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

router.get('/getimage', fetchuser, async (req, res) => {
  try {
    // const imageId = req.params.id;
    const userId = req.student.id;
    // console.log(userId)
    const Image = await image.findOne({ user: userId });    // Find the image by its ID in the database
    const ImageId = Image._id
    const foundImage = await image.findById(ImageId);
    if (!foundImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    // Set the appropriate content type based on the image type (e.g., JPEG)
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type as needed
    // Send the image buffer as the response
    res.send(Image.image);
  } catch (error) {
    // console.error('Error occurred while fetching the image:', error);
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
});

module.exports = router;
