# YouGem | A webapp powered by Google Gemini AI

Note: Before starting, i whould like to mention that i will continue working on the project of a different repo, to work on performance and polish the UI, thanks.

## Description

This webapp is my first project i ever build, it is also a project for Google AI developer competition.
The webapp is a solution to a problem i had when trying to study web development in Youtube. i always needed to go back and fourth between gemini,google and Youtube to understand what i was seeing in the video. so i decided to try and create a webapp that bring Youtube and Gemini AI to work together in the same place to make my learning more productive and streightforword.

Technologies:
    - Flask
    - React
    - Google Gemini AI

## Project Structure

```
project_root/
│
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│   ├── server.py
│   ├── config/
│   │   ├── config.py
│   └── routes/
│       ├── chat_route/
│           └── chat_bp.py
│       ├── get_transcript_route/
│           └── get_transcript_bp.py
│       ├── learning_path_route/
│           ├── api/
│               └── fetch_video.py
│           ├── genai_model.py
│           └── learning_path.py
│       ├── script_and_chat_route/
│           └── script_and_chat_bp.py
│       ├── search_route/
│           ├── history.py
│           └── search_bp.py
│       ├── summurize_route/
│           ├── history.py
│           └── summurize_bp.py
│       └── transcript_to_episodes_route/
│           ├── history.py
│           └── transcript_to_episodes_bp.py
│
│    ├── client/
│       ├── src/
│           ├── api/
│               ├── gemini_two.js
│               └── gemini.js
│           ├── assets/
│           ├── components/
│           ├── context/
│           ├── pages/
│           ├── App.css
│           ├── index.css
│           ├── main.jsx
│           ├── assets/
│           └── components/
│       ├── public/
│       ├── package.json
│       ├── vite.config.js
│       └── .gitignore
│
│    └── README.md
```

## Installation and Setup

### Backend (Flask)

1. Create a virtual environment:

   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:

     ```
     .venv\Scripts\activate
     ```

   - On macOS and Linux:

     ```
     source .venv/bin/activate
     ```

3. Install the required packages:

   ```
   pip install -r requirements.txt
   ```

4. Set up the `.env` file:

   ```
   GEMINI_KEY = your_gemini_api_key
   YOUTUBE_KEY = your_youtube_api_key
   ```

5. Run the Flask application:

   ```
   python server.py
   ```

The backend should now be running on `http://localhost:5000`.

### Frontend (React-Vite)

1. Navigate to the frontend directory:

   ```
   cd client
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

The frontend should now be running on `http://localhost:5173`.

## Usage

- The Flask backend will be serving your API endpoints at `http://localhost:5000`.
- The React frontend will be available at `http://localhost:5173`.
- Cors are handled automatically by the Flask backend.

## API Documentation

All endpoints are prefixed with /api/v1.

### Endpoints

## Start Chat API Documentation

Initiates a chat session based on a YouTube video transcript and user input.

### Endpoint

`POST /api/chat`

### Request Body

| Field | Type | Description |
|-------|------|-------------|
| `contents` | string | The user's input or question |
| `video_id` | string | YouTube video ID to fetch the transcript |
| `system_instruction` | string | Additional instructions for the chat model |
| `model` | string | The name or identifier of the chat model to use |

Example:

```json
{
  "contents": "Can you explain the main points of the video?",
  "video_id": "dQw4w9WgXcQ",
  "system_instruction": "Provide a summary of the key topics discussed in the video.",
  "model": "gpt-3.5-turbo"
}
```

### Success Response

- **Code**: 200 OK
- **Content-Type**: `text/event-stream`
- **Content**: A stream of events containing the generated chat responses

### Error Response

- **Code**: 400 Bad Request
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "error": "Description of the error"
  }
  ```

### Notes

1. The API fetches the transcript of the specified YouTube video using the `YouTubeTranscriptApi`.
2. If an English transcript is not available, it will attempt to find a transcript in any available language.
3. The system instruction is augmented with the video transcript and additional guidelines for the AI's behavior.
4. Responses are generated in Markdown format.
5. The API will respond in the same language that the user initiates the conversation in.

### Example Usage

```python
import requests

url = "https://your-api-domain.com/api/chat"
payload = {
    "contents": "What are the key points discussed in this video?",
    "video_id": "dQw4w9WgXcQ",
    "system_instruction": "Provide a concise summary of the main topics.",
    "model": "gpt-3.5-turbo"
}

response = requests.post(url, json=payload)

if response.headers.get('Content-Type') == 'text/event-stream':
    for line in response.iter_lines():
        if line:
            print(line.decode('utf-8'))
else:
    print(response.json())
