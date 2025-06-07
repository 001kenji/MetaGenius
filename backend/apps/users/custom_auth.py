from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
import os,shutil,json
from django.contrib.auth.hashers import check_password
from datetime import datetime
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import View
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib import auth
from djoser.serializers import PasswordResetConfirmSerializer
from rest_framework import serializers,status
from djoser.views import UserViewSet
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import sanitize_string,User
from django.conf import settings
import requests
import logging
logger = logging.getLogger(__name__)

from rest_framework_simplejwt.tokens import RefreshToken

class CustomAuthBackend(BaseBackend):
    def authenticate(self, request,username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            emailval = sanitize_string(username)
            passwordval = sanitize_string(password)
            # print(emailval,password)
            user = UserModel.objects.get(email=emailval)
            if user.check_password(passwordval):
                print('password match',user)
                return user
        except UserModel.DoesNotExist:
            return None

        

        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

class CustomLogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect(reverse_lazy('login'))

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# middleware.py
class EnsureSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.session.session_key:
            request.session.create()
            request.session.modified = True
        return self.get_response(request)

class SetHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        
        response = self.get_response(request)
        request.META.pop('X-Powered-By', None)
        request.META.pop('Server', None)
        
        #response = self.get_response(request)
        csp_directives = {            
            "frame-ancestors": "'self' http://127.0.0.1:8000 http://localhost:8000 http://localhost:5173" ,
    
        }

        csp_header_value = '; '.join([f"{directive} {value}" for directive, value in csp_directives.items()])
        response['Content-Security-Policy'] = csp_header_value
        

        response['Content-Disposition'] = 'inline'
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'deny'
        response['X-Accel-Buffering'] = 'no'
        return response   