import Appointment from "../models/Appointment.model.js";
import Slot from "../models/Slot.model.js";
import Doctor from "../models/Doctor.model.js";
import sendEmail from "../services/email.service.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, consultationType, patient, symptoms } = req.body;

    const slot = await Slot.findById(slotId);

    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    slot.isBooked = true;
    await slot.save();

    // Handle patient data (frontend might send string or object)
    const patientData = typeof patient === 'string'
      ? { name: patient, email: 'Not Provided', phone: 'Not Provided' }
      : patient || { name: 'Guest User' };

    const appointment = await Appointment.create({
      doctorId,
      slotId,
      consultationType,
      patient: patientData,
      symptoms,
      meetLink:
        consultationType === "video"
          ? `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`
          : null
    });

    // --- EMAIL NOTIFICATION LOGIC ---
    try {
      // Fetch Doctor and Hospital details
      const doctor = await Doctor.findById(doctorId).populate("hospitalId");

      if (doctor) {
        // Prioritize Doctor's email, then Hospital's
        const targetEmail = doctor.email || (doctor.hospitalId && doctor.hospitalId.email);

        if (targetEmail) {
          const subject = `New Appointment Request: ${patientData.name}`;
          const host = req.get('host');
          const protocol = req.protocol;
          // Use machine IP for mobile access
          // Use dynamic host or env config
          const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

          const approveLink = `${baseUrl}/api/appointments/${appointment._id}/approve`;
          const rejectLink = `${baseUrl}/api/appointments/${appointment._id}/reject`;

          const message = `
          New Appointment Booking
          =======================
          
          Doctor: Dr. ${doctor.name}
          Specialization: ${doctor.specialization}
          
          Patient Details:
          Name: ${patientData.name}
          Email: ${patientData.email || 'N/A'}
          Phone: ${patientData.phone || 'N/A'}
          
          Appointment Details:
          Date: ${new Date(slot.date).toDateString()}
          Time: ${slot.time} (${slot.period})
          Type: ${consultationType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
          Symptoms: ${symptoms || 'Not specified'}
          
          ACTION REQUIRED:
          ----------------
          To APPROVE this appointment, click here:
          ${approveLink}
          
          To REJECT this appointment, click here:
          ${rejectLink}
        `;

          await sendEmail({
            to: targetEmail,
            subject,
            message
          });

          console.log(`Notification sent to email: ${targetEmail}`);
        } else {
          console.warn("Could not send email: No email found for Doctor or Hospital");
        }
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError.message);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate('slotId');
    if (!appointment) return res.status(404).send("Appointment not found");

    appointment.status = "confirmed";
    await appointment.save();

    // Send Mail to Patient
    if (appointment.patient && appointment.patient.email && appointment.patient.email !== 'Not Provided') {
      console.log(`Sending approval email to patient: ${appointment.patient.email}`);
      await sendEmail({
        to: appointment.patient.email,
        subject: "Appointment Approved - Smart Health",
        message: `Dear ${appointment.patient.name},\n\nYour appointment with the doctor has been APPROVED.\n\nPlease arrive on time.\n\nThank you,\nSmart Health Team`
      });
    } else {
      console.warn(`No patient email found for appointment ${id}. Patient data:`, appointment.patient);
    }

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: green;">✅ Appointment Approved</h1>
        <p>The patient has been notified via email.</p>
        <p>You can close this window.</p>
      </div>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).send("Appointment not found");

    appointment.status = "cancelled";
    await appointment.save();

    // Free up the slot? (Optional, but good practice). 
    // For now just keeping status updated.
    if (appointment.slotId) {
      const slot = await Slot.findById(appointment.slotId);
      if (slot) {
        slot.isBooked = false;
        await slot.save();
      }
    }

    // Send Mail to Patient
    if (appointment.patient && appointment.patient.email && appointment.patient.email !== 'Not Provided') {
      console.log(`Sending rejection email to patient: ${appointment.patient.email}`);
      await sendEmail({
        to: appointment.patient.email,
        subject: "Appointment Request Declined",
        message: `Dear ${appointment.patient.name},\n\nWe regret to inform you that your appointment request could not be approved at this time.\n\nPlease try booking another slot.\n\nRegards,\nSmart Health Team`
      });
    } else {
      console.warn(`No patient email found for appointment ${id} (ejection). Patient data:`, appointment.patient);
    }

    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: red;">❌ Appointment Rejected</h1>
          <p>The patient has been notified.</p>
          <p>You can close this window.</p>
        </div>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
};