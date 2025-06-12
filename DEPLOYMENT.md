# 🚀 One-Click Deployment Options

Deploy your YouTube Transcript Extractor instantly with these platforms:

## ⚡ Quick Deploy Buttons

### 1. Railway (Recommended for Full-Stack)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/1KQY8w)

**Steps:**
1. Click the Railway button above
2. Connect your GitHub account
3. Select this repository
4. Railway will automatically build and deploy both frontend and backend
5. Get your live URL in ~3 minutes!

### 2. Render (Free Tier Available)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Steps:**
1. Click the Render button
2. Connect your GitHub repository
3. Render will build both services automatically
4. Free tier available (with limitations)

### 3. Vercel (Frontend Only - Requires Backend Setup)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alwaysmaruthi/youtube-transcript-extractor)

**⚠️ Important:** Vercel one-click deploy only deploys the frontend. You'll get a "Could not connect to server" error.

**For full-stack deployment:**
1. Deploy backend to Railway/Render first
2. Update frontend API URL in code
3. Then deploy frontend to Vercel

📖 **[See Vercel Deployment Fix Guide](VERCEL_DEPLOY.md)** for detailed solutions.

### 4. Docker Anywhere
```bash
# Clone and run with Docker
git clone https://github.com/alwaysmaruthi/youtube-transcript-extractor.git
cd youtube-transcript-extractor
docker-compose up --build

# Access at http://localhost:3000
```

## 🌟 Platform Comparison

| Platform | Cost | Setup Time | Full-Stack | Custom Domain |
|----------|------|------------|------------|---------------|
| **Railway** | Free tier + pay-as-you-go | 3 minutes | ✅ Yes | ✅ Yes |
| **Render** | Free tier available | 5 minutes | ✅ Yes | ✅ Yes |
| **Vercel** | Free for frontend | 2 minutes | ⚠️ Frontend only | ✅ Yes |
| **Heroku** | $5/month minimum | 10 minutes | ✅ Yes | ✅ Yes |
| **DigitalOcean** | $5/month | 15 minutes | ✅ Yes | ✅ Yes |

## 🔧 Environment Variables

For production deployment, set these environment variables:

### Backend
```bash
FLASK_ENV=production
PORT=5000
```

### Frontend
```bash
REACT_APP_API_URL=https://your-backend-url.com
```

## 📱 Demo & Testing

### Live Demo
- **Frontend Demo:** [GitHub Pages](https://alwaysmaruthi.github.io/youtube-transcript-extractor) (frontend-only)
- **Full App:** Deploy using buttons above for full functionality

### Test URLs
Try these YouTube videos that have transcripts:
- https://www.youtube.com/watch?v=jNQXAC9IVRw (Short test video)
- Any TED Talk or educational video
- News clips with captions

## 🚨 Important Notes

### YouTube API Limitations
- Some videos may not have transcripts available
- Private/restricted videos won't work
- The app handles these cases gracefully with error messages

### Production Considerations
- Consider rate limiting for high traffic
- Monitor usage and costs on chosen platform
- Set up domain and SSL certificates
- Enable monitoring and logging

## 💡 Quick Start for Developers

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm start

# Or use Docker
docker-compose up --build
```

### Testing
```bash
# Test backend API
curl -X POST http://localhost:5000/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"}'

# Frontend available at http://localhost:3000
```

Choose your preferred deployment method and get your YouTube Transcript Extractor live in minutes! 🎉