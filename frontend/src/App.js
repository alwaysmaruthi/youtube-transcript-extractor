import React, { useState } from 'react';
import axios from 'axios';
import { 
  Play, 
  Download, 
  Copy, 
  Search, 
  AlertCircle, 
  CheckCircle,
  Loader,
  Youtube,
  Clock,
  User,
  Eye
} from 'lucide-react';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? window.location.origin  // Use same domain for production (works with Vercel)
  : 'http://localhost:5000';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  const extractTranscript = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setTranscript(null);
    setVideoInfo(null);

    try {
      const response = await axios.post(`${API_BASE}/api/transcript`, {
        url: url.trim()
      });

      setTranscript(response.data.transcript);
      setVideoInfo(response.data.metadata);
      setSuccess(`Successfully extracted ${response.data.total_entries} transcript entries!`);
      
    } catch (err) {
      console.error('Transcript extraction failed:', err);
      
      if (err.response?.data) {
        setError(err.response.data.error + (err.response.data.details ? ': ' + err.response.data.details : ''));
      } else if (err.request) {
        setError('Could not connect to the server. Make sure the backend is running.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const filteredTranscript = transcript?.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportTxt = () => {
    if (!transcript) return;
    
    const text = transcript.map(item => 
      `[${formatTime(item.start)}] ${item.text}`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    if (!transcript) return;
    
    const jsonData = JSON.stringify({
      video_info: videoInfo,
      transcript: transcript
    }, null, 2);
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcript.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!transcript) return;
    
    const text = transcript.map(item => 
      `[${formatTime(item.start)}] ${item.text}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Transcript copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const clearAll = () => {
    setUrl('');
    setTranscript(null);
    setVideoInfo(null);
    setError('');
    setSuccess('');
    setSearchTerm('');
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '700' }}>
          🎬 YouTube Transcript Extractor
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
          Extract and search through YouTube video transcripts with real backend processing
        </p>
      </header>

      <div className="card">
        <div style={{ 
          padding: '40px', 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#555' 
            }}>
              YouTube Video URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && extractTranscript()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input"
              style={{ marginBottom: '20px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={extractTranscript} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <Loader className="spinner" size={16} /> : <Play size={16} />}
              Extract Transcript
            </button>
            <button onClick={clearAll} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error">
            <AlertCircle size={16} style={{ marginRight: '8px', display: 'inline' }} />
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="success">
            <CheckCircle size={16} style={{ marginRight: '8px', display: 'inline' }} />
            {success}
          </div>
        )}

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666' 
          }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p>Extracting transcript from YouTube...</p>
          </div>
        )}

        {videoInfo && (
          <div style={{ 
            padding: '30px 40px', 
            borderBottom: '1px solid #eee',
            background: '#f8f9fa'
          }}>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '600', 
              color: '#333',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Youtube size={20} color="#ff0000" />
              {videoInfo.title}
            </div>
            <div style={{ 
              color: '#666', 
              fontSize: '0.9rem',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} />
                {videoInfo.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {formatDuration(videoInfo.length)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={14} />
                {formatViews(videoInfo.views)}
              </span>
            </div>
          </div>
        )}

        {transcript && (
          <div style={{ 
            padding: '20px 40px', 
            background: '#f8f9fa',
            borderBottom: '1px solid #eee'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search transcript..."
                className="input"
                style={{ marginBottom: '15px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={exportTxt} className="btn btn-secondary">
                <Download size={14} />
                Export TXT
              </button>
              <button onClick={exportJson} className="btn btn-secondary">
                <Download size={14} />
                Export JSON
              </button>
              <button onClick={copyToClipboard} className="btn btn-secondary">
                <Copy size={14} />
                Copy All
              </button>
            </div>
            
            {searchTerm && (
              <p style={{ 
                marginTop: '10px', 
                color: '#666', 
                fontSize: '0.9rem' 
              }}>
                Showing {filteredTranscript.length} of {transcript.length} entries
              </p>
            )}
          </div>
        )}

        {transcript && (
          <div style={{ 
            maxHeight: '600px', 
            overflowY: 'auto', 
            padding: '40px' 
          }}>
            {filteredTranscript.map((item, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                  padding: '15px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderLeftColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }}
              >
                <div style={{
                  minWidth: '80px',
                  color: '#667eea',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginRight: '20px'
                }}>
                  {formatTime(item.start)}
                </div>
                <div style={{
                  flex: 1,
                  lineHeight: '1.6',
                  color: '#333'
                }}>
                  {item.text}
                </div>
              </div>
            ))}
            
            {filteredTranscript.length === 0 && searchTerm && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666' 
              }}>
                <Search size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ marginBottom: '8px' }}>No results found</h3>
                <p>Try searching with different keywords</p>
              </div>
            )}
          </div>
        )}

        {!transcript && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 40px', 
            color: '#6c757d' 
          }}>
            <Youtube size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '8px', color: '#495057' }}>
              Ready to Extract
            </h3>
            <p>Paste a YouTube URL above and click "Extract Transcript" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;