from flask import Blueprint,request

from .genai_model import generate_learning_path_model
from .api.fetch_video import fetch_youtube_video

learn_bp = Blueprint('learn',__name__)
@learn_bp.route('/',methods=['GET'])
def learn():
    topic = request.args.get('topic')  
    if topic:
        res = fetch_youtube_video(topic)
        return res
    else:
        return generate_learning_path()
        

def generate_learning_path():
    query = request.args.get('subject')
    chat_session = generate_learning_path_model.start_chat(history=[])
    response = chat_session.send_message(query)
    return response.text
    