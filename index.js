// Importing the route handlers
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const app = express();
app.use(cors());
// Connect to MongoDB
connectToMongo();
// Route Handlers

//User Routes
const authRoute = require('./routes/Authentication/auth');
const userRoute = require('./routes/getUser');
const validateRoute = require('./routes/Authentication/verify');
const passwordResetRoute = require('./routes/password/resetPassword');
const imageUpload = require('./routes/Image/uploadImage');
// Assigning the route handlers to specific paths
//user side
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/validate', validateRoute);
app.use('/api/password', passwordResetRoute);
app.use('/api/image', imageUpload);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
// module.exports = app