from flask import Blueprint, request, jsonify
from config.config import genai
from ..learning_path_route.api.fetch_video import fetch_youtube_video
from .history import filtering_history
 
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
  }

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction="Decide if the text is negative return true or false as value in a answer key",
)

search_bp = Blueprint('search', __name__) 

@search_bp.route('/', methods=['GET'])
def filter_query():
    query = request.args.get('q')
    chat_session = model.start_chat(history=filtering_history)
    response = chat_session.send_message(query)
    answer = response.text.split('"answer": ')[1].split('}')[0]
    if answer == 'true':
        return jsonify({'response':'Cant find videos'})
    else:
        return fetch_youtube_video(query)
