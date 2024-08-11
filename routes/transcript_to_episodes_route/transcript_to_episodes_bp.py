from flask import Blueprint, jsonify
from config.config import genai
from youtube_transcript_api import YouTubeTranscriptApi
from .history import transcript_to_episodes_history

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

transcript_to_episodes_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction="Analyze the following transcript and break it down into episodes. Return a summary, when the episode start and when the episode ends ."
)

transcript_to_episodes_bp = Blueprint('transcript_to_episodes', __name__) 


@transcript_to_episodes_bp.route('/api/transcript_to_episodes/<video_id>')
def get_episodes(video_id):
  try:
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    transcript = transcript_list.find_transcript(['en', 'en-US'])
    if not transcript:
      transcript = transcript_list.find_transcript([])
    returned_transcript = transcript.fetch()
    chat_session = transcript_to_episodes_model.start_chat(history=transcript_to_episodes_history)
    response = chat_session.send_message(str(returned_transcript))
    return jsonify(response.text)
  except:
    return jsonify({"error": "Transcript not available"}), 404
  
