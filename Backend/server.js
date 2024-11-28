// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
const User = require('./models/User'); // Import your User model
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For token generation
const cors = require('cors'); // Import CORS
const path = require('path')
const Announcement = require('./models/announcement'); // Import the model

// Initialize dotenv to load environment variables
dotenv.config();

// Create an instance of the Express application
const app = express();



// Connect to the MongoDB database
connectDB();

// Middleware to enable CORS and parse JSON requests
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Frontend')));

// Registration route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ message: 'User  already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ name, email, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: 'User  registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password incorrect' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect("/homepage")
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

//update route
app.post('/api/update', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({name: username});
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Update username if provided
        if (username) {
            user.name = username;
        }

        // Update email if provided and check for uniqueness
        if (email) {
            const existingEmailUser  = await User.findOne({ email });
            if (existingEmailUser  && existingEmailUser ._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        // Update password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Save the updated user
        await user.save();
        res.status(200).json({ message: 'User  information updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
//Announcements
app.post('/api/announcements', async (req, res) => {
    const { title, description, contact } = req.body;
    try {
        const newAnnouncement = new Announcement({
            title,
            description,
            contact
        });
        console.log(newAnnouncement)

        await newAnnouncement.save(); // Save the announcement to the database
        res.status(201).json(newAnnouncement); // Respond with the created announcement
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle errors
    }
});

// GET route to fetch all announcements
app.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find(); // Fetch all announcements
        res.status(200).json(announcements); // Respond with the announcements
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
});

// Define a simple route for testing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'register.html'));
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'homepage.html'));
});
// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 3090;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
