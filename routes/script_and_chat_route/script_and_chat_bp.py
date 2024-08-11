from flask import Blueprint, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from config.config import generate_chat

script_episodes_bp = Blueprint('scriptchat', __name__) 

@script_episodes_bp.route('/api/scriptchat',methods=['POST'])
def set_chat():
    if request.method == "POST":
        try:
            req_body = request.get_json()
            id = req_body.get("video_id")
            content = req_body.get("contents")
            transcript_list = YouTubeTranscriptApi.list_transcripts(id)
            transcript = transcript_list.find_transcript(['en', 'en-US'])
            if not transcript:
                transcript = transcript_list.find_transcript([])
            returned_transcript = transcript.fetch()
            system_instruction = req_body.get("system_instruction") + f"Here is the transcript of the video: ${str(returned_transcript)}, Analayze the transcript and answer any questions the person may have in the context of the video. " + "**. Respect the person's perspective, acknowledge their feelings, and provide clear, concise explanations. Tailor your guidance to their specific learning style and pace. Be mindful of using inclusive language and avoiding assumptions about the learner's background or experience." + """return responses in Markdown format and in the same language that the user starts the conversation in."""
            
            stream = generate_chat("gemini-1.5-flash",content,system_instruction)
            return stream(), {'Content-Type': 'text/event-stream'}

        except Exception as e:
            return jsonify({ "error": str(e) })
  