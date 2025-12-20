const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient_name: String,
    patient_email: String,
    patient_phone: String,
    appointment_date: String,
    appointment_time: String,
    department: String,
    doctor_name: String,
    symptoms: String,
    status: {
      type: String,
      default: "pending",
    },
    meet_link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);