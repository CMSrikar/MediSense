import Lab from "../models/Lab.js";

const getRandomTests = (type) => {
    const pathologyTests = [
        { code: "CBC", name: "Complete Blood Count (Blood Test)", price: 400, category: "Basic Health" },
        { code: "FBS", name: "Sugar Test (Fasting)", price: 200, category: "Diabetes" },
        { code: "PPBS", name: "Sugar Test (Post-Meal)", price: 200, category: "Diabetes" },
        { code: "HBA1C", name: "3-Month Sugar Average (HbA1c)", price: 600, category: "Diabetes" },
        { code: "LIPID", name: "Cholesterol & Heart Test", price: 800, category: "Heart Health" },
        { code: "TSH", name: "Thyroid Test (TSH)", price: 350, category: "Thyroid" },
        { code: "LFT", name: "Liver Health Test", price: 700, category: "Liver & Kidney" },
        { code: "KFT", name: "Kidney Health Test", price: 800, category: "Liver & Kidney" },
        { code: "CALCIUM", name: "Calcium Test", price: 250, category: "Vitamins" },
        { code: "VITD", name: "Vitamin D Test", price: 1200, category: "Vitamins" },
        { code: "VITB12", name: "Vitamin B12 Test", price: 800, category: "Vitamins" },
        { code: "IRON", name: "Iron Deficiency Test", price: 550, category: "Iron Study" },
        { code: "DENGUE", name: "Dengue Fever Test", price: 1000, category: "Fever Package" },
        { code: "TYPHOID", name: "Typhoid Test", price: 400, category: "Fever Package" },
        { code: "URINE", name: "Urine Infection Test", price: 300, category: "Infection" },
    ];
    const radiologyTests = [
        { code: "XRAY-CHEST", name: "X-Ray Chest PA View", price: 500, category: "X-Ray" },
        { code: "ECG", name: "Heart Rate Graph (ECG)", price: 400, category: "Heart Health" },
        { code: "USG-ABDO", name: "Ultrasound Abdomen (Stomach)", price: 1200, category: "Ultrasound" },
        { code: "CT-BRAIN", name: "CT Scan Brain", price: 2500, category: "CT Scan" },
        { code: "MRI-KNEE", name: "MRI Knee", price: 4500, category: "MRI" },
    ];

    let available = [];
    const lowerType = type ? type.toLowerCase() : "";

    if (lowerType.includes("scan") || lowerType.includes("imaging")) {
        available = [...available, ...radiologyTests];
    }
    if (lowerType.includes("pathology") || lowerType.includes("lab") || lowerType.includes("diagnostic")) {
        available = [...available, ...pathologyTests];
    }
    // distinct default
    if (available.length === 0) available = [...pathologyTests];

    // Pick random subset
    return available.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
};

const customLabs = [
    // --- Palakollu (4 Labs) ---
    { name: "Sri Vijaya Diagnostic Centre", city: "Palakollu", district: "West Godavari", type: "Diagnostic Lab" },
    { name: "Krishna Diagnostics", city: "Palakollu", district: "West Godavari", type: "Pathology" },
    { name: "Dr Lal PathLabs", city: "Palakollu", district: "West Godavari", type: "Pathology" },
    { name: "MedPlus Pathlabs", city: "Palakollu", district: "West Godavari", type: "Pathology (Home Collection)" },

    // --- Bhimavaram (4 Labs) ---
    { name: "Lotus Diagnostics", city: "Bhimavaram", district: "West Godavari", type: "Diagnostic Lab" },
    { name: "Apollo Diagnostics", city: "Bhimavaram", district: "West Godavari", type: "Pathology & Imaging" },
    { name: "SRL Diagnostics", city: "Bhimavaram", district: "West Godavari", type: "Pathology" },
    { name: "Bhimavaram Scans & Labs", city: "Bhimavaram", district: "West Godavari", type: "Scan & Diagnostics" },

    // --- Eluru (4 Labs) ---
    { name: "Royal Hospital Diagnostic Centre", city: "Eluru", district: "West Godavari", type: "Hospital Diagnostics" },
    { name: "Ravi Scan Center", city: "Eluru", district: "West Godavari", type: "Scan & Diagnostics" },
    { name: "Shilpa Scan & Diagnostic Centre", city: "Eluru", district: "West Godavari", type: "Scan & Lab" },
    { name: "Eluru City Diagnostics", city: "Eluru", district: "West Godavari", type: "Diagnostic Lab" },

    // --- Narsapuram (4 Labs) ---
    { name: "Godavari Diagnostics", city: "Narsapuram", district: "West Godavari", type: "Diagnostic Lab" },
    { name: "Narsapuram X-Ray & Path", city: "Narsapuram", district: "West Godavari", type: "Radiology" },
    { name: "Thyrocare Aarogyam Centre", city: "Narsapuram", district: "West Godavari", type: "Pathology (Home Collection)" },
    { name: "Pathkind Labs", city: "Narsapuram", district: "West Godavari", type: "Pathology" }
];

export const seedLabs = async () => {
    try {
        // FORCE UPDATE: Clear existing labs to ensure new custom data is loaded
        // await Lab.deleteMany({}); // Commented out to prevent accidental deletion on every restart if not intended. 
        // User's original code did this. But for production/merge, maybe only if empty?

        const labCount = await Lab.countDocuments();
        if (labCount === 0) {
            console.log("🧹 Seeding Labs...");
            // await Lab.deleteMany({}); // Ensure clean slate if we are seeding

            const seedData = customLabs.map(lab => ({
                name: lab.name,
                city: lab.city.toLowerCase(),
                address: `${lab.city}, ${lab.district}`, // Constructed address
                rating: (4.0 + Math.random()).toFixed(1),
                tests: getRandomTests(lab.type)
            }));

            await Lab.insertMany(seedData);
            console.log("✅ Seeded custom labs data");
        }
    } catch (err) {
        console.error("❌ Error seeding data:", err.message);
    }
};
