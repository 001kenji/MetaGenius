import os
import json
import logging
from celery import shared_task
from django.conf import settings
import openai
from .models import MetadataGeneration, MetadataTemplate

logger = logging.getLogger(__name__)

@shared_task
def generate_metadata_task(metadata_id, template_id=None):
    """
    Celery task for generating metadata using OpenAI
    """
    try:
        # Get the metadata generation request
        metadata = MetadataGeneration.objects.get(id=metadata_id)
        
        # Update status to processing
        metadata.status = 'processing'
        metadata.save()
        
        # Get template if provided
        template = None
        if template_id:
            try:
                template = MetadataTemplate.objects.get(id=template_id, user=metadata.user)
            except MetadataTemplate.DoesNotExist:
                logger.warning(f"Template with id {template_id} not found")
        
        # Generate metadata using OpenAI
        result = generate_metadata_with_openai(metadata, template)
        
        # Update metadata with generated content
        metadata.title = result.get('title')
        metadata.description = result.get('description')
        metadata.tags = result.get('tags', [])
        metadata.status = 'completed'
        metadata.save()
        
        # Generate thumbnail if needed (not implemented here)
        # For real implementation, use a separate task
        # generate_thumbnail_task.delay(metadata_id)
        
        return True
        
    except Exception as e:
        logger.error(f"Error generating metadata: {str(e)}")
        
        # Update metadata with error
        try:
            metadata = MetadataGeneration.objects.get(id=metadata_id)
            metadata.status = 'failed'
            metadata.error_message = str(e)
            metadata.save()
        except Exception as inner_e:
            logger.error(f"Error updating metadata with failure status: {str(inner_e)}")
        
        return False


def generate_metadata_with_openai(metadata, template=None):
    """
    Generate metadata using OpenAI API
    """
    # Set up OpenAI client
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        raise ValueError("OpenAI API key not configured")
    
    client = openai.OpenAI(api_key=api_key)
    
    # Prepare the prompt based on platform and template
    platform = metadata.platform
    input_text = metadata.input_text
    
    # Apply template formatting if provided
    template_info = ""
    if template:
        template_info = f"""
        Using the template named '{template.name}':
        - Title format: {template.title_format if template.title_format else 'No specific format'}
        - Description format: {template.description_format if template.description_format else 'No specific format'}
        - Common tags to include: {', '.join(template.tags_template) if template.tags_template else 'No specific tags'}
        """
    
    # Build the prompt
    prompt = f"""
    Generate engaging metadata for a {platform} video with the following description:
    
    {input_text}
    
    {template_info}
    
    Please provide:
    1. An attention-grabbing title (max 100 characters for YouTube)
    2. An engaging description with relevant keywords naturally incorporated
    3. A list of relevant hashtags/tags (max 10)
    
    Format your response as a JSON object with the following structure:
    {{
        "title": "Your generated title here",
        "description": "Your generated description here",
        "tags": ["tag1", "tag2", "tag3", ...]
    }}
    
    Make sure the content is optimized for {platform}'s search algorithm and audience preferences.
    """
    
    # Make the API call
    response = client.chat.completions.create(
        model="gpt-4-turbo",  # or another appropriate model
        messages=[
            {"role": "system", "content": "You are an expert social media marketer specializing in creating metadata that maximizes engagement and discoverability."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    # Extract and parse the response
    try:
        result_text = response.choices[0].message.content
        result = json.loads(result_text)
        
        # Validate the result structure
        if not all(key in result for key in ["title", "description", "tags"]):
            logger.warning(f"Missing keys in OpenAI response: {result}")
            # Add missing keys with default values
            if "title" not in result:
                result["title"] = "Untitled"
            if "description" not in result:
                result["description"] = ""
            if "tags" not in result:
                result["tags"] = []
        
        return result
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing OpenAI response: {str(e)}")
        raise ValueError(f"Invalid response from OpenAI API: {str(e)}")