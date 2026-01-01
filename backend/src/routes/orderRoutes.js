import express from "express";
import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";
import { sendOrderReceipt } from "../utils/medicineEmailService.js";

const router = express.Router();

// POST /api/orders - create an order
router.post("/", async (req, res) => {
    try {
        const { items, customer, paymentMethod, prescriptionId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }

        // Load medicines to create snapshots and validate stock
        const medicineIds = items.map((i) => i.medicineId);
        const medicines = await Medicine.find({
            _id: { $in: medicineIds },
            isActive: true,
        });
        const medicineMap = new Map(medicines.map((m) => [m._id.toString(), m]));

        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const med = medicineMap.get(item.medicineId);
            if (!med) {
                return res
                    .status(400)
                    .json({ message: `Medicine not found: ${item.medicineId}` });
            }
            if (med.stock < item.quantity) {
                return res
                    .status(400)
                    .json({ message: `Insufficient stock for ${med.name}` });
            }

            const lineTotal = med.price * item.quantity;
            subtotal += lineTotal;

            orderItems.push({
                medicine: med._id,
                name: med.name,
                price: med.price,
                quantity: item.quantity,
            });

            // reduce stock
            med.stock -= item.quantity;
            await med.save();
        }

        const tax = subtotal * 0.18;
        const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
        const total = subtotal + tax + deliveryFee;

        const order = await Order.create({
            items: orderItems,
            subtotal,
            tax,
            deliveryFee,
            total,
            customer,
            paymentMethod,
            prescriptionId: prescriptionId || undefined,
        });

        // Send email receipt
        if (customer && customer.email) {
            await sendOrderReceipt(order, customer.email);
        }

        res.status(201).json(order);
    } catch (err) {
        console.error("Error creating order:", err);
        res
            .status(400)
            .json({ message: "Failed to create order", error: err.message });
    }
});

// GET /api/orders/:id - get single order
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.medicine")
            .populate("prescriptionId");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
});

export default router;
