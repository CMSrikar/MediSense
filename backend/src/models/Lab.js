import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        city: { type: String, required: true, lowercase: true, trim: true },
        address: { type: String, required: true },
        rating: { type: Number, default: 4.5 },
        image: { type: String }, // URL or path to image
        tests: [
            {
                code: { type: String, required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                category: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Lab", labSchema);
