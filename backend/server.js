require("dotenv").config();
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔐 ENV */
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

/* 📩 EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* 📁 FILE UPLOAD */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* WhatsApp Sandbox */
const fromWhatsApp = "whatsapp:+14155238886";

/* 🚨 SOS */
app.post("/send-sos", async (req, res) => {
  try {
    const { lat, lon, contact } = req.body;

    if (!lat || !lon || !contact) {
      return res.status(400).json({
        success: false,
        message: "Missing data"
      });
    }

    const formattedContact = contact.startsWith("+")
      ? contact
      : `+91${contact}`;

    const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

    await client.messages.create({
      body: `🚨 SAFEGUARD AI ALERT!

📍 ${mapsLink}
⏱ ${new Date().toLocaleString()}`,
      from: fromWhatsApp,
      to: `whatsapp:${formattedContact}`
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* 🎤 MOCK AI */
app.post("/detect-scream", (req, res) => {
  res.json({ alert: Math.random() > 0.6 });
});

/* 📤 SEND EVIDENCE */
app.post("/send-evidence", upload.single("file"), async (req, res) => {
  try {
    const { email, lat, lon } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🚨 Safeguard AI Evidence",
      text: `Emergency Evidence

📍 ${mapsLink}
⏱ ${new Date().toLocaleString()}`,

      attachments: req.file
        ? [
            {
              filename: req.file.filename,
              path: req.file.path
            }
          ]
        : []
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.json({ success: false, error: err.message });
  }
});

if (req.file) {
  fs.unlinkSync(req.file.path); // delete file after sending
}

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});