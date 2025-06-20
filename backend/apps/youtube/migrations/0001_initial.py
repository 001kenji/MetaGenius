# Generated by Django 5.1.7 on 2025-06-05 07:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('metadata', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='YouTubeAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account_name', models.CharField(max_length=100)),
                ('channel_id', models.CharField(blank=True, max_length=100)),
                ('access_token', models.TextField()),
                ('refresh_token', models.TextField()),
                ('token_expiry', models.DateTimeField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='youtube_accounts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'YouTube Account',
                'verbose_name_plural': 'YouTube Accounts',
            },
        ),
        migrations.CreateModel(
            name='YouTubeUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_file', models.FileField(null=True, upload_to='videos/')),
                ('video_title', models.CharField(max_length=100)),
                ('video_description', models.TextField()),
                ('video_tags', models.JSONField(blank=True, default=list)),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='thumbnails/')),
                ('youtube_video_id', models.CharField(blank=True, max_length=20)),
                ('youtube_video_url', models.URLField(blank=True)),
                ('privacy_status', models.CharField(choices=[('private', 'Private'), ('unlisted', 'Unlisted'), ('public', 'Public')], default='private', max_length=10)),
                ('category_id', models.CharField(default='22', max_length=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('uploading', 'Uploading'), ('published', 'Published'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('error_message', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('metadata', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='youtube_uploads', to='metadata.metadatageneration')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='youtube_uploads', to=settings.AUTH_USER_MODEL)),
                ('youtube_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploads', to='youtube.youtubeaccount')),
            ],
            options={
                'verbose_name': 'YouTube Upload',
                'verbose_name_plural': 'YouTube Uploads',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='YouTubeQuota',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('units_used', models.IntegerField(default=0)),
                ('daily_limit', models.IntegerField(default=10000)),
                ('quota_date', models.DateField(auto_now_add=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='youtube_quotas', to=settings.AUTH_USER_MODEL)),
                ('youtube_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quotas', to='youtube.youtubeaccount')),
            ],
            options={
                'verbose_name': 'YouTube Quota',
                'verbose_name_plural': 'YouTube Quotas',
                'unique_together': {('youtube_account', 'quota_date')},
            },
        ),
    ]
