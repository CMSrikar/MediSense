import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot"
  },
  consultationType: String, // video / in-person
  meetLink: String,
  status: {
    type: String,
    default: "confirmed"
  },
  patient: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Appointment", appointmentSchema);