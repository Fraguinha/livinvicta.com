import express from 'express';
import Category from '../models/category.js';

const router = express.Router()

router.post("/categories", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories.map(cat => cat.name));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

export default router
