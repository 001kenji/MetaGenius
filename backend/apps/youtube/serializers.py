from rest_framework import serializers
from .models import YouTubeAccount, YouTubeUpload, YouTubeQuota


class YouTubeAccountSerializer(serializers.ModelSerializer):
    """
    Serializer for YouTube account
    """
    class Meta:
        model = YouTubeAccount
        fields = [
            'id', 'account_name', 'channel_id', 'is_active', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'channel_id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class YouTubeUploadSerializer(serializers.ModelSerializer):
    """
    Serializer for YouTube video uploads
    """
    class Meta:
        model = YouTubeUpload
        fields = [
            'id', 'youtube_account', 'metadata', 'video_file',
            'video_title', 'video_description', 'video_tags',
            'thumbnail', 'privacy_status', 'category_id',
            'status', 'youtube_video_id', 'youtube_video_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'youtube_video_id', 'youtube_video_url',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Set user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class YouTubeQuotaSerializer(serializers.ModelSerializer):
    """
    Serializer for YouTube API quota information
    """
    class Meta:
        model = YouTubeQuota
        fields = [
            'id', 'youtube_account', 'units_used', 'daily_limit',
            'quota_date', 'created_at', 'updated_at'
        ]
        read_only_fields = fields


class YouTubeAccountInfoSerializer(serializers.Serializer):
    """
    Serializer for YouTube account information
    """
    channel_id = serializers.CharField()
    channel_title = serializers.CharField()
    subscriber_count = serializers.IntegerField()
    video_count = serializers.IntegerField()
    view_count = serializers.IntegerField()