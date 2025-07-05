import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://legalease-backend-api.onrender.com';

// Debug logging
console.log('🔍 Frontend API Configuration:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for file processing
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      dataSize: JSON.stringify(response.data).length
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

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