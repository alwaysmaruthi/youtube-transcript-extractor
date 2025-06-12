# YouTube Transcript Extractor - Full Stack Application

A professional full-stack web application that extracts real YouTube video transcripts using Python backend and React frontend.

## 🚀 Features

### Backend (Python Flask)
- **Real transcript extraction** using `youtube-transcript-api`
- **Video metadata fetching** with `pytube`
- **Multiple language support** detection
- **Robust error handling** with detailed error codes
- **RESTful API** with proper HTTP status codes
- **CORS enabled** for cross-origin requests

### Frontend (React)
- **Modern UI** with professional design
- **Real-time search** through transcript text
- **Export functionality** (TXT, JSON, clipboard)
- **Responsive design** for mobile and desktop
- **Loading states** and error handling
- **Video metadata display** with views, duration, author

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Docker (optional)

## 🛠️ Installation & Setup

### Method 1: Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Method 2: Docker (Recommended)
```bash
docker-compose up --build
```

## 🌐 API Endpoints

### `POST /api/transcript`
Extract transcript from YouTube video
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### `POST /api/video-info`
Get video metadata only
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### `POST /api/available-languages`
Get available transcript languages
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### `GET /health`
Health check endpoint

## 📁 Project Structure

```
youtube-transcript-app/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend Docker config
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Node dependencies
│   ├── Dockerfile         # Frontend Docker config
│   └── nginx.conf         # Nginx configuration
├── docker-compose.yml     # Multi-container setup
└── README.md              # This file
```

## 🔧 Usage

1. **Start the application**:
   - Development: Run backend and frontend separately
   - Production: Use Docker Compose

2. **Extract transcripts**:
   - Paste any YouTube URL
   - Click "Extract Transcript"
   - Wait for processing (usually 5-15 seconds)

3. **Search and export**:
   - Use the search box to filter transcript
   - Export as TXT or JSON
   - Copy entire transcript to clipboard

## ⚙️ Configuration

### Backend Configuration
- Port: `5000` (configurable)
- CORS: Enabled for all origins
- Timeout: 120 seconds for gunicorn
- Workers: 4 processes

### Frontend Configuration
- Development port: `3000`
- Production port: `80` (nginx)
- API proxy: Automatically configured

## 🚨 Error Handling

The application handles various error scenarios:

- **Invalid URLs**: Validates YouTube URL format
- **Private videos**: Detects and reports access issues
- **No transcripts**: Graceful handling when captions unavailable
- **Network issues**: Backend connectivity problems
- **Rate limiting**: YouTube API restrictions

## 🔍 Testing

### Test with these YouTube videos:
- TED Talks (usually have good transcripts)
- Educational channels
- News clips
- Public lectures

### Manual Testing:
```bash
# Test backend directly
curl -X POST http://localhost:5000/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Health check
curl http://localhost:5000/health
```

## 🐳 Docker Deployment

### Development:
```bash
docker-compose up
```

### Production:
```bash
docker-compose -f docker-compose.yml up -d
```

## 🔐 Security Considerations

- Input validation for YouTube URLs
- No API keys required (uses public endpoints)
- Rate limiting protection
- XSS protection headers
- Non-root Docker containers

## 📈 Performance

- **Backend**: Async processing with gunicorn
- **Frontend**: Optimized React build with nginx
- **Caching**: Browser caching for static assets
- **Compression**: Gzip enabled

## 🐛 Troubleshooting

### Common Issues:

1. **"Could not connect to server"**:
   - Ensure backend is running on port 5000
   - Check firewall settings

2. **"No transcript available"**:
   - Video may not have captions
   - Try with different video

3. **CORS errors**:
   - Backend CORS is enabled
   - Check browser console for details

4. **Docker issues**:
   - Ensure Docker daemon is running
   - Check container logs: `docker-compose logs`

## 🚀 Production Deployment

### Environment Variables:
```bash
# Backend
FLASK_ENV=production
FLASK_APP=app.py

# Frontend
REACT_APP_API_URL=https://your-backend-url.com
```

### Scaling:
- Use load balancer for multiple backend instances
- CDN for frontend static files
- Database for caching (optional)

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## 📞 Support

For issues and questions:
- Check existing GitHub issues
- Create new issue with reproduction steps
- Include error logs and environment details