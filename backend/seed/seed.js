require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const JobRequest = require("../models/JobRequest");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/service-board";

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs urgent fix",
    description:
      "The kitchen tap has been dripping for a week and the pressure seems to be getting worse. Looking for someone to replace the washer or the whole tap if necessary.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Margaret Thomson",
    contactEmail: "margaret.thomson@email.com",
    status: "Open",
  },
  {
    title: "Garden shed rewiring required",
    description:
      "Need a qualified electrician to run a new circuit to my garden shed. Require 2 double sockets and a light fitting. Consumer unit is in the garage 15m away.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "David McAllister",
    contactEmail: "david.mcallister@email.com",
    status: "In Progress",
  },
  {
    title: "Full interior repaint - 3 bedroom flat",
    description:
      "Looking for a painter to repaint all rooms in a 3 bed flat in neutral tones. Ceilings, walls and woodwork. Flat is currently empty so easy access.",
    category: "Painting",
    location: "Aberdeen",
    contactName: "Fiona Campbell",
    contactEmail: "fiona.campbell@email.com",
    status: "Open",
  },
  {
    title: "Bespoke fitted wardrobe in master bedroom",
    description:
      "Require a joiner to build and install a fitted wardrobe with sliding doors across one wall (approx 3.2m wide). Looking for oak veneer finish.",
    category: "Joinery",
    location: "Dundee",
    contactName: "James Robertson",
    contactEmail: "james.robertson@email.com",
    status: "Open",
  },
  {
    title: "Bathroom radiator not heating up",
    description:
      "The bathroom towel radiator is cold at the top and lukewarm at the bottom. Likely needs bleeding or a new valve. Small bathroom so quick job for the right person.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Susan Mackay",
    contactEmail: "susan.mackay@email.com",
    status: "Closed",
  },
  {
    title: "Install outdoor security lighting",
    description:
      "Need 3 PIR security lights installed at the front, side, and back of the house. Existing external power point available at the rear. Looking for evening availability.",
    category: "Electrical",
    location: "Stirling",
    contactName: "Alan Ferguson",
    contactEmail: "alan.ferguson@email.com",
    status: "Open",
  },
  {
    title: "Fence panels replaced after storm damage",
    description:
      "Storm took out 4 panels of my fence along the back garden. Need like-for-like replacement with featherboard panels approx 1.8m high. Will supply materials if needed.",
    category: "Joinery",
    location: "Perth",
    contactName: "Carol Stewart",
    contactEmail: "carol.stewart@email.com",
    status: "Open",
  },
  {
    title: "External walls painted before winter",
    description:
      "Two-storey semi-detached, rendered exterior needs a full coat of masonry paint. Currently magnolia, happy to stay the same. Scaffolding will be needed for the upstairs gable.",
    category: "Painting",
    location: "Inverness",
    contactName: "Robert Grant",
    contactEmail: "robert.grant@email.com",
    status: "In Progress",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await JobRequest.deleteMany({});
    console.log("🗑️  Cleared existing jobs");

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Seeded ${inserted.length} sample jobs`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected. Seed complete.");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
