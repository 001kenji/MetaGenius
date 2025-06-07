from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.throttling import UserRateThrottle
from .models import MetadataGeneration, MetadataTemplate
from .serializers import (
    MetadataGenerationSerializer,
    MetadataResultSerializer,
    MetadataTemplateSerializer
)
from django.shortcuts import get_object_or_404

from .tasks import generate_metadata_task

class DataThrottler(UserRateThrottle):
    scope = 'data'

class MetadataGenerationAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [DataThrottler]

    def post(self, request):
        """
        Create a new metadata generation request
        """
        print('request found')
        serializer = MetadataGenerationSerializer(data=request.data, context={'request': request})
        isvalid = serializer.is_valid()
        print(serializer,'\n\n',isvalid)
        if isvalid:
            print('processing')
            metadata_request = serializer.save()
            generate_metadata_task.delay(metadata_request.id)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MetadataGenerationResultAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        """
        Get metadata generation results
        """
        metadata = get_object_or_404(MetadataGeneration, pk=pk, user=request.user)
        if metadata.status != 'completed':
            return Response(
                {"detail": f"Metadata generation is {metadata.status}"},
                status=status.HTTP_202_ACCEPTED
            )
        serializer = MetadataResultSerializer(metadata)
        return Response(serializer.data)

class MetadataGenerationHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Get user's metadata generation history
        """
        queryset = MetadataGeneration.objects.filter(user=request.user).order_by('-created_at')
        serializer = MetadataGenerationSerializer(queryset, many=True)
        return Response(serializer.data)

class MetadataTemplateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [DataThrottler]

    def get(self, request):
        """
        Get all templates for the current user
        """
        templates = MetadataTemplate.objects.filter(user=request.user)
        serializer = MetadataTemplateSerializer(templates, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Create a new template
        """
        serializer = MetadataTemplateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update an existing template
        """
        template = get_object_or_404(MetadataTemplate, pk=pk, user=request.user)
        serializer = MetadataTemplateSerializer(template, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a template
        """
        template = get_object_or_404(MetadataTemplate, pk=pk, user=request.user)
        template.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MetadataTemplateGenerateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """
        Generate metadata using a specific template
        """
        template = get_object_or_404(MetadataTemplate, pk=pk, user=request.user)
        print(request.data)
        input_text = request.data.get('description')
        platform = request.data.get('platform')
        
        if not input_text:
            return Response(
                {"detail": "Input text is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        metadata_request = MetadataGeneration.objects.create(
            user=request.user,
            platform=platform,
            input_text=input_text
        )
        
        generate_metadata_task.delay(metadata_request.id, template_id=template.id)
        
        serializer = MetadataGenerationSerializer(metadata_request)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

class GenerateThumbnailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """
        Generate AI thumbnail for video
        """
        title = request.data.get('title')
        description = request.data.get('description')
        
        # Your thumbnail generation logic here
        # ...
        
        return Response({"thumbnail_url": "generated_thumbnail_url"}, status=status.HTTP_200_OK)