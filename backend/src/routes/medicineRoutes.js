import express from "express";
import Medicine from "../models/Medicine.js";

const router = express.Router();

// GET /api/medicines - list all medicines
router.get("/", async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }

        const medicines = await Medicine.find(filter).sort({ name: 1 });
        res.json(medicines);
    } catch (err) {
        console.error("Error fetching medicines:", err);
        res.status(500).json({ message: "Failed to fetch medicines" });
    }
});

// GET /api/medicines/:id - get single medicine
router.get("/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine || !medicine.isActive) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.json(medicine);
    } catch (err) {
        console.error("Error fetching medicine:", err);
        res.status(500).json({ message: "Failed to fetch medicine" });
    }
});

// POST /api/medicines - create new medicine
router.post("/", async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(201).json(medicine);
    } catch (err) {
        console.error("Error creating medicine:", err);
        res
            .status(400)
            .json({ message: "Failed to create medicine", error: err.message });
    }
});

// PUT /api/medicines/:id - update medicine
router.put("/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.json(medicine);
    } catch (err) {
        console.error("Error updating medicine:", err);
        res
            .status(400)
            .json({ message: "Failed to update medicine", error: err.message });
    }
});

// DELETE /api/medicines/:id - soft delete (mark inactive)
router.delete("/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true },
        );
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.json({ message: "Medicine deactivated", medicine });
    } catch (err) {
        console.error("Error deleting medicine:", err);
        res.status(500).json({ message: "Failed to delete medicine" });
    }
});

export default router;
