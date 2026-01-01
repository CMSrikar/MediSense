import mongoose from "mongoose";

const testBookingSchema = new mongoose.Schema(
    {
        patientName: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true },
        age: { type: Number },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab",
            required: true,
        },
        labName: { type: String, required: true },
        tests: [
            {
                code: { type: String, required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
            },
        ],
        preferredDate: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        address: { type: String, required: true },
        notes: { type: String },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true },
);

export default mongoose.model("TestBooking", testBookingSchema);
