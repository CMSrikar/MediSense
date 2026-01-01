import Medicine from "../models/Medicine.js";

const medicines = [
    {
        name: "Paracetamol 500mg",
        description:
            "Pain reliever and fever reducer. Effective for headaches, muscle aches, and reducing fever.",
        price: 45,
        category: "Pain Relief",
        image: "uploads/medicines/Paracetamol 500mg.jpeg",
        stock: 150,
        requiresPrescription: false,
        manufacturer: "MediCare Pharma",
    },
    {
        name: "Ibuprofen 200mg",
        description:
            "Anti-inflammatory medication for pain, inflammation, and fever.",
        price: 89,
        category: "Pain Relief",
        image: "uploads/medicines/Ibuprofen 200mg.jpeg",
        stock: 120,
        requiresPrescription: false,
        manufacturer: "HealthCare Labs",
    },
    {
        name: "Amoxicillin 250mg",
        description:
            "Antibiotic used to treat various bacterial infections. Prescription required.",
        price: 250,
        category: "Antibiotics",
        image: "uploads/medicines/amoxicillin 250mg.webp",
        stock: 80,
        requiresPrescription: true,
        manufacturer: "BioPharm Inc",
    },
    {
        name: "Aspirin 100mg",
        description: "Blood thinner and pain reliever.",
        price: 55,
        category: "Cardiovascular",
        image: "uploads/medicines/Aspirin 100mg.jpeg",
        stock: 200,
        requiresPrescription: false,
        manufacturer: "CardioMed",
    },
    {
        name: "Omeprazole 20mg",
        description: "Used for acid reflux, heartburn, and stomach ulcers.",
        price: 180,
        category: "Digestive",
        image: "uploads/medicines/Omeprazole 20mg.jpeg",
        stock: 90,
        requiresPrescription: false,
        manufacturer: "Digestive Health Co",
    },
    {
        name: "Loratadine 10mg",
        description: "Antihistamine for allergy relief.",
        price: 95,
        category: "Allergy",
        image: "uploads/medicines/Loratadine 10mg.jpeg",
        stock: 140,
        requiresPrescription: false,
        manufacturer: "AllergyCare",
    },
    {
        name: "Metformin 500mg",
        description: "Diabetes medication to control blood sugar levels.",
        price: 320,
        category: "Diabetes",
        image: "uploads/medicines/Metformin 500mg.jpeg",
        stock: 75,
        requiresPrescription: true,
        manufacturer: "Diabetic Solutions",
    },
    {
        name: "Atorvastatin 20mg",
        description: "Cholesterol-lowering medication.",
        price: 280,
        category: "Cardiovascular",
        image: "uploads/medicines/Atorvastatin 20mg.jpeg",
        stock: 85,
        requiresPrescription: true,
        manufacturer: "CardioMed",
    },
    {
        name: "Cetirizine 10mg",
        description: "Fast-acting allergy relief.",
        price: 75,
        category: "Allergy",
        image: "uploads/medicines/Cetirizine 10mg.jpeg",
        stock: 160,
        requiresPrescription: false,
        manufacturer: "AllergyCare",
    },
    {
        name: "Calcium Carbonate",
        description: "Calcium supplement for bone health.",
        price: 120,
        category: "Supplements",
        image: "uploads/medicines/Calcium Carbonate.jpeg",
        stock: 180,
        requiresPrescription: false,
        manufacturer: "NutriHealth",
    },
    {
        name: "Vitamin D3 1000IU",
        description: "Vitamin D supplement for immunity and bone health.",
        price: 150,
        category: "Supplements",
        image: "uploads/medicines/Vitamin D3 1000IU.jpeg",
        stock: 200,
        requiresPrescription: false,
        manufacturer: "NutriHealth",
    },
    {
        name: "Azithromycin 250mg",
        description: "Broad-spectrum antibiotic.",
        price: 290,
        category: "Antibiotics",
        image: "uploads/medicines/Azithromycin 250mg.jpeg",
        stock: 70,
        requiresPrescription: true,
        manufacturer: "BioPharm Inc",
    },
];

export const seedMedicines = async () => {
    try {
        const count = await Medicine.countDocuments();
        if (count === 0) {
            console.log("💊 Seeding Medicines...");
            await Medicine.insertMany(medicines);
            console.log("✅ Medicines Seeded");
        }
    } catch (error) {
        console.error("❌ Error seeding medicines:", error);
    }
};
