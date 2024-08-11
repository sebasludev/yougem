import os
import json

from googleapiclient.discovery import build
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv() 


# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_KEY"))

# YouTube API configuration
YOUTUBE_KEY = os.getenv("YOUTUBE_KEY")
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'

# Create YouTube API client
youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_KEY)


def generate_chat(model_name, content,system_instruction):
    model = genai.GenerativeModel(
      model_name=model_name,
      system_instruction=system_instruction
      )
    response = model.generate_content(content, stream=True)
    
    def stream():
        for chunk in response:
            yield 'data: %s\n\n' % json.dumps({"text": chunk.text})
    
    return stream