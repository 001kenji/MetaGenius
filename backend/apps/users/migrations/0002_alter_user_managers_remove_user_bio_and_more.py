# Generated by Django 5.1.7 on 2025-06-06 11:53

import apps.users.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', apps.users.models.UserManager()),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='bio',
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AddField(
            model_name='user',
            name='google_id',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(blank=True, max_length=150, verbose_name='full name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.CreateModel(
            name='SocialToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider', models.CharField(max_length=50)),
                ('token', models.TextField()),
                ('token_secret', models.TextField(blank=True, null=True)),
                ('expires_at', models.DateTimeField(blank=True, null=True)),
                ('refresh_token', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_tokens', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'provider')},
            },
        ),
    ]
