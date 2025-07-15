import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Category from "../dist/models/category.js";
import Project from "../dist/models/project.js";
import User from "../dist/models/user.js";

const DATABASE = process.env.DATABASE || "mongodb://mongo:27017/livinvicta";

async function createCategories() {
    const categories = ["Apartment", "Suite", "Room", "Renovations"];
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
        { email: "admin@example.com", password: "admin", role: "admin" }
    ];

    for (const admin of admins) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await User.updateOne(
            { email: admin.email },
            {
                $setOnInsert: { email: admin.email },
                $set: { password: hashedPassword, role: admin.role }
            },
            { upsert: true }
        );
    }
}

async function createProjects() {
    const projects = [
        {
            id: "apartment-1",
            title: "Modern City Apartment",
            description: "A stylish apartment in the heart of Porto, featuring open living spaces, a balcony with city views, and modern amenities.",
            category: "Apartment",
            gallery: [],
            features: [
                "2 bedrooms",
                "1 bathroom",
                "Open kitchen/living area",
                "Balcony with city view",
                "Underground parking"
            ],
            location: "Porto, Portugal",
            price: "350,000 €",
            availability: "Available",
            featured: true,
        },
        {
            id: "suite-1",
            title: "Luxury Suite in Boutique Hotel",
            description: "An elegant suite with premium furnishings, spa bathroom, and access to exclusive hotel amenities in Lisbon.",
            category: "Suite",
            gallery: [],
            features: [
                "King-size bed",
                "Spa bathroom",
                "Private terrace",
                "Room service",
                "Access to pool & gym"
            ],
            location: "Lisbon, Portugal",
            price: "220 €/night",
            availability: "Booked",
            featured: true,
        },
        {
            id: "room-1",
            title: "Cozy Student Room",
            description: "A comfortable and affordable room ideal for students, close to the university and public transport in Braga.",
            category: "Room",
            gallery: [],
            features: [
                "Single bed",
                "Desk & chair",
                "Shared kitchen",
                "High-speed internet",
                "Laundry facilities"
            ],
            location: "Braga, Portugal",
            price: "350 €/month",
            availability: "Available",
            featured: true,
        },
        {
            id: "renovation-1",
            title: "Historic Townhouse Renovation",
            description: "Complete renovation of a historic townhouse in Coimbra, preserving original features while adding modern comforts.",
            category: "Renovations",
            beforeImage: { data: Buffer.from([0]), contentType: "image/jpeg" },
            afterImage: { data: Buffer.from([0]), contentType: "image/jpeg" },
            gallery: [],
            features: [
                "Restored facade",
                "Modern kitchen",
                "Energy-efficient windows",
                "Refinished hardwood floors",
                "Smart home system"
            ],
            location: "Coimbra, Portugal",
            price: "Contact for details",
            availability: "Available",
            featured: false,
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
