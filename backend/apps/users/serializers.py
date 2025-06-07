from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import SocialToken

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    """
    Custom user creation serializer that extends Djoser's UserCreateSerializer
    """
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name']


class UserSerializer(BaseUserSerializer):
    """
    Custom user serializer that extends Djoser's UserSerializer
    """
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'profile_picture']
        read_only_fields = ['id']


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile information
    """
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'profile_picture']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Customized JWT token serializer that includes user data."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        return data


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['name', 'profile_picture']


class GoogleAuthSerializer(serializers.Serializer):
    """Serializer for Google authentication."""
    
    credential = serializers.CharField(required=True)
    
    def validate(self, attrs):
        return attrs


class UserWithTokenSerializer(serializers.ModelSerializer):
    """User serializer that includes authentication token."""
    
    token = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'profile_picture', 'is_staff', 'token']
    
    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)


class SocialTokenSerializer(serializers.ModelSerializer):
    """Serializer for social tokens."""
    
    class Meta:
        model = SocialToken
        fields = ['provider', 'token', 'token_secret', 'expires_at', 'refresh_token']
        extra_kwargs = {
            'token': {'write_only': True},
            'token_secret': {'write_only': True},
            'refresh_token': {'write_only': True}
        }