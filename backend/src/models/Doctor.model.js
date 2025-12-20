import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  city: String,
  email: String,
  experience: Number,
  fees: Number,
  rating: Number
});

export default mongoose.model("Doctor", doctorSchema);