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
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const {
            id, title, description, category,
            features, client, budget, duration, featured
        } = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const beforeImageFile = files?.['beforeImage']?.[0];
        const afterImageFile = files?.['afterImage']?.[0];
        const galleryFiles = files?.['galleryImages'] || [];

        if (!id
            || !title
            || !description
            || !category
            || !features
            || !client
            || !budget
            || !duration
            || featured === undefined
            || !beforeImageFile
            || !afterImageFile
            || !galleryFiles.length) {
            return res.status(400).json({ error: "Missing required project fields" });
        }

        const beforeImage = {
            data: beforeImageFile.buffer,
            contentType: beforeImageFile.mimetype
        };
        const afterImage = {
            data: afterImageFile.buffer,
            contentType: afterImageFile.mimetype
        };
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
            client,
            budget,
            duration,
            featured: featured === "true" || featured === true
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: "Failed to create project" });
    }
});

export default router
