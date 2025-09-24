import express from "express";
import { getAllSlots, addSlot, bookSlot, freeSlot, updateSlotFromML } from "../controllers/parkingController.js";

const router = express.Router();

router.get("/", getAllSlots);      // GET all slots
router.post("/", addSlot);         // Add new slot
router.post("/book", bookSlot);    // Book a slot
router.post("/free", freeSlot);    // Free a slot
router.post("/ml-update", updateSlotFromML);  // Update slot based on ML detection

export default router;
