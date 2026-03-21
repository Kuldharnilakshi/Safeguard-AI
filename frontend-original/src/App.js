import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import ringtone from "./ringtone.mp3";


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* FIX LEAFLET ICON */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

/* MAP AUTO UPDATE */

function MapUpdater({ lat, lon }) {

  const map = useMap();

  useEffect(() => {

    if (lat && lon) {
      map.setView([lat, lon], 15);
    }

  }, [lat, lon, map]);

  return null;

}

function App() {

  /* LOCATION */

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [audio] = useState(new Audio(ringtone));
  /*const mediaRecorderRef = useRef(null);
const [mediaFile, setMediaFile] = useState(null);*/
const [editEmail, setEditEmail] = useState(false);
  

  useEffect(() => {

    if (navigator.geolocation) {

      const watchId = navigator.geolocation.watchPosition(

        (position) => {

          setLat(position.coords.latitude);
          setLon(position.coords.longitude);

        },

        (error) => {

          console.log("Location error:", error);

        },

        { enableHighAccuracy: true }

      );

      return () => navigator.geolocation.clearWatch(watchId);

    }

  }, []);

  const [alertMessage, setAlertMessage] = useState("");

  /* PROFILE */

  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [photo, setPhoto] = useState(localStorage.getItem("photo") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [age, setAge] = useState(localStorage.getItem("age") || "");
  const [blood, setBlood] = useState(localStorage.getItem("blood") || "");
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [medical, setMedical] = useState(localStorage.getItem("medical") || "");
  const [emergencyEmail, setEmergencyEmail] = useState(
  localStorage.getItem("emergencyEmail") || ""
);

  const [editMode, setEditMode] = useState(false);

  /* CONTACTS */

  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem("contacts")) || [
      { name: "", relation: "", number: "" },
      { name: "", relation: "", number: "" },
      { name: "", relation: "", number: "" }
    ]
  );

  const [editContacts, setEditContacts] = useState(false);

  const updateContact = (index, field, value) => {

    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);

  };

  const saveContacts = () => {

    localStorage.setItem("contacts", JSON.stringify(contacts));
    setEditContacts(false);

  };

  const addContact = () => {

    setContacts([...contacts, { name: "", relation: "", number: "" }]);

  };

  const deleteContact = (index) => {

    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);

  };

  

  /* SAVE PROFILE */

  const saveProfile = () => {

    localStorage.setItem("name", name);
    localStorage.setItem("phone", phone);
    localStorage.setItem("email", email);
    localStorage.setItem("age", age);
    localStorage.setItem("blood", blood);
    localStorage.setItem("address", address);
    localStorage.setItem("medical", medical);
    localStorage.setItem("photo", photo);

    alert("Profile Saved Successfully");
    setEditMode(false);

  };

  /* PHOTO */

  const handlePhoto = (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {

      setPhoto(reader.result);
      localStorage.setItem("photo", reader.result);

    };

    reader.readAsDataURL(file);

  };

  /* SOS */

  /* SOS */

const sendSOS = async () => {

  if (!contacts[0].number) {
    alert("Please add emergency contact first");
    return;
  }

  if (!lat || !lon) {
    alert("Location not detected yet");
    return;
  }

  setAlertMessage("🚨 EMERGENCY ALERT SENT!");

  try {

    await fetch("http://localhost:5000/send-sos", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        lat: lat,
        lon: lon,
        contact: contacts[0].number
      })

    });

    alert("Emergency Alert Sent!");

  } catch (error) {

    console.log(error);

  }

};
async function detectEmergency(){

  if(!lat || !lon){
    console.log("Location not ready");
    return;
  }

  const res = await fetch("http://localhost:5000/detect-scream",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      lat: lat,
      lon: lon,
      contact: contacts[0].number
    })

  });

  const data = await res.json();

  console.log("AI Response:",data);

}
  /* FAKE CALL */

  const [showCall, setShowCall] = useState(false);

const fakeCall = () => {

  setShowCall(true);

  audio.loop = true;   // keep ringing
  audio.play();

};

const endCall = () => {

  setShowCall(false);

  audio.pause();
  audio.currentTime = 0;

};

const acceptCall = () => {

  alert("Call Accepted. Stay calm and stay safe!");

  endCall();
  const acceptCall = () => {
  alert("Call Accepted. Stay calm and stay safe!");
  endCall();
};

};


  /* VOICE SOS */

