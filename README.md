# ProjectBazaar Backend

Secure file download server for ProjectBazaar, handling authentication and file streaming from Google Drive.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a service account in Firebase Console:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

3. Create a service account in Google Cloud Console:
   - Enable Google Drive API
   - Create a service account with Drive API access
   - Download the JSON key
   - Share your Google Drive folders with the service account email

4. Set up environment variables:
   - Copy example.env to .env
   - Add your Firebase service account JSON
   - Add your Google Drive service account JSON
   - Update other variables as needed

5. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Deployment on Render.com

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from your .env file
6. Deploy!

## API Endpoints

### GET /health
Health check endpoint.

### GET /download/:projectId
Download project files. Requires:
- Authorization header with Firebase ID token
- Valid project ID
- User must have purchased the project

## File Structure

```
ProjectBazaarBackend/
├── config/
│   ├── firebase.js
│   └── googleDrive.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
├── .env
└── README.md
```
