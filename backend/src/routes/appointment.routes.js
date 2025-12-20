import express from "express";
import { createAppointment, approveAppointment, rejectAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/:id/approve", approveAppointment);
router.get("/:id/reject", rejectAppointment);

export default router;