```

# Get Transcript API Documentation

## Retrieve YouTube Video Transcript

Fetches the transcript of a specified YouTube video.

### Endpoint

`GET /api/get_transcript/<video_id>`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `video_id` | string | The YouTube video ID for which to retrieve the transcript |

### Success Response

- **Code**: 200 OK
- **Content-Type**: `application/json`
- **Content**: An array of transcript segments

Example:

```json
[
  {
    "text": "Hello and welcome to this video.",
    "start": 0.0,
    "duration": 2.5
  },
  {
    "text": "Today we're going to discuss...",
    "start": 2.5,
    "duration": 3.0
  },
  ...
]
```

Each segment in the array contains:

- `text`: The transcribed text
- `start`: The start time of the segment in seconds
- `duration`: The duration of the segment in seconds

### Error Response

- **Code**: 404 Not Found
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "error": "Transcript not available"
  }
  ```

### Notes

1. The API first attempts to find an English transcript (either 'en' or 'en-US').
2. If an English transcript is not available, it will attempt to find a transcript in any available language.
3. If no transcript is available or if there's an error in fetching the transcript, a 404 error is returned.

### Example Usage

```python
import requests

video_id = "dQw4w9WgXcQ"
url = f"https://your-api-domain.com/api/get_transcript/{video_id}"

response = requests.get(url)

if response.status_code == 200:
    transcript = response.json()
    for segment in transcript:
        print(f"{segment['start']}: {segment['text']}")
else:
    print(f"Error: {response.json()['error']}")
```

# Learn API Documentation

## Fetch Video or Generate Learning Path

This endpoint either fetches a YouTube video based on a given topic or generates a learning path based on a subject.

### Endpoint

`GET /api/learn`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `topic` | string | (Optional) The topic to search for a YouTube video |
| `subject` | string | (Optional) The subject for generating a learning path |

### Functionality

1. If a `topic` is provided, the API fetches a relevant YouTube video.
2. If no `topic` is provided but a `subject` is, the API generates a learning path.

### Success Responses

#### 1. Fetching YouTube Video

When a `topic` is provided:

- **Code**: 200 OK
- **Content-Type**: `application/json`
- **Content**: Details of the fetched YouTube video

Example:

```json
{
  "video_id": "dQw4w9WgXcQ",
  "title": "Video Title",
  "description": "Video Description",
  "thumbnail_url": "https://example.com/thumbnail.jpg"
}
```

Note: The exact structure of this response may vary based on the implementation of `fetch_youtube_video()`.

#### 2. Generating Learning Path

When no `topic` is provided, but a `subject` is:

- **Code**: 200 OK
- **Content-Type**: `text/plain`
- **Content**: A text description of the generated learning path

Example:

```
1. Introduction to [Subject]
2. Key Concepts of [Subject]
3. Advanced Topics in [Subject]
4. Practical Applications of [Subject]
5. Further Resources and Next Steps
```

Note: The exact format and content of the learning path will depend on the implementation of the `generate_learning_path_model`.

### Error Responses

- **Code**: 400 Bad Request
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "error": "Missing required parameters"
  }
  ```

### Example Usage

1. Fetching a YouTube video:

```
GET /api/learn?topic=machine%20learning
```

2. Generating a learning path:

```
GET /api/learn?subject=data%20science
```

# Script Chat API Documentation

## Initiate Chat Session with Video Context

This endpoint initiates a chat session that incorporates the transcript of a specified YouTube video into the conversation context.

### Endpoint

`POST /api/scriptchat`

### Request Body

| Field | Type | Description |
|-------|------|-------------|
| `video_id` | string | The YouTube video ID to fetch the transcript |
| `contents` | string | The user's input or question |
| `system_instruction` | string | Additional instructions for the chat model |

Example:

```json
{
  "video_id": "dQw4w9WgXcQ",
  "contents": "Can you summarize the main points of the video?",
  "system_instruction": "Provide a concise summary of the key topics discussed."
}
```

### Success Response

- **Code**: 200 OK
- **Content-Type**: `text/event-stream`
- **Content**: A stream of events containing the generated chat responses

### Error Response

- **Code**: 400 Bad Request
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "error": "Description of the error"
  }
  ```

### Notes

1. The API fetches the transcript of the specified YouTube video using the `YouTubeTranscriptApi`.
2. It prioritizes English transcripts (either 'en' or 'en-US'), but falls back to other available languages if necessary.
3. The system instruction is augmented with the video transcript and additional guidelines for the AI's behavior.
4. The chat model used is "gemini-1.5-flash".
5. Responses are generated in Markdown format.
6. The API will respond in the same language that the user initiates the conversation in.

### Example Usage

