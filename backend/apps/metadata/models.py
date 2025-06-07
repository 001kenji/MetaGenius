from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class MetadataGeneration(models.Model):
    """
    Model to store metadata generation requests and results
    """
    PLATFORM_CHOICES = [
        ('youtube', 'YouTube'),
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='metadata_generations')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    input_text = models.TextField(help_text="User's input description for metadata generation")
    video_url = models.URLField(null=True, blank=True, help_text="Optional URL to the video")
    video_file = models.FileField(upload_to='videos/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Metadata results
    title = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    
    # Thumbnail - could be AI generated
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    
    # Error message if metadata generation fails
    error_message = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.platform} metadata for {self.user.username} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Metadata Generation")
        verbose_name_plural = _("Metadata Generations")


class MetadataTemplate(models.Model):
    """
    User-defined templates for metadata generation
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='metadata_templates')
    name = models.CharField(max_length=100)
    platform = models.CharField(max_length=20, choices=MetadataGeneration.PLATFORM_CHOICES)
    title_format = models.CharField(max_length=255, blank=True, help_text="Format for titles with placeholders")
    description_format = models.TextField(blank=True, help_text="Format for descriptions with placeholders")
    tags_template = models.JSONField(default=list, blank=True, help_text="Common tags to include")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.platform} template by {self.user.username}"
    
    class Meta:
        unique_together = ['user', 'name']
        ordering = ['name']
        verbose_name = _("Metadata Template")
        verbose_name_plural = _("Metadata Templates")