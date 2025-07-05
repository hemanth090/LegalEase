# 🚀 Deployment Guide - LegalEase

## 🔐 Security First - Protecting Your API Keys

**CRITICAL: Your API keys have been secured and removed from version control.**

### ✅ What We've Done:
1. **Removed real API keys** from .env files
2. **Added comprehensive .gitignore** to protect sensitive files
3. **Created .env.example templates** for reference
4. **Updated documentation** with security best practices

### 🔑 Your GROQ API Key:
**⚠️ API key has been removed from documentation for security.**
**You'll need to set it manually in Render's environment variables.**

---

## 📋 Deployment Steps

### Step 1: Push to GitHub

1. **Initialize Git (if not done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LegalEase - Legal Document Simplifier"
   ```

2. **Create GitHub Repository:**
   - Go to [GitHub.com](https://github.com)
   - Click "New Repository"
   - Name it "LegalEase" or "legal-document-simplifier"
   - Don't initialize with README (you already have one)

3. **Connect and Push:**
   ```bash
   git remote add origin https://github.com/hemanth090/LegalEase.git
   git branch -M main
   git push -u origin main
   ```
   
   **If authentication fails, you have two options:**
   
   **Option A: Use GitHub CLI (Recommended)**
   ```bash
   # Install GitHub CLI first: https://cli.github.com/
   gh auth login
   git push -u origin main
   ```
   
   **Option B: Use Personal Access Token**
   1. Go to GitHub → Settings → Developer settings → Personal access tokens
   2. Generate new token with repo permissions
   3. Use token as password when prompted

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New +"** → **"Blueprint"**
4. **Connect your GitHub repository**
5. **Render will automatically detect the `render.yaml` file**

### Step 3: Set Environment Variables

In the Render dashboard, set these environment variables:

**For the Backend Service (legalease-api):**
```
GROQ_API_KEY=your_actual_groq_api_key_here
NODE_ENV=production
```

**The frontend will automatically get the API URL from the backend service.**

### Step 4: Deploy

1. **Click "Apply"** in Render
2. **Wait for build** (5-10 minutes)
3. **Your app will be live!**

---

## 🔧 Local Development Setup

### For New Team Members:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hemanth090/LegalEase.git
   cd LegalEase
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   
   **Copy example files:**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
   
   **Edit server/.env:**
   ```env
   GROQ_API_KEY=your_actual_groq_api_key_here
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
   PORT=5000
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Checklist

- ✅ Real API keys removed from code
- ✅ .env files in .gitignore
- ✅ Environment variables set in Render dashboard only
- ✅ No sensitive data in repository
- ✅ Secure deployment configuration

---

## 🌐 Production URLs

After deployment, you'll get:
- **Frontend:** `https://your-app-name.onrender.com`
- **Backend API:** `https://your-api-name.onrender.com`

The frontend automatically connects to the backend via Render's service linking.

---

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that GROQ_API_KEY is set in Render dashboard
   - Verify render.yaml syntax

2. **API Connection Issues:**
   - Ensure backend service is running
   - Check environment variables in Render

3. **File Upload Issues:**
   - Verify file size limits (10MB max)
   - Check supported file types (PDF, DOCX, images)

### Getting Help:
- Check Render logs in the dashboard
- Verify all environment variables are set
- Ensure both services are deployed successfully

---

**🎉 Your LegalEase app is now secure and ready for deployment!**