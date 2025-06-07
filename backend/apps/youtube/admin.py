from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import YouTubeAccount, YouTubeUpload, YouTubeQuota

User = get_user_model()


@admin.register(YouTubeAccount)
class YouTubeAccountAdmin(admin.ModelAdmin):
    list_display = ('account_name', 'user', 'channel_id', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('account_name', 'channel_id', 'user__username')
    raw_id_fields = ('user',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'account_name', 'channel_id', 'is_active')
        }),
        ('OAuth Credentials', {
            'fields': ('access_token', 'refresh_token', 'token_expiry'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(YouTubeUpload)
class YouTubeUploadAdmin(admin.ModelAdmin):
    list_display = ('video_title', 'user', 'youtube_account', 'status', 'privacy_status', 'created_at')
    list_filter = ('status', 'privacy_status', 'created_at')
    search_fields = ('video_title', 'youtube_video_id', 'user__username', 'youtube_account__account_name')
    raw_id_fields = ('user', 'youtube_account', 'metadata')
    readonly_fields = ('created_at', 'updated_at', 'youtube_video_id', 'youtube_video_url')
    fieldsets = (
        (None, {
            'fields': ('user', 'youtube_account', 'metadata', 'status', 'error_message')
        }),
        ('Video Information', {
            'fields': ('video_file', 'video_title', 'video_description', 'video_tags', 'thumbnail')
        }),
        ('YouTube Details', {
            'fields': ('youtube_video_id', 'youtube_video_url')
        }),
        ('Upload Settings', {
            'fields': ('privacy_status', 'category_id'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(YouTubeQuota)
class YouTubeQuotaAdmin(admin.ModelAdmin):
    list_display = ('youtube_account', 'quota_date', 'units_used', 'daily_limit')
    list_filter = ('quota_date',)
    search_fields = ('youtube_account__account_name', 'user__username')
    raw_id_fields = ('user', 'youtube_account')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'youtube_account', 'quota_date')
        }),
        ('Quota Information', {
            'fields': ('units_used', 'daily_limit')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )