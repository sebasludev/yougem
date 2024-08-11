from flask import Blueprint, request, jsonify
from config.config import generate_chat
from youtube_transcript_api import YouTubeTranscriptApi

chat_bp = Blueprint('chat',__name__)

@chat_bp.route('/chat',methods=['POST'])
def start_chat():
    if request.method == "POST":
        try:
            req_body = request.get_json()
            content = req_body.get("contents")
            video_id = req_body.get("video_id")
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            transcript = transcript_list.find_transcript(['en', 'en-US'])
            if not transcript:
                transcript = transcript_list.find_transcript([])
            returned_transcript = transcript.fetch()
            
            system_instruction = req_body.get("system_instruction") + f"Here is the transcript of the video: ${str(returned_transcript)}, Analayze the transcript and answer any questions the student may have in the context of the video. " + "**. Respect the learner's perspective, acknowledge their feelings, and provide clear, concise explanations. Tailor your guidance to their specific learning style and pace. Be mindful of using inclusive language and avoiding assumptions about the learner's background or experience." + """return responses in Markdown format and in the same language that the user starts the conversation in."""

            stream = generate_chat(req_body.get("model"), content,system_instruction)
            return stream(), {'Content-Type': 'text/event-stream'}

        except Exception as e:
            return jsonify({ "error": str(e) })
