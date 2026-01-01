import express from "express";
import TestBooking from "../models/TestBooking.js";
import { sendTestBookingReceipt } from "../utils/labEmailService.js";

const router = express.Router();

// POST /api/test-bookings - create a new test booking
router.post("/", async (req, res) => {
    try {
        const {
            patientName,
            email,
            phone,
            age,
            gender,
            labId,      // New
            labName,    // New
            tests,
            preferredDate,
            timeSlot,
            address,
            notes,
        } = req.body;

        if (!patientName || !phone || !preferredDate || !timeSlot || !address || !labId) {
            return res.status(400).json({
                message: "patientName, phone, preferredDate, timeSlot, address and labId are required",
            });
        }

        if (!tests || !Array.isArray(tests) || tests.length === 0) {
            return res.status(400).json({
                message: "At least one test must be selected",
            });
        }

        const booking = await TestBooking.create({
            patientName,
            email,
            phone,
            age,
            gender,
            labId,
            labName,
            tests,
            preferredDate,
            timeSlot,
            address,
            notes,
        });
        await sendTestBookingReceipt(booking);

        return res.status(201).json(booking);
    } catch (error) {
        console.error("Error creating test booking:", error);
        return res
            .status(500)
            .json({ message: "Failed to create test booking", error: error.message });
    }
});

// GET /api/test-bookings/:id - get a single test booking
router.get("/:id", async (req, res) => {
    try {
        const booking = await TestBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Test booking not found" });
        }
        return res.json(booking);
    } catch (error) {
        console.error("Error fetching test booking:", error);
        return res
            .status(500)
            .json({ message: "Failed to fetch test booking", error: error.message });
    }
});

export default router;
