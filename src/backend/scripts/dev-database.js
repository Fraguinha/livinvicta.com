import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Category from "../dist/models/category.js";
import Project from "../dist/models/project.js";
import User from "../dist/models/user.js";

const DATABASE = process.env.DATABASE || "mongodb://mongo:27017/livinvicta";

async function createCategories() {
    const categories = ["Kitchen", "Bathroom", "Living Room"];
    for (const name of categories) {
        await Category.updateOne(
            { name },
            { $setOnInsert: { name } },
            { upsert: true }
        );
    }
}

async function createAdmin() {
    const admins = [
        { email: "admin@example.com", password: "admin" }
    ];

    for (const admin of admins) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await User.updateOne(
            { email: admin.email },
            {
                $setOnInsert: { email: admin.email },
                $set: { password: hashedPassword }
            },
            { upsert: true }
        );
    }
}

async function createProjects() {
    const projects = [
        {
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
            budget: "30,000 €",
            duration: "6 weeks",
            featured: true,
        }
    ];

    for (const project of projects) {
        await Project.updateOne(
            { id: project.id },
            { $setOnInsert: project },
            { upsert: true }
        );
    }
}

async function main() {
    await mongoose.connect(DATABASE);
    await createCategories();
    await createProjects();
    await createAdmin();
    console.log("Development database created");
    await mongoose.disconnect();
}

main().catch(err => {
    console.error("Development database creation failed:", err);
    process.exit(1);
});
