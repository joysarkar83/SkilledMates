// models/announcement.js
const mongoose = require('mongoose');

// Define the schema for the Announcement
const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    }
});

// Create the model from the schema
const Announcement = mongoose.model('Announcement', announcementSchema);

// Export the model
module.exports = Announcement;