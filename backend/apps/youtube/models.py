from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from apps.metadata.models import MetadataGeneration

User = get_user_model()


class YouTubeAccount(models.Model):
    """
    Model to store YouTube account credentials and info
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='youtube_accounts')
    account_name = models.CharField(max_length=100)
    channel_id = models.CharField(max_length=100, blank=True)
    
    # OAuth credentials
    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expiry = models.DateTimeField()
    
    # Account status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.account_name} - {self.user.username}"
    
    class Meta:
        verbose_name = _("YouTube Account")
        verbose_name_plural = _("YouTube Accounts")


class YouTubeUpload(models.Model):
    """
    Model to track YouTube video uploads
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('uploading', 'Uploading'),
        ('published', 'Published'),
        ('failed', 'Failed'),
    ]
    
    PRIVACY_CHOICES = [
        ('private', 'Private'),
        ('unlisted', 'Unlisted'),
        ('public', 'Public'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='youtube_uploads')
    youtube_account = models.ForeignKey(YouTubeAccount, on_delete=models.CASCADE, related_name='uploads')
    metadata = models.ForeignKey(MetadataGeneration, on_delete=models.SET_NULL, null=True, related_name='youtube_uploads')
    
    # Video information
    video_file = models.FileField(upload_to='videos/', null=True)
    video_title = models.CharField(max_length=100)
    video_description = models.TextField()
    video_tags = models.JSONField(default=list, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    
    # YouTube video details
    youtube_video_id = models.CharField(max_length=20, blank=True)
    youtube_video_url = models.URLField(blank=True)
    
    # Upload settings
    privacy_status = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='private')
    category_id = models.CharField(max_length=10, default='22')  # 22 is "People & Blogs"
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.video_title} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _("YouTube Upload")
        verbose_name_plural = _("YouTube Uploads")


class YouTubeQuota(models.Model):
    """
    Model to track YouTube API quota usage
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='youtube_quotas')
    youtube_account = models.ForeignKey(YouTubeAccount, on_delete=models.CASCADE, related_name='quotas')
    
    # Quota info
    units_used = models.IntegerField(default=0)
    daily_limit = models.IntegerField(default=10000)  # Default YouTube API quota
    
    # Date info
    quota_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Quota for {self.youtube_account.account_name} on {self.quota_date}"
    
    class Meta:
        unique_together = ['youtube_account', 'quota_date']
        verbose_name = _("YouTube Quota")
        verbose_name_plural = _("YouTube Quotas")