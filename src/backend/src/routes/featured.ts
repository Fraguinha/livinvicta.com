import express from 'express';
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

router.post("/featured-projects", async (req, res) => {
    try {
        const featuredProjects = await Project.find({ featured: true });
        res.json(featuredProjects.map(projectToClient));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch featured projects" });
    }
});

export default router
