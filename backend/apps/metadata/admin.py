from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import MetadataGeneration, MetadataTemplate

User = get_user_model()


@admin.register(MetadataGeneration)
class MetadataGenerationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'platform', 'status', 'created_at')
    list_filter = ('platform', 'status', 'created_at')
    search_fields = ('user__username', 'input_text', 'title')
    raw_id_fields = ('user',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'platform', 'status', 'error_message')
        }),
        ('Input Data', {
            'fields': ('input_text', 'video_url', 'video_file'),
            'classes': ('collapse',)
        }),
        ('Generated Metadata', {
            'fields': ('title', 'description', 'tags', 'thumbnail'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['mark_as_completed', 'mark_as_failed']

    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected metadata generations as completed"

    def mark_as_failed(self, request, queryset):
        queryset.update(status='failed')
    mark_as_failed.short_description = "Mark selected metadata generations as failed"


@admin.register(MetadataTemplate)
class MetadataTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'platform', 'created_at')
    list_filter = ('platform', 'created_at')
    search_fields = ('name', 'user__username', 'title_format')
    raw_id_fields = ('user',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'platform')
        }),
        ('Template Content', {
            'fields': ('title_format', 'description_format', 'tags_template')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )