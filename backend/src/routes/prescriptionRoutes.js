import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import Prescription from "../models/Prescription.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads", "prescriptions");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG and PDF files are allowed"));
        }
        cb(null, true);
    },
});

// POST /api/prescriptions - upload prescription
router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Prescription file is required" });
        }

        const { patientName, notes } = req.body;

        if (!patientName) {
            return res.status(400).json({ message: "Patient name is required" });
        }

        const prescription = await Prescription.create({
            patientName,
            notes,
            filePath: req.file.path,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
        });

        res.status(201).json(prescription);
    } catch (err) {
        console.error("Error uploading prescription:", err);
        res
            .status(400)
            .json({ message: "Failed to upload prescription", error: err.message });
    }
});

// GET /api/prescriptions/:id - get prescription metadata
router.get("/:id", async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        res.json(prescription);
    } catch (err) {
        console.error("Error fetching prescription:", err);
        res.status(500).json({ message: "Failed to fetch prescription" });
    }
});

export default router;
