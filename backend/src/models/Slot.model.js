import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  date: String,          // "2025-12-20"
  time: String,          // "10:30 AM"
  period: String,        // morning / afternoon
  isBooked: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Slot", slotSchema);