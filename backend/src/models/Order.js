import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
        },
        name: { type: String, required: true }, // snapshot
        price: { type: Number, required: true }, // snapshot
        quantity: { type: Number, required: true },
    },
    { _id: false },
);

const orderSchema = new mongoose.Schema(
    {
        items: { type: [orderItemSchema], required: true },
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        customer: {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "cod"],
            default: "cod",
        },
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prescription",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
