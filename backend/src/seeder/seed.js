import Hospital from "../models/Hospital.model.js";
import Doctor from "../models/Doctor.model.js";

const seedData = async () => {
  try {
    // 1. Clear existing data
    await Hospital.deleteMany();
    await Doctor.deleteMany();
    console.log("🧹 Cleared existing Hospital and Doctor data");

    // 2. Seed Hospitals
    const hospitals = await Hospital.insertMany([
      {
        name: "Sri Aditya Multi Speciality Hospital",
        city: "bhimavaram",
        email: "contact@sriaditya.com",
        location: { lat: 16.5449, lng: 81.5212 } // Center-isch
      },
      {
        name: "Anjali Hospital",
        city: "bhimavaram",
        email: "info@anjalihospital.in",
        location: { lat: 16.5465, lng: 81.5230 } // North East
      },
      {
        name: "Vijaya Super Speciality Hospital",
        city: "bhimavaram",
        email: "helpdesk@vijayahospital.com",
        location: { lat: 16.5432, lng: 81.5195 } // South West
      },
      {
        name: "Government Area Hospital",
        city: "bhimavaram",
        email: "admin@govtfh-bmy.org",
        location: { lat: 16.5478, lng: 81.5201 } // North
      },
      {
        name: "Sree Ramadevi Neuro Hospital",
        city: "bhimavaram",
        email: "enquiry@ramadevineuro.com",
        location: { lat: 16.5420, lng: 81.5188 } // South West
      }
    ]);
    console.log(`🏥 Seeded ${hospitals.length} Hospitals`);

    // Helper to find hospital by name substring
    const findHosp = (name) => hospitals.find(h => h.name.includes(name))._id;

    // 3. Seed Doctors
    const doctors = await Doctor.insertMany([
      // General Physicians (Fever)
      {
        name: "Dr. K. Suryanarayana",
        specialization: "General Physician",
        hospitalId: findHosp("Sri Aditya"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 15,
        fees: 500,
        rating: 4.8
      },
      {
        name: "Dr. P. Venkat Rao",
        specialization: "General Physician",
        hospitalId: findHosp("Government"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 20,
        fees: 200,
        rating: 4.2
      },

      // Dermatologist (Skin)
      {
        name: "Dr. L. Swathi",
        specialization: "Dermatologist",
        hospitalId: findHosp("Anjali"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 8,
        fees: 600,
        rating: 4.9
      },

      // Neurologist (Headache)
      {
        name: "Dr. R. Murthy",
        specialization: "Neurologist",
        hospitalId: findHosp("Ramadevi"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 25,
        fees: 1000,
        rating: 4.7
      },

      // Gastroenterologist (Stomach)
      {
        name: "Dr. B. Subba Rao",
        specialization: "Gastroenterologist",
        hospitalId: findHosp("Sri Aditya"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 12,
        fees: 700,
        rating: 4.6
      },

      // Orthopedist (Back pain)
      {
        name: "Dr. V. Satyanarayana",
        specialization: "Orthopedist",
        hospitalId: findHosp("Vijaya"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 18,
        fees: 800,
        rating: 4.5
      },

      // Psychiatrist (Anxiety)
      {
        name: "Dr. M. Kavitha",
        specialization: "Psychiatrist",
        hospitalId: findHosp("Ramadevi"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 10,
        fees: 900,
        rating: 4.8
      },

      // Ophthalmologist (Eye)
      {
        name: "Dr. S. Ravi Kumar",
        specialization: "Ophthalmologist",
        hospitalId: findHosp("Anjali"),
        city: "bhimavaram",
        email: "keerthikaduddupudi@gmail.com",
        experience: 14,
        fees: 400,
        rating: 4.4
      }
    ]);

    console.log(`👨‍⚕️ Seeded ${doctors.length} Doctors`);
    return { hospitals, doctors };

  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

export default seedData;