import cors from "cors";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const categories = [
    "Kitchen",
    "Bathroom",
    "Living Room",
    "Bedroom",
    "Office",
    "Outdoor"
];

const projects = [
    {
        id: "kitchen-1",
        title: "Modern Kitchen Renovation",
        description: "Transform your kitchen into a modern culinary masterpiece with custom cabinets, premium countertops, and state-of-the-art appliances.",
        category: "Kitchen",
        beforeImage: "/images/kitchen-before.jpg",
        afterImage: "/images/kitchen-after.jpg",
        gallery: [
            "/images/kitchen-1-1.jpg",
            "/images/kitchen-1-2.jpg",
            "/images/kitchen-1-3.jpg"
        ],
        features: [
            "Custom cabinets",
            "Quartz countertops",
            "Energy-efficient appliances",
            "LED lighting",
            "Open floor plan"
        ],
        client: "Jane Doe",
        budget: "100,000 €",
        duration: "6 weeks",
        featured: true,
    },
    {
        id: "bathroom-1",
        title: "Luxury Bathroom Remodel",
        description: "Create your dream bathroom with luxury finishes, modern fixtures, and spa-like amenities for the ultimate relaxation experience.",
        category: "Bathroom",
        beforeImage: "/images/bathroom-before.jpg",
        afterImage: "/images/bathroom-after.jpg",
        gallery: [
            "/images/bathroom-1-1.jpg",
            "/images/bathroom-1-2.jpg"
        ],
        features: [
            "Rainfall shower",
            "Heated floors",
            "Double vanity",
            "Freestanding tub",
            "Smart mirror"
        ],
        client: "John Smith",
        budget: "70,000 €",
        duration: "4 weeks",
        featured: true,
    },
    {
        id: "living-1",
        title: "Open Living Space Design",
        description: "Redesign your living areas with open concepts, built-in storage, and contemporary styling that reflects your lifestyle.",
        category: "Living Room",
        beforeImage: "/images/living-before.jpg",
        afterImage: "/images/living-after.jpg",
        gallery: [
            "/images/living-1-1.jpg",
            "/images/living-1-2.jpg"
        ],
        features: [
            "Built-in shelving",
            "Hardwood flooring",
            "Accent wall",
            "Recessed lighting",
            "Large windows"
        ],
        client: "Alice Johnson",
        budget: "80,000 €",
        duration: "5 weeks",
        featured: true,
    }
];

const featuredProjects = projects.filter(p => p.featured);

app.post("/api/featured-projects", (req, res) => {
    res.json(featuredProjects);
});

app.post("/api/projects", (req, res) => {
    const { category } = req.body || {};
    if (!category || category === "All") {
        return res.json(projects);
    }
    return res.json(projects.filter(p => p.category === category));
});

app.post("/api/projects/create", (req, res) => {
    const newProject = req.body;
    if (!newProject
        || !newProject.id
        || !newProject.title
        || !newProject.description
        || !newProject.category
        || !newProject.beforeImage
        || !newProject.afterImage
        || !newProject.gallery
        || !newProject.features
        || !newProject.client
        || !newProject.budget
        || !newProject.duration
        || newProject.featured === undefined) {
        return res.status(400).json({ error: "Missing required project fields" });
    }
    projects.push(newProject);
    res.status(201).json(newProject);
});

app.post("/api/project-detail", (req, res) => {
    const { id } = req.body;
    const project = projects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
});

app.post("/api/categories", (req, res) => {
    res.json(categories);
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use("/images", express.static(join(__dirname, "images")));

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
