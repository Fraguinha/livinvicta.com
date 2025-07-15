import express from 'express';
import authenticator from '../middlewares/authentication.js';
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

router.post("/categories/create", authenticator, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Category name required" });
        const existing = await Category.findOne({ name });
        if (existing) return res.status(409).json({ error: "Category already exists" });
        const category = await Category.create({ name });
        res.status(201).json({ success: true, name: category.name });
    } catch (err) {
        res.status(500).json({ error: "Failed to create category" });
    }
});

router.post("/categories/update", authenticator, async (req, res) => {
    try {
        const { oldName, newName } = req.body;
        if (!oldName || !newName) return res.status(400).json({ error: "Both old and new category names required" });
        const existing = await Category.findOne({ name: oldName });
        if (!existing) return res.status(404).json({ error: "Category not found" });
        if (oldName === newName) return res.status(400).json({ error: "New name must be different" });
        const duplicate = await Category.findOne({ name: newName });
        if (duplicate) return res.status(409).json({ error: "Category with new name already exists" });
        existing.name = newName;
        await existing.save();
        res.status(200).json({ success: true, name: newName });
    } catch (err) {
        res.status(500).json({ error: "Failed to update category" });
    }
});

router.post("/categories/delete", authenticator, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Category name required" });
        const deleted = await Category.findOneAndDelete({ name });
        if (!deleted) return res.status(404).json({ error: "Category not found" });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete category" });
    }
});

export default router
