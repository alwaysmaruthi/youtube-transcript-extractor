# 🏠 Run Locally (Always Works!)

Since deployment platforms are giving you trouble, let's get it running locally first:

## 🚀 **Quick Local Setup:**

```bash
# Clone your repository
git clone https://github.com/alwaysmaruthi/youtube-transcript-extractor.git
cd youtube-transcript-extractor

# Start backend (Terminal 1)
cd backend
pip install -r requirements.txt
python app.py

# Start frontend (Terminal 2) 
cd frontend
npm install
npm start

# Access at http://localhost:3000
```

## ✅ **This Will Give You:**
- Working backend at `http://localhost:5000`
- Working frontend at `http://localhost:3000` 
- Full transcript extraction functionality
- No deployment headaches!

## 🧪 **Test the Backend Directly:**

```bash
# Health check
curl http://localhost:5000/health

# Extract transcript
curl -X POST http://localhost:5000/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"}'
```

## 🌐 **Share Your Local App:**

Use ngrok to make your local app accessible from anywhere:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local backend
ngrok http 5000

# You'll get a public URL like: https://abc123.ngrok.io
```

## 📱 **Use the Frontend:**
1. Open http://localhost:3000
2. Paste any YouTube URL 
3. Click "Extract Transcript"
4. Search, export, and use all features!

This bypasses all deployment issues and gives you a fully working app immediately!