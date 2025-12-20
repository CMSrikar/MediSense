import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: false
  },

  // 📍 Location of hospital (for nearby search)
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }
});

export default mongoose.model("Hospital", hospitalSchema);