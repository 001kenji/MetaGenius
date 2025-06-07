import os
import logging
import time
from datetime import datetime, timezone
from celery import shared_task
from django.conf import settings
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from .models import YouTubeUpload, YouTubeAccount, YouTubeQuota
from datetime import date

logger = logging.getLogger(__name__)

@shared_task
def upload_to_youtube_task(upload_id):
    """
    Celery task for uploading a video to YouTube
    """
    try:
        # Get the upload request
        upload = YouTubeUpload.objects.get(id=upload_id)
        
        # Update status to processing
        upload.status = 'processing'
        upload.save()
        
        # Get YouTube account
        youtube_account = upload.youtube_account
        
        # Check if the credentials are valid
        if not youtube_account or not youtube_account.is_active:
            raise ValueError("No active YouTube account found")
        
        # Create credentials from stored tokens
        credentials = Credentials(
            token=youtube_account.access_token,
            refresh_token=youtube_account.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
            client_secret=os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
            expiry=youtube_account.token_expiry
        )
        
        # Refresh token if expired
        if credentials.expired:
            credentials.refresh(Request())
            youtube_account.access_token = credentials.token
            youtube_account.token_expiry = credentials.expiry
            youtube_account.save()
        
        # Create YouTube API client
        youtube = build('youtube', 'v3', credentials=credentials)
        
        # Update status to uploading
        upload.status = 'uploading'
        upload.save()
        
        # Prepare video metadata
        video_metadata = {
            'snippet': {
                'title': upload.video_title,
                'description': upload.video_description,
                'tags': upload.video_tags,
                'categoryId': upload.category_id
            },
            'status': {
                'privacyStatus': upload.privacy_status,
                'selfDeclaredMadeForKids': False
            }
        }
        
        # Upload video file
        file_path = upload.video_file.path
        media = MediaFileUpload(
            file_path,
            mimetype='video/*',
            resumable=True,
            chunksize=1024*1024  # 1MB chunks
        )
        
        # Insert video request
        insert_request = youtube.videos().insert(
            part=','.join(video_metadata.keys()),
            body=video_metadata,
            media_body=media
        )
        
        # Execute upload with progress tracking
        response = None
        while response is None:
            try:
                status, response = insert_request.next_chunk()
                if status:
                    logger.info(f"Uploaded {int(status.progress() * 100)}% of video {upload_id}")
            except HttpError as e:
                logger.error(f"Error uploading video: {str(e)}")
                upload.status = 'failed'
                upload.error_message = str(e)
                upload.save()
                return False
        
        # Update upload with YouTube video information
        youtube_video_id = response['id']
        youtube_video_url = f"https://www.youtube.com/watch?v={youtube_video_id}"
        
        upload.youtube_video_id = youtube_video_id
        upload.youtube_video_url = youtube_video_url
        upload.status = 'published'
        upload.save()
        
        # Upload thumbnail if available
        if upload.thumbnail:
            try:
                youtube.thumbnails().set(
                    videoId=youtube_video_id,
                    media_body=MediaFileUpload(upload.thumbnail.path)
                ).execute()
            except Exception as e:
                logger.error(f"Error uploading thumbnail: {str(e)}")
                # Not critical, so don't mark as failed
                
        # Update quota usage
        update_quota_usage(youtube_account, 1600)  # Video uploads cost ~1600 units
        
        return True
        
    except Exception as e:
        logger.error(f"Error during YouTube upload: {str(e)}")
        
        # Update upload with error
        try:
            upload = YouTubeUpload.objects.get(id=upload_id)
            upload.status = 'failed'
            upload.error_message = str(e)
            upload.save()
        except Exception as inner_e:
            logger.error(f"Error updating upload with failure status: {str(inner_e)}")
        
        return False


def update_quota_usage(youtube_account, units):
    """
    Update the YouTube API quota usage
    """
    try:
        today = date.today()
        quota, created = YouTubeQuota.objects.get_or_create(
            youtube_account=youtube_account,
            quota_date=today,
            defaults={
                'user': youtube_account.user,
                'units_used': 0
            }
        )
        
        # Add units to the usage
        quota.units_used += units
        quota.save()
        
        logger.info(f"YouTube API quota updated for {youtube_account.account_name}: {quota.units_used}/{quota.daily_limit}")
    except Exception as e:
        logger.error(f"Error updating quota usage: {str(e)}")