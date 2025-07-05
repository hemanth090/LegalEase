import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for file processing
});

export const processDocument = async (file, language, setCurrentStep) => {
  try {
    // Step 1: Upload file
    setCurrentStep('uploading');
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { docId, buffer, fileType, filename } = uploadResponse.data;

    // Step 2: Extract text
    setCurrentStep('extracting');
    const extractResponse = await api.post('/extract-text', {
      docId,
      buffer,
      fileType,
    });

    const { text } = extractResponse.data;

    // Step 3: Simplify text
    setCurrentStep('simplifying');
    const simplifyResponse = await api.post('/simplify-text', {
      docId,
      text,
    });

    const { simplified } = simplifyResponse.data;

    let translated = null;

    // Step 4: Translate if needed
    if (language !== 'en') {
      setCurrentStep('translating');
      const translateResponse = await api.post('/translate', {
        docId,
        text: simplified,
        targetLang: language,
      });

      translated = translateResponse.data.translated;
    }

    return {
      docId,
      filename,
      originalText: text,
      simplified,
      translated,
      language,
    };

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
};

export default api;