const startVoiceSOS = () => {

   detectEmergency();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = async (event) => {

    const transcript =
      event.results[event.results.length - 1][0].transcript.toLowerCase();

    console.log("Voice detected:", transcript);

    const keywords = [
  "help",
  "sos",
  "emergency",
  "save me",
  "danger",
  "i am in danger",
  "please help",
  "help me",
  "i need help",
  "someone help",
  "attack",
  "threat",
  "rescue me",
  "i am not safe"
];

const detected = keywords.some(word => transcript.includes(word));

if (detected) {
  alert("🚨 Emergency voice detected!");
  await sendSOS();
  recognition.stop();
} 
  };

};

const sendEvidence = async () => {

  if (!emergencyEmail) {
    alert("Please add emergency email first");
    return;
  }

  try {

    // 🎥 Capture camera + mic
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = async () => {

      const blob = new Blob(chunks, { type: "video/webm" });

      const formData = new FormData();
      formData.append("email", emergencyEmail);
      formData.append("lat", lat);
      formData.append("lon", lon);
      formData.append("file", blob, "evidence.webm");

      await fetch("http://localhost:5000/send-evidence", {
        method: "POST",
        body: formData
      });

      alert("📧 Evidence sent successfully!");

    };

    recorder.start();

    // ⏱ auto stop after 5 sec
    setTimeout(() => {
      recorder.stop();
      stream.getTracks().forEach(track => track.stop());
    }, 5000);

  } catch (err) {
    console.log(err);
    alert("Camera/Mic permission required!");
  }

};

  return (

    <div className="container">

      {showCall && (

        <div className="call-screen">

          <h1>Mom</h1>
          <p>Incoming Call...</p>

          <div className="call-buttons">

            <button className="accept" onClick={acceptCall}>
  Accept
</button>

            <button className="decline" onClick={endCall}>
              End
            </button>

          </div>

        </div>

      )}

      <div className="dashboard">

        {/* SIDEBAR */}

        <div className="sidebar">

          <h2 className="logo">Safeguard AI</h2>

          <div className="profile">

            <button
              className="btn btn-edit"
              onClick={() => setEditMode(!editMode)}
            >
              ✏
            </button>

            <img
              src={photo || "https://i.pravatar.cc/100"}
              alt="profile"
            />

            {editMode && (
              <input type="file" onChange={handlePhoto} />
            )}

            {editMode ? (

              <div className="edit-form">

                <input placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
                <input placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <input placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />
                <input placeholder="Blood Group" value={blood} onChange={(e)=>setBlood(e.target.value)} />
                <input placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
                <input placeholder="Medical Info" value={medical} onChange={(e)=>setMedical(e.target.value)} />

                <button 
                className="btn-btn-save"
                onClick={saveProfile}>Save</button>

              </div>

            ) : (

              <div className="profile-info">

                <h3>{name || "User Name"}</h3>
                <p>📞 {phone}</p>
                <p>✉ {email}</p>
                <p>🩸 Blood Group: {blood}</p>
                <p>🎂 Age: {age}</p>
                <p>📍 {address}</p>
                <p>⚕ {medical}</p>

              </div>

            )}

          </div>

        </div>

        {/* MAIN */}

        <div className="main">
          {alertMessage && <p className="alert">{alertMessage}</p>}

          <div className="top-cards">

            {/* EMERGENCY CONTACTS */}

            <div className="card">

  <div className="card-header">
    <h2>Emergency Contacts</h2>

    <button 
      className="btn btn-edit"
      onClick={() => setEditContacts(!editContacts)}
    >
      {editContacts ? "Cancel" : "Edit"}
    </button>
  </div>

  {contacts.map((c, i) => (

    <div key={i} className="contact-row">

      {editContacts ? (

        <>
          <input
            className="input"
            placeholder="Name"
            value={c.name}
            onChange={(e)=>updateContact(i,"name",e.target.value)}
          />

          <input
            className="input"
            placeholder="Relation"
            value={c.relation}
            onChange={(e)=>updateContact(i,"relation",e.target.value)}
          />

          <input
            className="input"
            placeholder="Number"
            value={c.number}
            onChange={(e)=>updateContact(i,"number",e.target.value)}
          />

          <button
            className="btn btn-delete"
            onClick={()=>deleteContact(i)}
          >
            Delete
          </button>
        </>

      ) : (

        <p className="contact-display">
          {c.name} ({c.relation}) - {c.number}
        </p>

      )}

    </div>

  ))}

  {editContacts && (

    <div className="button-group">

      <button 
        className="btn btn-add"
        onClick={addContact}
      >
        + Add
      </button>

      <button 
        className="btn btn-save"
        onClick={saveContacts}
      >
        Save
      </button>

    </div>

  )}

</div>

            {/* LOCATION */}

            <div className="card">

              <h2>📍 Current Location</h2>

              <p>Latitude: {lat}</p>
              <p>Longitude: {lon}</p>

              <MapContainer
                center={lat && lon ? [lat, lon] : [19.9, 74.4]}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "220px", width: "100%" }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater lat={lat} lon={lon} />

                {lat && lon && (
                  <Marker position={[lat, lon]}>
                    <Popup>Your Live Location</Popup>
                  </Marker>
                )}

              </MapContainer>

            </div>
            
          </div>

            {/* EMERGENCY EMAIL */}

            

           <div className="card">

  <div className="card-header">
    <h2>📧 Emergency Email</h2>

    <button 
      className="btn btn-edit"
      onClick={() => setEditEmail(!editEmail)}
    >
      {editEmail ? "Cancel" : "Edit"}
    </button>
  </div>

  {editEmail ? (
    <>
      <input
        type="email"
        className="input full-width"
        placeholder="Enter emergency email"
        value={emergencyEmail}
        onChange={(e) => setEmergencyEmail(e.target.value)}
      />

      <div className="button-group">

        <button
          className="btn btn-save"
          onClick={() => {
            localStorage.setItem("emergencyEmail", emergencyEmail);
            setEditEmail(false);
          }}
        >
          Save
        </button>

        <button
          className="btn btn-delete"
          onClick={() => {
            setEmergencyEmail("");
            localStorage.removeItem("emergencyEmail");
          }}
        >
          Delete
        </button>

      </div>
    </>
  ) : (
    <p className="contact-display">
      {emergencyEmail || "No email added"}
    </p>
  )}

  <p className="email-note">
    This email will receive evidence in emergency
  </p>

