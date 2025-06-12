from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
import re
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def extract_video_id(url):
    """Extract YouTube video ID from various URL formats"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)',
        r'youtube\.com\/watch\?.*v=([^&\n?#]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_video_metadata(video_id):
    """Get video metadata using pytube"""
    try:
        yt = YouTube(f'https://www.youtube.com/watch?v={video_id}')
        return {
            'title': yt.title,
            'author': yt.author,
            'length': yt.length,
            'views': yt.views,
            'publish_date': yt.publish_date.isoformat() if yt.publish_date else None,
            'description': yt.description[:500] + '...' if len(yt.description) > 500 else yt.description
        }
    except Exception as e:
        logger.warning(f"Could not fetch metadata for {video_id}: {str(e)}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'YouTube Transcript API'
    })

@app.route('/api/transcript', methods=['POST'])
def get_transcript():
    """Extract transcript from YouTube video"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': 'URL is required',
                'code': 'MISSING_URL'
            }), 400
        
        url = data['url'].strip()
        video_id = extract_video_id(url)
        
        if not video_id:
            return jsonify({
                'error': 'Invalid YouTube URL format',
                'code': 'INVALID_URL'
            }), 400
        
        logger.info(f"Extracting transcript for video ID: {video_id}")
        
        # Get transcript
        try:
            # Try to get transcript in preferred languages
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try to find English transcript first
            transcript = None
            try:
                transcript = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
            except:
                # If no English transcript, get the first available one
                available_transcripts = list(transcript_list)
                if available_transcripts:
                    transcript = available_transcripts[0]
                else:
                    raise Exception("No transcripts available")
            
            # Fetch the actual transcript data
            transcript_data = transcript.fetch()
            
            # Format transcript data
            formatted_transcript = []
            
            for entry in transcript_data:
                # The youtube-transcript-api returns FetchedTranscriptSnippet objects
                # Extract the attributes from the object
                formatted_transcript.append({
                    'start': round(entry.start, 2),
                    'duration': round(entry.duration, 2),
                    'text': entry.text.strip()
                })
            
            # Get video metadata
            metadata = get_video_metadata(video_id)
            
            return jsonify({
                'success': True,
                'video_id': video_id,
                'transcript': formatted_transcript,
                'metadata': metadata,
                'language': transcript.language,
                'is_generated': transcript.is_generated,
                'total_entries': len(formatted_transcript)
            })
            
        except Exception as transcript_error:
            logger.error(f"Transcript extraction failed for {video_id}: {str(transcript_error)}")
            
            # Try to get video metadata even if transcript fails
            metadata = get_video_metadata(video_id)
            
            return jsonify({
                'error': 'Could not extract transcript',
                'details': str(transcript_error),
                'code': 'TRANSCRIPT_UNAVAILABLE',
                'video_id': video_id,
                'metadata': metadata,
                'suggestions': [
                    'This video may not have captions available',
                    'The video might be private or restricted',
                    'Try with a different YouTube video that has captions'
                ]
            }), 404
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e),
            'code': 'INTERNAL_ERROR'
        }), 500

@app.route('/api/video-info', methods=['POST'])
def get_video_info():
    """Get video metadata without transcript"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': 'URL is required',
                'code': 'MISSING_URL'
            }), 400
        
        url = data['url'].strip()
        video_id = extract_video_id(url)
        
        if not video_id:
            return jsonify({
                'error': 'Invalid YouTube URL format',
                'code': 'INVALID_URL'
            }), 400
        
        metadata = get_video_metadata(video_id)
        
        if not metadata:
            return jsonify({
                'error': 'Could not fetch video information',
                'code': 'VIDEO_UNAVAILABLE',
                'video_id': video_id
            }), 404
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'metadata': metadata
        })
        
    except Exception as e:
        logger.error(f"Video info error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e),
            'code': 'INTERNAL_ERROR'
        }), 500

@app.route('/api/available-languages', methods=['POST'])
def get_available_languages():
    """Get available transcript languages for a video"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': 'URL is required',
                'code': 'MISSING_URL'
            }), 400
        
        url = data['url'].strip()
        video_id = extract_video_id(url)
        
        if not video_id:
            return jsonify({
                'error': 'Invalid YouTube URL format',
                'code': 'INVALID_URL'
            }), 400
        
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        languages = []
        for transcript in transcript_list:
            languages.append({
                'language': transcript.language,
                'language_code': transcript.language_code,
                'is_generated': transcript.is_generated,
                'is_translatable': transcript.is_translatable
            })
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'available_languages': languages
        })
        
    except Exception as e:
        logger.error(f"Languages error: {str(e)}")
        return jsonify({
            'error': 'Could not fetch available languages',
            'details': str(e),
            'code': 'LANGUAGES_UNAVAILABLE',
            'video_id': video_id if 'video_id' in locals() else None
        }), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)