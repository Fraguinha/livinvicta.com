import { Router } from "express";
import Contact from "../models/contact.js";

const router = Router();

router.post("/", async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const contact = await Contact.create({ firstName, lastName, email, phone, message });
        return res.status(200).json({ success: true, contact });
    } catch (err) {
        console.error("Error saving contact:", err);
        return res.status(500).json({ error: "Failed to save contact." });
    }
});

export default router;