</div>
            

          <div className="card safety-card">
  <h2>🛡️ Important Safety Info</h2>

  <div className="safety-item">
    <strong>🚨 Emergency Number:</strong> 112
  </div>

  <div className="safety-item">
    <strong>🎤 Voice Trigger:</strong> Say "HELP" to activate SOS
  </div>

  <div className="safety-item">
    <strong>📍 Location Sharing:</strong> Okay
  </div>

  <div className="safety-item">
    <strong>⚡ Status:</strong> <span className="active">Monitoring Active</span>
  </div>

  <div className="safety-tips">
    <p>✔ Stay aware of surroundings</p>
    <p>✔ Keep phone charged</p>
    <p>✔ Share live location in emergencies</p>
  </div>
</div>

          {/* ACTIONS */}

                <div className="bottom">

  <div className="small-card">
    <h3>🚨 Emergency SOS</h3>
    <p style={{ fontSize: "12px", color: "#666" }}>
      Instantly send your live location to emergency contact
    </p>
    <button className="danger" onClick={sendSOS}>Send SOS</button>
  </div>

  <div className="small-card">
    <h3>📞 Fake Call</h3>
    <p style={{ fontSize: "12px", color: "#666" }}>
      Simulate an incoming call to escape unsafe situations
    </p>
    <button onClick={fakeCall}>Start Call</button>
  </div>

  <div className="small-card">
    <h3>🎤 Voice SOS</h3>
    <p style={{ fontSize: "12px", color: "#666" }}>
      Say keywords like: <br />
      <b>help, save me, emergency, danger, please help, I'm in danger</b>
    </p>
    <button onClick={startVoiceSOS}>Start</button>
  </div>

  <div className="small-card">
    <h3>📧 Send Evidence</h3>
    <p style={{ fontSize: "12px", color: "#666" }}>
      Auto record audio + video and send to emergency email
    </p>
    <button onClick={sendEvidence}>Send Evidence</button>
  </div>

</div>
</div>

      </div>

    </div>

  );

}

export default App;
