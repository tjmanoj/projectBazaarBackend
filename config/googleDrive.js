const { google } = require('googleapis');
require('dotenv').config();

// Initialize Google Drive API client with service account
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

module.exports = { drive };
