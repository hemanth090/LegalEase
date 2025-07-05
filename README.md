# LegalEase - Legal Document Simplifier

![image url](https://github.com/hemanth090/LegalEase/blob/main/finalImg%20(1).png?raw=true)

LegalEase is a powerful web application that transforms complex legal documents into clear, understandable explanations in over 75+ languages. No legal expertise required!

## 🌟 Features

- **Multi-format Document Support**: Upload PDF, DOCX, and image files
- **75+ Languages**: Get explanations in your preferred language
- **AI-Powered Analysis**: Advanced document processing using Groq AI
- **OCR Technology**: Extract text from scanned documents and images
- **Beautiful UI**: Modern, responsive design with glass morphism effects
- **Real-time Processing**: Live status updates during document analysis
- **Privacy-First**: Documents are processed in memory only - nothing is stored permanently
- **Secure**: Your documents are never saved to any database or persistent storage

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key (for AI processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LegalStick
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` files in both server and client directories:
   
   **Server (.env)**
   ```env
   PORT=5000
   GROQ_API_KEY=your_groq_api_key_here
   NODE_ENV=development
   ```
   
   **Client (.env)**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Start the application**
   
   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to use the application.

## 🏗️ Project Structure

```
LegalStick/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   │   └── favicon.svg    # App icon
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── FileUpload.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ��── ProcessingStatus.jsx
│   │   │   └── ResultsDisplay.jsx
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── server.js         # Express server
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Groq SDK** - AI processing
- **Tesseract.js** - OCR for image text extraction
- **Mammoth** - DOCX file processing
- **pdf2json** - PDF text extraction
- **Multer** - File upload handling

## 🔒 Privacy & Security

**🔐 API Key Security:**
- ✅ **Never commit real API keys** to version control
- ✅ **Use .env files** which are in .gitignore
- ✅ **Set production keys** only in Render dashboard
- ✅ **Use .env.example** as templates for team members
- ⚠️ **Real keys should never appear in code or README**

**Your documents are completely private and secure:**

- ✅ **No Storage**: Documents are processed in memory only and immediately discarded
- ✅ **No Database**: No user data, documents, or personal information is ever stored
- ✅ **No Tracking**: No user accounts, login, or personal data collection
- ✅ **Temporary Processing**: Files are deleted from server memory after processing
- ✅ **Local Processing**: OCR and text extraction happen on the server temporarily
- ✅ **No Logs**: Document content is never logged or saved to files

**What happens to your document:**
1. Upload → Temporary memory storage
2. Process → AI analysis (sent to Groq API)
3. Return results → Document deleted from memory
4. Zero persistence → Nothing saved anywhere

## 📋 Supported File Types

- **PDF** - Portable Document Format
- **DOCX** - Microsoft Word documents
- **Images** - JPG, PNG, GIF (with OCR)

## 🌍 Supported Languages

LegalEase supports 75+ languages organized by regions:

### Global Languages
English, Chinese (Simplified/Traditional), Spanish, French, Arabic, Portuguese, Russian, Japanese, German

### Indian Languages
Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Malayalam, Punjabi

### European Languages
Italian, Dutch, Polish, Swedish, Norwegian, Danish, Finnish, Greek, Czech, Hungarian, Ukrainian, and more

### Asian Languages
Korean, Thai, Vietnamese, Indonesian, Malay, Filipino, Myanmar, Khmer, Lao, Sinhala, Nepali

### Middle Eastern & Central Asian
Persian, Turkish, Hebrew, Azerbaijani, Georgian, Armenian, Kazakh, Kyrgyz, Uzbek

### African Languages
Swahili, Amharic, Yoruba, Igbo, Hausa, Zulu, Afrikaans, Xhosa, Somali

### Latin American
Portuguese (Brazil), Spanish variants (Mexico, Argentina, Colombia, Peru, Venezuela, Chile), Quechua, Guarani

## 🔧 API Endpoints

### Document Processing
- `POST /api/process` - Process uploaded document
  - Body: FormData with file and language
  - Returns: Simplified explanation

### Health Check
- `GET /api/health` - Server health status

## 🎨 UI Components

### FileUpload
Drag-and-drop file upload with support for multiple formats and file validation.

### LanguageSelector
Comprehensive language selection with categories, search, and popular languages section.

### ProcessingStatus
Real-time processing status with animated progress indicators.

### ResultsDisplay
Beautiful display of simplified document explanations with markdown support.

## 🚀 Deployment

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

### Environment Variables for Production

Ensure all environment variables are properly set for production:
- API keys (Groq)
- CORS origins
- Port configurations

**Note**: No database configuration needed - the application processes documents in memory only for maximum privacy.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for AI processing capabilities
- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR functionality
- [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI
- All contributors who help make legal documents more accessible

---

**Made with ❤️ to make legal documents accessible to everyone**
