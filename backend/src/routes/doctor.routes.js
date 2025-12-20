import express from "express";
import { getNearbyDoctors } from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/nearby", getNearbyDoctors);

export default router;