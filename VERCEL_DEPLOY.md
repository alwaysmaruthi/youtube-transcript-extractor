# 🔥 Vercel Deployment Fix Guide

## The Issue You Encountered

When deploying to Vercel with the one-click button, you got:
**"Error: Could not connect to the server. Make sure the backend is running."**

This happens because Vercel's one-click deploy only builds the frontend, but our app needs both frontend AND backend.

## 🚀 Solution: Multiple Deployment Options

### **Option 1: Render (Recommended - Actually Works)**
Render supports full-stack apps out of the box:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the Render button
2. Connect your GitHub account  
3. Select this repository
4. Render automatically deploys the backend
5. Get your live URL in ~3 minutes!

### **Option 2: Separate Frontend/Backend Deployment**

#### Deploy Backend to Railway:
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub
3. Select this repository
4. Choose "backend" folder
5. Get your backend URL (e.g., `https://your-app.up.railway.app`)

#### Deploy Frontend to Vercel:
1. Fork this repository on GitHub
2. Update `frontend/src/App.js` line 18:
   ```javascript
   const API_BASE = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.up.railway.app'  // Your Railway backend URL
     : 'http://localhost:5000';
   ```
3. Deploy frontend to Vercel

### **Option 3: Full Vercel Deployment (Advanced)**

Vercel can handle full-stack, but requires proper configuration:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alwaysmaruthi/youtube-transcript-extractor.git
   cd youtube-transcript-extractor
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

Vercel will:
- Deploy the backend as serverless functions
- Build and serve the frontend
- Handle routing automatically

### **Option 4: Render (Also Easy)**
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the Render button
2. Connect GitHub
3. Render deploys both services automatically
4. Free tier available!

## 🔧 Why This Happens

- **Vercel's one-click deploy** only handles static sites by default
- **Our app needs a backend** to extract YouTube transcripts
- **The frontend tries to call `/api/transcript`** but there's no backend to handle it

## ✅ Recommended Solution

**Use Railway** - it's designed for full-stack apps and will deploy everything correctly in one click.

The button is in the main README: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/1KQY8w)

## 🧪 Test Your Deployment

Once deployed, test with these URLs:
- `https://your-app.com/health` - Should return backend health status
- `https://your-app.com` - Should show the frontend
- Try extracting a transcript from: `https://www.youtube.com/watch?v=jNQXAC9IVRw`

## 💡 Local Development Still Works

For local development, the original instructions work perfectly:
```bash
# Backend
cd backend
pip install -r requirements.txt  
python app.py

# Frontend
cd frontend
npm install
npm start
```

**Choose Railway for the easiest deployment experience!** 🚀