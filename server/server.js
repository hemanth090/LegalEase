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
    console.log('📤 Upload request received');
    console.log('📁 File info:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = getFileType(req.file.mimetype, req.file.originalname);
    console.log('🔍 Detected file type:', fileType);
    
    if (fileType === 'unknown') {
      console.log('❌ Unsupported file type:', req.file.mimetype);
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const docId = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    console.log('🆔 Generated docId:', docId);

    const response = {
      success: true,
      docId: docId,
      filename: req.file.originalname,
      fileType: fileType,
      buffer: req.file.buffer.toString('base64')
    };

    console.log('✅ Upload successful, response size:', JSON.stringify(response).length);
    res.json(response);

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file: ' + error.message });
  }
});

// Extract text from uploaded file
app.post('/extract-text', async (req, res) => {
  try {
    console.log('📝 Extract text request received');
    const { docId, buffer, fileType } = req.body;
    console.log('🔍 Request data:', { docId, fileType, bufferLength: buffer ? buffer.length : 0 });

    if (!docId || !buffer || !fileType) {
      console.log('❌ Missing required fields:', { docId: !!docId, buffer: !!buffer, fileType: !!fileType });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('🔄 Converting buffer from base64...');
    const fileBuffer = Buffer.from(buffer, 'base64');
    console.log('📊 File buffer size:', fileBuffer.length, 'bytes');
    
    let extractedText = '';

    console.log('🚀 Starting text extraction for type:', fileType);
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
        console.log('❌ Unsupported file type:', fileType);
        return res.status(400).json({ error: 'Unsupported file type' });
    }

    console.log('✅ Text extraction completed, length:', extractedText.length);
    console.log('📄 Text preview:', extractedText.substring(0, 200) + '...');

    const response = {
      success: true,
      text: extractedText
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Text extraction error:', error);
    res.status(500).json({ error: 'Failed to extract text from file: ' + error.message });
  }
});

// Simplify legal text using AI
app.post('/simplify-text', async (req, res) => {
  try {
    console.log('🤖 Simplify text request received');
    const { docId, text } = req.body;
    console.log('🔍 Request data:', { docId, textLength: text ? text.length : 0 });

    if (!text) {
      console.log('❌ No text provided');
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('🚀 Starting AI simplification...');
    // Simplify text using AI
    const simplifiedText = await simplifyLegalText(text);
    console.log('✅ AI simplification completed, length:', simplifiedText.length);

    const response = {
      success: true,
      simplified: simplifiedText
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Simplification error:', error);
    res.status(500).json({ error: 'Failed to simplify legal text: ' + error.message });
  }
});

// Translate simplified text
app.post('/translate', async (req, res) => {
  try {
    console.log('🌐 Translate request received');
    const { docId, text, targetLang } = req.body;
    console.log('🔍 Request data:', { docId, targetLang, textLength: text ? text.length : 0 });

    if (!text || !targetLang) {
      console.log('❌ Missing text or target language:', { text: !!text, targetLang: !!targetLang });
      return res.status(400).json({ error: 'Missing text or target language' });
    }

    console.log('🚀 Starting translation to:', targetLang);
    // Translate text
    const translatedText = await translateText(text, targetLang);
    console.log('✅ Translation completed, length:', translatedText.length);

    const response = {
      success: true,
      translated: translatedText
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Translation error:', error);
    res.status(500).json({ error: 'Failed to translate text: ' + error.message });
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