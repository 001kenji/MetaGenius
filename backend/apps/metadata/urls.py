from django.urls import path
from .views import (
    MetadataGenerationAPIView,
    MetadataGenerationResultAPIView,
    MetadataGenerationHistoryAPIView,
    MetadataTemplateAPIView,
    MetadataTemplateGenerateAPIView,
    GenerateThumbnailAPIView
)

urlpatterns = [
    # Metadata generation endpoints
    path('generate/', MetadataGenerationAPIView.as_view(), name='metadata-generate'),
    path('generate/<int:pk>/result/', MetadataGenerationResultAPIView.as_view(), name='metadata-result'),
    path('generate/history/', MetadataGenerationHistoryAPIView.as_view(), name='metadata-history'),
    
    # Template endpoints
    path('templates/', MetadataTemplateAPIView.as_view(), name='template-list'),
    path('templates/<int:pk>/', MetadataTemplateAPIView.as_view(), name='template-detail'),
    path('templates/<int:pk>/generate/', MetadataTemplateGenerateAPIView.as_view(), name='template-generate'),
    
    # Thumbnail generation
    path('generate-thumbnail/', GenerateThumbnailAPIView.as_view(), name='generate-thumbnail'),
]