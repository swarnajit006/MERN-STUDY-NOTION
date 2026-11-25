/**
 * Seed script: populates the Category collection with default categories.
 * Safe to run multiple times -- uses findOneAndUpdate with upsert so no
 * duplicate categories are created even if you run this repeatedly.
 *
 * Usage (run from the SERVER directory):
 *   node scripts/seedCategories.js
 */

const path = require("path");
const dotenv = require("dotenv");
// Load SERVER/.env first, then root .env as fallback
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Category = require("../models/Category");

const CATEGORIES = [
  {
    name: "Web Development",
    description:
      "Learn to build modern websites and web applications using HTML, CSS, JavaScript and popular frameworks.",
  },
  {
    name: "Mobile Development",
    description:
      "Build native and cross-platform mobile apps for iOS and Android.",
  },
  {
    name: "Data Science and Machine Learning",
    description:
      "Master data analysis, machine learning, and AI with Python and popular libraries.",
  },
  {
    name: "Cloud Computing",
    description:
      "Learn cloud platforms (AWS, Azure, GCP) and DevOps practices.",
  },
  {
    name: "Cybersecurity",
    description:
      "Understand how to protect systems, networks, and programs from digital attacks.",
  },
  {
    name: "Database Management",
    description:
      "Learn SQL, NoSQL, and database design principles to manage data effectively.",
  },
  {
    name: "Programming Languages",
    description:
      "Learn programming fundamentals and specific languages like Python, Java, C++, Go and more.",
  },
  {
    name: "UI/UX Design",
    description:
      "Design beautiful, user-friendly interfaces and improve user experience.",
  },
  {
    name: "Business and Entrepreneurship",
    description:
      "Learn business strategy, marketing, finance, and how to start and grow a company.",
  },
  {
    name: "Personal Development",
    description:
      "Improve productivity, communication skills, and achieve your personal goals.",
  },
];

async function seed() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URL;
  if (!uri) {
    console.error(
      "ERROR: No MongoDB URI found. Set MONGO_URI in SERVER/.env and restart."
    );
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  for (const cat of CATEGORIES) {
    const existing = await Category.findOne({ name: cat.name });
    if (existing) {
      console.log("  SKIP (already exists):", cat.name);
    } else {
      await Category.create(cat);
      console.log("  CREATED:", cat.name);
    }
  }

  const total = await Category.countDocuments();
  console.log("\nDone. Total categories in DB:", total);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
