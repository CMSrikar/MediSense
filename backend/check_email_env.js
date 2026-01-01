import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading from .env in current directory
dotenv.config();

console.log('--- ENV CHECK ---');
console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
console.log('EMAIL_FROM exists:', !!process.env.EMAIL_FROM);
console.log('-----------------');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in environment variables.');
    process.exit(1);
} else {
    console.log('✅ Email credentials found.');
    process.exit(0);
}
