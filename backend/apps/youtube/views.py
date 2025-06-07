import os
import logging
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from .models import YouTubeAccount, YouTubeUpload, YouTubeQuota
from .serializers import (
    YouTubeAccountSerializer, 
    YouTubeUploadSerializer,
    YouTubeQuotaSerializer,
    YouTubeAccountInfoSerializer
)
from .tasks import upload_to_youtube_task

logger = logging.getLogger(__name__)

class YouTubeAccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint for YouTube account management
    """
    serializer_class = YouTubeAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return YouTubeAccount.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def auth_url(self, request):
        """
        Get the OAuth URL for authorizing with YouTube
        """
        try:
            # Create OAuth flow
            client_config = {
                "web": {
                    "client_id": os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
                    "client_secret": os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [os.getenv('GOOGLE_OAUTH_REDIRECT_URI')],
                }
            }
            
            # Set up the OAuth flow
            flow = InstalledAppFlow.from_client_config(
                client_config,
                scopes=['https://www.googleapis.com/auth/youtube.upload', 
                        'https://www.googleapis.com/auth/youtube.readonly']
            )
            
            # Generate the authorization URL
            flow.redirect_uri = os.getenv('GOOGLE_OAUTH_REDIRECT_URI')
            auth_url, _ = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'
            )
            
            return Response({"auth_url": auth_url})
        except Exception as e:
            logger.error(f"Error generating auth URL: {str(e)}")
            return Response(
                {"detail": "Failed to generate authorization URL"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def callback(self, request):
        """
        Handle OAuth callback and save the credentials
        """
        try:
            code = request.data.get('code')
            if not code:
                return Response(
                    {"detail": "Authorization code is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set up the OAuth flow
            client_config = {
                "web": {
                    "client_id": os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
                    "client_secret": os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [os.getenv('GOOGLE_OAUTH_REDIRECT_URI')],
                }
            }
            
            flow = InstalledAppFlow.from_client_config(
                client_config,
                scopes=['https://www.googleapis.com/auth/youtube.upload', 
                        'https://www.googleapis.com/auth/youtube.readonly']
            )
            flow.redirect_uri = os.getenv('GOOGLE_OAUTH_REDIRECT_URI')
            
            # Exchange authorization code for access tokens
            flow.fetch_token(code=code)
            credentials = flow.credentials
            
            # Use the credentials to get channel information
            youtube = build('youtube', 'v3', credentials=credentials)
            channels_response = youtube.channels().list(
                mine=True,
                part='snippet'
            ).execute()
            
            if not channels_response['items']:
                return Response(
                    {"detail": "No YouTube channel found for this account"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            channel = channels_response['items'][0]
            channel_id = channel['id']
            account_name = channel['snippet']['title']
            
            # Create or update the YouTube account
            account, created = YouTubeAccount.objects.update_or_create(
                user=request.user,
                channel_id=channel_id,
                defaults={
                    'account_name': account_name,
                    'access_token': credentials.token,
                    'refresh_token': credentials.refresh_token,
                    'token_expiry': credentials.expiry,
                    'is_active': True
                }
            )
            
            serializer = self.get_serializer(account)
            return Response(serializer.data, 
                           status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in OAuth callback: {str(e)}")
            return Response(
                {"detail": f"Authorization failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def info(self, request, pk=None):
        """
        Get detailed information about a YouTube account
        """
        account = self.get_object()
        
        try:
            # Create credentials from stored tokens
            credentials = Credentials(
                token=account.access_token,
                refresh_token=account.refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
                client_secret=os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
                expiry=account.token_expiry
            )
            
            # Get YouTube channel info
            youtube = build('youtube', 'v3', credentials=credentials)
            channel_response = youtube.channels().list(
                id=account.channel_id,
                part='snippet,statistics'
            ).execute()
            
            if not channel_response['items']:
                return Response(
                    {"detail": "YouTube channel not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            channel = channel_response['items'][0]
            
            # Prepare account info
            account_info = {
                'channel_id': channel['id'],
                'channel_title': channel['snippet']['title'],
                'subscriber_count': int(channel['statistics'].get('subscriberCount', 0)),
                'video_count': int(channel['statistics'].get('videoCount', 0)),
                'view_count': int(channel['statistics'].get('viewCount', 0))
            }
            
            serializer = YouTubeAccountInfoSerializer(account_info)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error getting account info: {str(e)}")
            return Response(
                {"detail": f"Failed to get account information: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class YouTubeUploadViewSet(viewsets.ModelViewSet):
    """
    API endpoint for YouTube video uploads
    """
    serializer_class = YouTubeUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return YouTubeUpload.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Save the upload request
        upload = serializer.save()
        
        # Queue the upload task
        upload_to_youtube_task.delay(upload.id)
        
        return upload
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """
        Get the status of a YouTube upload
        """
        upload = self.get_object()
        serializer = self.get_serializer(upload)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def quota(self, request):
        """
        Get the YouTube API quota usage for current user
        """
        # Get the user's active YouTube account
        try:
            account = YouTubeAccount.objects.filter(
                user=request.user, 
                is_active=True
            ).latest('updated_at')
            
            # Get latest quota info or create new one for today
            from datetime import date
            quota, _ = YouTubeQuota.objects.get_or_create(
                user=request.user,
                youtube_account=account,
                quota_date=date.today(),
                defaults={'units_used': 0, 'daily_limit': 10000}  # Default YouTube API quota
            )
            
            serializer = YouTubeQuotaSerializer(quota)
            return Response(serializer.data)
            
        except YouTubeAccount.DoesNotExist:
            return Response(
                {"detail": "No active YouTube account found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error getting quota info: {str(e)}")
            return Response(
                {"detail": f"Failed to get quota information: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )