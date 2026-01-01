import express from "express";
import Lab from "../models/Lab.js";

const router = express.Router();

// Helper to get random tests for mocked data
const getRandomTests = () => {
    const allTests = [
        { code: "CBC", name: "Complete Blood Count", price: 500, category: "Pathology" },
        { code: "LFT", name: "Liver Function Test", price: 800, category: "Pathology" },
        { code: "FBS", name: "Fasting Blood Sugar", price: 250, category: "Diabetes" },
        { code: "HBA1C", name: "HbA1c", price: 600, category: "Diabetes" },
        { code: "LIPID", name: "Lipid Profile", price: 900, category: "Cardiac" },
        { code: "FULLBODY", name: "Full Body Checkup", price: 2999, category: "Package" },
        { code: "XRAYCHEST", name: "X-Ray Chest", price: 600, category: "Radiology" },
        { code: "CTSCAN", name: "CT Scan Brain", price: 2500, category: "Radiology" }
    ];
    // specific logic to pick random 3-5 tests
    const count = Math.floor(Math.random() * 3) + 3;
    const shuffled = allTests.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// GET /api/labs?city=mumbai
router.get("/", async (req, res) => {
    try {
        const { city } = req.query;
        let query = {};

        if (city) {
            query.city = city.toLowerCase().trim();
        }

        const labs = await Lab.find(query);
        res.json(labs);
    } catch (err) {
        console.error("Error fetching labs:", err);
        res.status(500).json({ message: "Failed to fetch labs" });
    }
});

// GET /api/labs/:id
router.get("/:id", async (req, res) => {
    try {
        const lab = await Lab.findById(req.params.id);
        if (!lab) {
            return res.status(404).json({ message: "Lab not found" });
        }
        res.json(lab);
    } catch (err) {
        console.error("Error fetching lab:", err);
        res.status(500).json({ message: "Failed to fetch lab" });
    }
});

export default router;
