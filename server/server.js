const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==========================================
// AUTOMATED WHATSAPP CLIENT SETUP
// ==========================================
let isWhatsAppReady = false; // Flag to check if we can send messages

const client = new Client({
    authStrategy: new LocalAuth(), // Saves session so you don't scan QR every time
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // UPDATED: Points directly to your local Chrome to fix the "Could not find Chrome" error
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
    }
});

client.on('qr', (qr) => {
    // This will display a QR code in your terminal. 
    // Scan it once with your WhatsApp (Linked Devices).
    console.log('--- SCAN THIS QR CODE TO LINK WHATSAPP ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    isWhatsAppReady = true;
    console.log('WhatsApp Automation Client is READY!');
});

// Handle disconnection or failure
client.on('disconnected', () => {
    isWhatsAppReady = false;
    console.log('WhatsApp Client was logged out.');
});

client.initialize();

// ==========================================
// MYSQL DATABASE CONNECTION
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'shubha',      
    database: 'clinic_website' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database: clinic_website');
});

// ==========================================
// API ROUTE: SAVE APPOINTMENT + AUTO WHATSAPP
// ==========================================
app.post('/api/book', (req, res) => {
    const { name, phone, service, date } = req.body;

    if (!name || !phone || !service || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO appointments (name, phone, service, appointment_date) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, phone, service, date], async (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to save appointment' });
        }

        // --- AUTOMATIC WHATSAPP NOTIFICATION ---
        // Only attempt to send if the client is actually ready to avoid the 'getChat' error
        if (isWhatsAppReady) {
            const myNumber = "918080301527"; 
            const chatId = myNumber + "@c.us";
            const message = `*NEW APPOINTMENT CONFIRMED*\n\n` +
                            `👤 Patient: ${name}\n` +
                            `📞 Contact: ${phone}\n` +
                            `🦷 Service: ${service}\n` +
                            `📅 Date: ${date}\n\n` +
                            `_This is an automated notification from your website._`;

            try {
                await client.sendMessage(chatId, message);
                console.log('WhatsApp Message Sent Successfully!');
                res.status(200).json({ message: 'Appointment saved and WhatsApp notification sent!' });
            } catch (wpErr) {
                console.error('WhatsApp Notification Error:', wpErr);
                res.status(200).json({ message: 'Appointment saved, but WhatsApp notification failed.' });
            }
        } else {
            console.log('⚠️ WhatsApp client not ready yet. Appointment saved to DB only.');
            res.status(200).json({ message: 'Appointment saved. (WhatsApp sync in progress)' });
        }
    });
});

// ==========================================
// NEW API ROUTE: FETCH ALL APPOINTMENTS
// ==========================================
app.get('/api/appointments', (req, res) => {
    const sql = 'SELECT * FROM appointments ORDER BY created_at DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }
        res.status(200).json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});