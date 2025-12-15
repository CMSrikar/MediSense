/*
  # Healthcare Appointment System

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_name` (text) - Full name of the patient
      - `patient_email` (text) - Email for confirmation
      - `patient_phone` (text) - Phone number for SMS
      - `appointment_date` (date) - Date of appointment
      - `appointment_time` (text) - Time slot
      - `doctor_name` (text) - Selected doctor
      - `department` (text) - Medical department
      - `symptoms` (text) - Patient symptoms/reason
      - `status` (text) - pending, confirmed, completed, cancelled
      - `meet_link` (text, optional) - Google Meet link for consultation
      - `created_at` (timestamptz) - Timestamp of booking
      
  2. Security
    - Enable RLS on `appointments` table
    - Add policies for public access (for hackathon demo purposes)
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  doctor_name text NOT NULL,
  department text NOT NULL,
  symptoms text NOT NULL,
  status text DEFAULT 'pending',
  meet_link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert appointments"
  ON appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view appointments"
  ON appointments
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to update appointments"
  ON appointments
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);