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
        migrations.AddField(
            model_name='metadatageneration',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='metadata_generations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='metadatatemplate',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='metadata_templates', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='metadatatemplate',
            unique_together={('user', 'name')},
        ),
    ]
