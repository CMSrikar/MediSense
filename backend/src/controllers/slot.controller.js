import Slot from "../models/Slot.model.js";

export const getSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Missing doctorId or date" });
    }

    // 1. Check existing slots
    let slots = await Slot.find({
      doctorId,
      date
    });

    // 2. If NO slots exist, auto-generate them (Morning, Afternoon, Evening)
    if (slots.length === 0) {
      const defaultSlots = [
        { time: "Morning", period: "Morning", isBooked: false },
        { time: "Afternoon", period: "Afternoon", isBooked: false },
        { time: "Evening", period: "Evening", isBooked: false }
      ];

      const newSlots = defaultSlots.map(s => ({
        ...s,
        doctorId,
        date
      }));

      slots = await Slot.insertMany(newSlots);
    }

    res.json(slots);
  } catch (error) {
    console.error("Get Slots Error:", error);
    res.status(500).json({ message: "Server error fetching slots" });
  }
};