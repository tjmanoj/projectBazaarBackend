const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with service account
let serviceAccount;
try {
  // First try parsing the JSON string
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error.message);
  console.log('Make sure your .env file contains the service account JSON in a single line without line breaks');
  process.exit(1);
}

// Validate required fields
if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error('FIREBASE_SERVICE_ACCOUNT is missing required fields');
  console.log('Required fields: project_id, private_key, client_email');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
