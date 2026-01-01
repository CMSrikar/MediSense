# Healthcare Management System
# MediSense

A comprehensive healthcare platform connecting patients with doctors, labs, and pharmacies.

## Features

### For Patients
- **Appointment Booking**: Easy booking with doctors.
- **Medicine Shop**: Order medicines online.
- **Home Remedies**: natural remedies for common ailments.
- **Lab Tests**: Book diagnostic tests.
- **AI Report Summarization**: Upload medical reports for AI-powered summaries.
- **Video Consultation**: Remote consultation with doctors (SOS features).

### For Doctors
- **Dashboard**: Manage appointments and patient data.
- **Video Consultation**: Conduct online sessions.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Services**: OpenAI (Report analysis), Nodemailer (Notifications)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas connection)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   OPENAI_API_KEY=your_openai_api_key
   FAST2SMS_API_KEY=your_fast2sms_api_key
   ```

4. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Structure

- `/api/auth`: User authentication
- `/api/doctors`: Doctor management
- `/api/appointments`: Booking management
- `/api/medicines`: E-commerce catalog
- `/api/labs`: Lab test bookings
- `/api/reports`: AI report processing

## Required dependencies

MediCare
npm i   
npm i axios 
npm install @fortawesome/fontawesome-free
npm install framer-motion lucide-react
npm install react-router-dom
npm install @react-google-maps/api
npm install react-i18next i18next



//backend
npm install jsonwebtoken bcryptjs nodemailer
npm install crypto
npm i mongoose express nodemon
npm i openai