import dotenv from "dotenv";
import connectDB from "../config/db.js"; // Adjust path if needed
import seedData from "./seed.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const runSeeder = async () => {
    try {
        await connectDB();
        console.log("✅ DB Connected. Starting Seed...");

        await seedData();

        console.log("✅ Seeding Complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Failed:", error);
        process.exit(1);
    }
};

runSeeder();