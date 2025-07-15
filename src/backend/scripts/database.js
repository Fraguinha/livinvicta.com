import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Category from "../dist/models/category.js";
import Project from "../dist/models/project.js";
import User from "../dist/models/user.js";

const DATABASE = process.env.DATABASE || "mongodb://mongo:27017/livinvicta";

async function seed() {
    await mongoose.connect(DATABASE);

    // Clear existing data
    await Category.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});

    // Seed categories
    await Category.insertMany([
        { name: "Kitchen" },
        { name: "Bathroom" },
        { name: "Living Room" },
    ]);

    // Seed projects
    await Project.create({
        id: "kitchen-1",
        title: "Modern Kitchen Renovation",
        description: "Transform your kitchen into a modern culinary masterpiece with custom cabinets, premium countertops, and state-of-the-art appliances.",
        category: "Kitchen",
        beforeImage: { data: Buffer.from([0]), contentType: "image/jpeg" },
        afterImage: { data: Buffer.from([0]), contentType: "image/jpeg" },
        gallery: [],
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
    });

    // Seed user
    await User.create({
        email: "admin@example.com",
        password: await bcrypt.hash("admin", 10),
    });

    console.log("Database seeded!");
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
