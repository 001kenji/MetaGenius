from rest_framework import serializers
from .models import MetadataGeneration, MetadataTemplate


class MetadataGenerationSerializer(serializers.ModelSerializer):
    """
    Serializer for metadata generation requests
    """
    class Meta:
        model = MetadataGeneration
        fields = [
            'id', 'platform', 'input_text', 'video_url', 'video_file', 'status',
            'created_at', 'updated_at', 'title', 'description', 'tags', 'thumbnail',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'title', 'description', 'tags', 'thumbnail']
    
    def create(self, validated_data):
        # Set user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class MetadataResultSerializer(serializers.ModelSerializer):
    """
    Serializer for metadata generation results
    """
    class Meta:
        model = MetadataGeneration
        fields = [
            'id', 'platform', 'status', 'title', 'description', 'tags', 
            'thumbnail', 'created_at', 'updated_at'
        ]
        read_only_fields = fields


class MetadataTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for metadata templates
    """
    class Meta:
        model = MetadataTemplate
        fields = [
            'id', 'name', 'platform', 'title_format', 'description_format',
            'tags_template', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)