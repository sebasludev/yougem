from flask import Flask
from flask_cors import CORS
from routes.search_route.search_bp import search_bp
from routes.chat_route.chat_bp import chat_bp
from routes.learning_path_route.learning_path_bp import learn_bp
from routes.summurize_route.summurize_bp import chat_summurize_bp
from routes.script_and_chat_route.script_and_chat_bp import script_episodes_bp
from routes.transcript_to_episodes_route.transcript_to_episodes_bp import transcript_to_episodes_bp
from routes.get_transcript_route.get_transcript_route_bp import get_transcript_bp

app = Flask(__name__)
CORS(app,resources={r"/api/*": {"origins": "http://localhost:5173"}})

app.register_blueprint(search_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(learn_bp)
app.register_blueprint(chat_summurize_bp)
app.register_blueprint(transcript_to_episodes_bp)
app.register_blueprint(get_transcript_bp)
app.register_blueprint(script_episodes_bp)


if __name__ == '__main__':
    app.run(debug=True)
    
