import mongoose from "mongoose";
import User from "../dist/models/user.js";

const DATABASE = process.env.DATABASE || "mongodb://mongo:27017/livinvicta";

async function ensureAdmin() {
    const email = "fatima@livinvicta.com";
    // const password = await bcrypt.hash("password", 10);
    const password = "$2b$10$1310e2r4H4tRlue6kamCSuq/nOnwFE9x6JUP.C3JLBKCJaFvYDMcW"
    const user = await User.findOne({ email });
    if (!user) {
        await User.create({ email, password, role: "admin" });
        console.log("Admin user created.");
    } else {
        await User.updateOne({ email }, { password, role: "admin" });
        console.log("Admin user password updated.");
    }
}

async function main() {
    await mongoose.connect(DATABASE);
    await ensureAdmin();
    console.log("Production database ensured.");
    await mongoose.disconnect();
}

main().catch(err => {
    console.error("Production database setup failed:", err);
    process.exit(1);
});
