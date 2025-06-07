from django.contrib import admin
from django.urls import path, include,re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base  import TemplateView
from apps.users.views import get_csrf_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path("cred/csrfToken/", get_csrf_token, name="get-csrf-token"),
    # API v1 endpoints
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('users/', include('apps.users.urls')),
    path('metadata/', include('apps.metadata.urls')),
    path('youtube/', include('apps.youtube.urls')),
    
    # Root redirect to admin
]+  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]