```python
import requests
import sseclient

url = "https://your-api-domain.com/api/scriptchat"
payload = {
    "video_id": "dQw4w9WgXcQ",
    "contents": "What are the key points discussed in this video?",
    "system_instruction": "Provide a concise summary of the main topics."
}

response = requests.post(url, json=payload, stream=True)

if response.headers.get('Content-Type') == 'text/event-stream':
    client = sseclient.SSEClient(response)
    for event in client.events():
        print(event.data)
else:
    print(response.json())
```

# Search API Documentation

## Content-Filtered Video Search

This endpoint performs a content filter on the provided query and, if approved, fetches relevant YouTube videos.

### Endpoint

`GET /api/search`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | The search query for videos |

### Functionality

1. The API first checks the query for potentially negative content using a generative AI model.
2. If the query is deemed appropriate, it fetches relevant YouTube videos.
3. If the query is flagged as inappropriate, it returns a message indicating no videos can be found.

### Success Responses

#### 1. Query Approved and Videos Found

- **Code**: 200 OK
- **Content-Type**: `application/json`
- **Content**: Details of the fetched YouTube videos

Example:

```json
{
  "videos": [
    {
      "video_id": "dQw4w9WgXcQ",
      "title": "Video Title",
      "description": "Video Description",
      "thumbnail_url": "https://example.com/thumbnail.jpg"
    },
    // ... more video objects
  ]
}
```

Note: The exact structure of this response may vary based on the implementation of `fetch_youtube_video()`.

#### 2. Query Flagged as Inappropriate

- **Code**: 200 OK
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "response": "Cant find videos"
  }
  ```

### Error Response

- **Code**: 400 Bad Request
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "error": "Missing query parameter"
  }
  ```

### Example Usage

```python
import requests

url = "https://your-api-domain.com/api/search"
params = {"q": "educational science videos"}

response = requests.get(url, params=params)

if response.status_code == 200:
    data = response.json()
    if "videos" in data:
        for video in data["videos"]:
            print(f"Title: {video['title']}")
            print(f"Video ID: {video['video_id']}")
    else:
        print(data["response"])
else:
    print(f"Error: {response.json()['error']}")
```

### Notes

1. The API uses a generative AI model ("gemini-1.5-flash") to filter queries for negative content.
2. The filtering process uses a predefined system instruction and chat history (`filtering_history`).
3. If the query is flagged as inappropriate, no videos will be fetched, and a standard response is returned.
4. The actual video fetching is performed by the `fetch_youtube_video()` function, which is not detailed in this endpoint's code.

# Chat Summarize API Documentation

## Summarize Chat Conversation

This endpoint processes a chat conversation and provides a summary of each item in the conversation using a generative AI model.

### Endpoint

`POST /api/chat-summurize`

### Request Body

The request body should contain a JSON representation of the chat conversation. The exact structure is flexible, but it should be convertible to a string representation.

Example:

```json
[
  {"role": "user", "content": "Hello, can you help me with Python?"},
  {"role": "assistant", "content": "Of course! I'd be happy to help. What specific aspect of Python do you need assistance with?"},
  {"role": "user", "content": "I'm struggling with list comprehensions. Can you explain them?"}
]
```

### Success Response

- **Code**: 200 OK
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "received_data": [
      {
        "user_text": "Hello, can you help me with Python?",
        "summary": "User asks for help with Python",
        "time": "[timestamp]"
      },
      {
        "user_text": "I'm struggling with list comprehensions. Can you explain them?",
        "summary": "User requests explanation of list comprehensions in Python",
        "time": "[timestamp]"
      }
    ],
    "message": "Data processed successfully",
    "status": 200
  }
  ```

### Error Response

- **Code**: 400 Bad Request
- **Content-Type**: `application/json`
- **Content**:

  ```json
  {
    "error": "Description of the error"
  }
  ```

### Notes

1. The API uses a generative AI model ("gemini-1.5-flash") to process and summarize the conversation.
2. The model is configured with specific generation parameters (temperature, top_p, top_k, etc.) for consistent output.
3. The system instruction for the model specifies the output format, including user text, summary, and timestamp for each item.
4. The API processes the entire conversation history provided in the request.

### Example Usage

```python
import requests
import json

url = "https://your-api-domain.com/api/chat-summurize"
headers = {"Content-Type": "application/json"}

conversation = [
    {"role": "user", "content": "Hello, can you help me with Python?"},
    {"role": "assistant", "content": "Of course! I'd be happy to help. What specific aspect of Python do you need assistance with?"},
    {"role": "user", "content": "I'm struggling with list comprehensions. Can you explain them?"}
]

response = requests.post(url, headers=headers, data=json.dumps(conversation))

if response.status_code == 200:
    data = response.json()
    for item in data["received_data"]:
        print(f"User: {item['user_text']}")
        print(f"Summary: {item['summary']}")
        print(f"Time: {item['time']}\n")
else:
    print(f"Error: {response.json()['error']}")
```
