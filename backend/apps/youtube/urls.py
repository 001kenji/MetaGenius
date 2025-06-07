from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import YouTubeAccountViewSet, YouTubeUploadViewSet

router = DefaultRouter()
router.register('accounts', YouTubeAccountViewSet, basename='youtube-account')
router.register('uploads', YouTubeUploadViewSet, basename='youtube-upload')

urlpatterns = [
    path('', include(router.urls)),
]