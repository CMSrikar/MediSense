import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
    {
        patientName: { type: String, required: true },
        notes: { type: String },
        filePath: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Prescription", prescriptionSchema);
