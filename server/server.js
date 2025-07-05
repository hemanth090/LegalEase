// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

// Debug environment variables
console.log('🔍 Environment Debug:');
console.log('Current working directory:', process.cwd());
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY value:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'undefined');

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { extractFromDocx, extractFromImage, extractFromPdf } from './utils/textExtractor.js';
import { simplifyLegalText } from './services/aiService.js';
import { translateText } from './services/translationService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://legalease-client-app.onrender.com'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and images are allowed.'));
    }
  }
});


// Helper function to detect file type
function getFileType(mimetype, filename) {
  if (mimetype === 'application/pdf' || filename.endsWith('.pdf')) {
    return 'pdf';
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filename.endsWith('.docx')) {
    return 'docx';
  } else if (mimetype.startsWith('image/')) {
    return 'image';
  }
  return 'unknown';
}

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'LegalEase API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      upload: 'POST /upload',
      extractText: 'POST /extract-text',
      simplifyText: 'POST /simplify-text',
      translate: 'POST /translate'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LegalEase API is running' });
});

// Upload file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = getFileType(req.file.mimetype, req.file.originalname);
    
    if (fileType === 'unknown') {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const docId = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    res.json({
      success: true,
      docId: docId,
      filename: req.file.originalname,
      fileType: fileType,
      buffer: req.file.buffer.toString('base64')
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Extract text from uploaded file
app.post('/extract-text', async (req, res) => {
  try {
    const { docId, buffer, fileType } = req.body;

    if (!docId || !buffer || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileBuffer = Buffer.from(buffer, 'base64');
    let extractedText = '';

    // Extract text based on file type
    switch (fileType) {
      case 'pdf':
        extractedText = await extractFromPdf(fileBuffer);
        break;
      case 'docx':
        extractedText = await extractFromDocx(fileBuffer);
        break;
      case 'image':
        extractedText = await extractFromImage(fileBuffer);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.json({
      success: true,
      text: extractedText
    });

  } catch (error) {
    console.error('Text extraction error:', error);
    res.status(500).json({ error: 'Failed to extract text from file' });
  }
});

// Simplify legal text using AI
app.post('/simplify-text', async (req, res) => {
  try {
    const { docId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Simplify text using AI
    const simplifiedText = await simplifyLegalText(text);

    res.json({
      success: true,
      simplified: simplifiedText
    });

  } catch (error) {
    console.error('Simplification error:', error);
    res.status(500).json({ error: 'Failed to simplify legal text' });
  }
});

// Translate simplified text
app.post('/translate', async (req, res) => {
  try {
    const { docId, text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Missing text or target language' });
    }

    // Translate text
    const translatedText = await translateText(text, targetLang);

    res.json({
      success: true,
      translated: translatedText
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
});


// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`LegalEase backend server running on port ${PORT}`);
});