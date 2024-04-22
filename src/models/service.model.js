const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the main schema
const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["socialMedia", "video", "corporate"],
    required: true,
  },
  description: {
    type: Array,
    required: true,
  },
});

// Create and export the mongoose model
module.exports = mongoose.model("Service", serviceSchema);