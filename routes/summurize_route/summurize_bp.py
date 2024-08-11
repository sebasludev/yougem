from flask import Blueprint, request, jsonify
from config.config import genai
from .history import history


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
  system_instruction="summurize model answer shortly each item in the JSON array and return in the following format: \n\n{\n   user_text : user text, \n   summury : model text\n   time : time \n}"
)




chat_summurize_bp = Blueprint('chat_summurize', __name__)

@chat_summurize_bp.route('/api/chat-summurize', methods=['POST'])
def process_chat_summurize():
    chat_session = model.start_chat(history=history)
    try:
        conversation = request.get_json()
        string_representation = str(conversation)

        response = chat_session.send_message(string_representation)
        processed_data = {
            "received_data": response.text,
            "message": "Data processed successfully",
            "status": 200,
        }   


        return processed_data, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
