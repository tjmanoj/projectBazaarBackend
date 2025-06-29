const express = require('express');
const cors = require('cors');
const { verifyAuth } = require('./middleware/auth');
const { db } = require('./config/firebase');
const { drive } = require('./config/googleDrive');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Download endpoint with authentication
app.get('/download/:projectId', verifyAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;

    // Get project from Firestore
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectDoc.data();
    
    // Check if user has purchased the project
    if (!project.purchasedBy?.includes(userId)) {
      return res.status(403).json({ error: 'Project not purchased' });
    }

    // Get Google Drive file ID from sourceCodeUrl field
    const fileId = project.sourceCodeUrl;
    if (!fileId) {
      return res.status(404).json({ error: 'Source file not found' });
    }
    
    // Clean up the file ID if it's a full URL
    const cleanFileId = fileId.includes('drive.google.com/file/d/') 
      ? fileId.split('/file/d/')[1].split('/')[0]
      : fileId;

    // Get file metadata from Google Drive
    const file = await drive.files.get({
      fileId: cleanFileId,
      fields: 'name, mimeType'
    });

    // Set response headers for file download
    res.setHeader('Content-Type', file.data.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.data.name}"`);

    // Stream the file from Google Drive to the response
    const stream = await drive.files.get({
      fileId: cleanFileId,
      alt: 'media'
    }, { responseType: 'stream' });

    stream.data
      .on('error', error => {
        console.error('Stream error:', error);
        res.status(500).json({ error: 'Download failed' });
      })
      .pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
