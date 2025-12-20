import express from "express";
import { getSlots } from "../controllers/slot.controller.js";

const router = express.Router();

router.get("/", getSlots);

export default router;