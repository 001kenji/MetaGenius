# backend/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, SocialToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for the custom User model."""
    
    fieldsets = (
        (None, {'fields': ('email',)}),
        (_('Personal info'), {'fields': ('name', 'profile_picture')}),
        (_('Social info'), {'fields': ('google_id',)}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                ),
            },
        ),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2'),
            },
        ),
    )
    list_display = ('email', 'name', 'is_staff', 'date_joined')
    search_fields = ('email', 'name')
    ordering = ('email',)


@admin.register(SocialToken)
class SocialTokenAdmin(admin.ModelAdmin):
    """Admin for the SocialToken model."""
    
    list_display = ('user', 'provider', 'created_at', 'updated_at')
    list_filter = ('provider', 'created_at', 'updated_at')
    search_fields = ('user__email', 'provider')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('user',)
    date_hierarchy = 'created_at'
    
    def has_delete_permission(self, request, obj=None):
        # Social tokens should normally not be deleted directly from the admin
        return False