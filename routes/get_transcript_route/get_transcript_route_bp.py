from flask import Blueprint, jsonify
from youtube_transcript_api import YouTubeTranscriptApi

get_transcript_bp = Blueprint('get_transcript', __name__) 

@get_transcript_bp.route('/api/get_transcript/<video_id>')
def get_transcript(video_id):
  try:
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    transcript = transcript_list.find_transcript(['en', 'en-US'])
    if not transcript:
      transcript = transcript_list.find_transcript([])
    return jsonify(transcript.fetch())
  except:
    return jsonify({"error": "Transcript not available"}), 404
    
