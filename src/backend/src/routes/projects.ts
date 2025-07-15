import express from 'express';
import authenticator from '../middlewares/authentication.js';
import uploader from '../middlewares/uploader.js';
import Project from '../models/project.js';

const router = express.Router()

function projectToClient(project: any) {
    return {
        ...project.toObject(),
        beforeImage: `/api/projects/${project.id}/before-image`,
        afterImage: `/api/projects/${project.id}/after-image`,
        gallery: project.gallery.map((_: any, idx: number) => `/api/projects/${project.id}/gallery/${idx}`),
    };
}

router.get('/projects/:id/before-image', async (req, res) => {
    const project = await Project.findOne({ id: req.params.id });
    if (!project || !project.beforeImage?.data) return res.status(404).end();
    res.contentType(project.beforeImage.contentType);
    res.send(project.beforeImage.data);
});

router.get('/projects/:id/after-image', async (req, res) => {
    const project = await Project.findOne({ id: req.params.id });
    if (!project || !project.afterImage?.data) return res.status(404).end();
    res.contentType(project.afterImage.contentType);
    res.send(project.afterImage.data);
});


router.get('/projects/:id/gallery/:index', async (req, res) => {
    const project = await Project.findOne({ id: req.params.id });
    const idx = parseInt(req.params.index, 10);
    if (!project || !project.gallery?.[idx]) return res.status(404).end();
    res.contentType(project.gallery[idx].contentType);
    res.send(project.gallery[idx].data);
});

router.post("/projects", async (req, res) => {
    const { category } = req.body || {};
    try {
        let query = {};
        if (category && category !== "All") {
            query = { category };
        }
        const projects = await Project.find(query);
        res.json(projects.map(projectToClient));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

router.post("/project-detail", async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "Missing project id" });
    }
    try {
        const project = await Project.findOne({ id });
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(projectToClient(project));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch project" });
    }
});

router.post("/projects/create", authenticator, uploader.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 50 }
]), async (req, res) => {
    try {
        const {
            id, title, description, category,
            features, location, price, availability, featured
        } = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const beforeImageFile = files?.['beforeImage']?.[0];
        const afterImageFile = files?.['afterImage']?.[0];
        const galleryFiles = files?.['galleryImages'] || [];

        const hasBefore = !!beforeImageFile;
        const hasAfter = !!afterImageFile;
        if ((hasBefore && !hasAfter) || (!hasBefore && hasAfter)) {
            return res.status(400).json({ error: "Both before and after images must be provided together, or neither." });
        }

        if (!id
            || !title
            || !description
            || !category
            || !features
            || !location
            || !price
            || !availability
            || featured === undefined
            || !galleryFiles.length) {
            return res.status(400).json({ error: "Missing required project fields" });
        }

        const beforeImage = hasBefore ? {
            data: beforeImageFile.buffer,
            contentType: beforeImageFile.mimetype
        } : undefined;
        const afterImage = hasAfter ? {
            data: afterImageFile.buffer,
            contentType: afterImageFile.mimetype
        } : undefined;
        const gallery = galleryFiles.map((file: Express.Multer.File) => ({
            data: file.buffer,
            contentType: file.mimetype
        }));

        const featuresArray = Array.isArray(features) ? features : [features];

        const newProject = new Project({
            id,
            title,
            description,
            category,
            beforeImage,
            afterImage,
            gallery,
            features: featuresArray,
            location,
            price,
            availability,
            featured: featured === "true" || featured === true
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: "Failed to create project" });
    }
});

router.put('/projects/:id', authenticator, uploader.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 50 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (files?.beforeImage?.[0]) {
            updateFields.beforeImage = {
                data: files.beforeImage[0].buffer,
                contentType: files.beforeImage[0].mimetype
            };
        }
        if (files?.afterImage?.[0]) {
            updateFields.afterImage = {
                data: files.afterImage[0].buffer,
                contentType: files.afterImage[0].mimetype
            };
        }
        if (files?.galleryImages) {
            updateFields.gallery = files.galleryImages.map(file => ({
                data: file.buffer,
                contentType: file.mimetype
            }));
        }
        if (updateFields.features && !Array.isArray(updateFields.features)) {
            updateFields.features = [updateFields.features];
        }
        if (typeof updateFields.featured === "string") {
            updateFields.featured = updateFields.featured === "true";
        }

        const hasBefore = !!files?.beforeImage?.[0];
        const hasAfter = !!files?.afterImage?.[0];
        if ((hasBefore && !hasAfter) || (!hasBefore && hasAfter)) {
            return res.status(400).json({ error: "Both before and after images must be provided together, or neither." });
        }

        const updated = await Project.findOneAndUpdate({ id }, updateFields, { new: true });
        if (!updated) return res.status(404).json({ error: "Project not found" });
        res.json(projectToClient(updated));
    } catch (err) {
        res.status(500).json({ error: "Failed to update project" });
    }
});

router.delete('/projects/:id', authenticator, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Project.findOneAndDelete({ id });
        if (!deleted) return res.status(404).json({ error: "Project not found" });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

export default router
