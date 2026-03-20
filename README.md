# SafeGuard AI – Your Safety Assistant

SafeGuard AI is a smart personal safety system that automatically captures video and audio evidence during emergencies and sends it to a trusted contact along with your location. Designed for quick response, it works silently in the background without requiring manual start/stop actions.

---

## Features

- 🚨 **Auto Camera + Mic Recording**: Captures a 5-second video with audio automatically.  
- 📧 **Emergency Email Alerts**: Sends video evidence and your location to a pre-saved emergency contact.  
- 🌍 **Location Sharing**: Includes latitude and longitude for precise location tracking.  
- 🛡 **Clean UI**: Simple dashboard with emergency contacts and send evidence button.  
- ⚡ **No Buttons Required**: Auto-recording works without start/stop clicks.

---

## Tech Stack

- **Frontend**: React.js, Leaflet.js (for maps), TensorFlow.js (voice detection)  
- **Backend**: Node.js, Express, Nodemailer  
- **Other Tools**: Twilio API (optional for call notifications), Gmail App Password for sending emails

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Kuldharnilakshi/Safeguard-AI.git
cd Safeguard-AI

Install dependencies

npm install

Create .env file in the backend folder:

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_char_app_password
ACCOUNT_SID=your_twilio_sid
AUTH_TOKEN=your_twilio_token

Create uploads folder in the backend directory:

mkdir uploads

Start backend server

node index.js

Start frontend

npm start
How to Use

Add an emergency contact email in the app.

Press Send Evidence → the system will automatically record video/audio for 5 seconds.

Evidence will be sent to the emergency email along with your current location.
