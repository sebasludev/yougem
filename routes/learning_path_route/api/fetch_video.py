# from config.config import youtube

from googleapiclient.discovery import build
# YouTube API configuration
YOUTUBE_KEY = 'AIzaSyDlTAV0qz-wNnllLlvuu_znZtQEQRFdklQ'
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'

# Create YouTube API client
youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_KEY)

def fetch_youtube_video(query):
    try:
        search_response = youtube.search().list(
            q=query,
            type='video',
            part='id,snippet',
            maxResults=5,
            relevanceLanguage='en'
        ).execute()
        
        results = []
        if search_response['items']:
            for video in search_response['items']:
                video_id = video['id']['videoId']
                video_title = video['snippet']['title']
                channel_title = video['snippet']['channelTitle']
                thumbnail_url = video['snippet']['thumbnails']['default']['url']
                results.append({
                    'video_id': video_id,
                    'video_title': video_title,
                    'channel_title': channel_title,
                    'thumbnail_url': thumbnail_url
                })
            return results
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None