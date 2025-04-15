"use strict";

// Firebase configuration - replace with your own configuration from the Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Import Firebase functions using the modular SDK (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Logging utility function to log every action
function logAction(message) {
  console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
}

// Handle Doctor Login
document.getElementById('doctorLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('doc-email').value;
  const password = document.getElementById('doc-password').value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    logAction(`Doctor ${email} logged in successfully.`);
    showPatientManagement();
  } catch (error) {
    logAction(`Doctor login failed for ${email}: ${error.message}`);
    alert("Doctor Login Failed: " + error.message);
  }
});

// Handle Receptionist Login
document.getElementById('receptionistLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('rec-email').value;
  const password = document.getElementById('rec-password').value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    logAction(`Receptionist ${email} logged in successfully.`);
    showPatientManagement();
  } catch (error) {
    logAction(`Receptionist login failed for ${email}: ${error.message}`);
    alert("Receptionist Login Failed: " + error.message);
  }
});

// Function to display patient management section after successful login
function showPatientManagement() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('patient-management-section').style.display = 'block';
}

// Function to generate a token for new patient entries
function generateToken() {
  // Simple token generation algorithm based on the timestamp and a random number
  const token = 'TOKEN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  logAction(`Generated token: ${token}`);
  return token;
}

// Handle new patient form submission
document.getElementById('patientForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('patient-name').value;
  const age = document.getElementById('patient-age').value;
  const gender = document.getElementById('patient-gender').value;
  const prescription = document.getElementById('patient-prescription').value;
  const token = generateToken();
  
  try {
    const docRef = await addDoc(collection(db, "patients"), {
      name,
      age,
      gender,
      prescription,
      token,
      timestamp: new Date().toISOString()
    });
    logAction(`Patient ${name} data saved with token ${token}. Document ID: ${docRef.id}`);
    alert("Patient Information saved successfully!");
    document.getElementById('patientForm').reset();
  } catch (error) {
    logAction(`Error saving patient data for ${name}: ${error.message}`);
    alert("Error saving patient information: " + error.message);
  }
});
