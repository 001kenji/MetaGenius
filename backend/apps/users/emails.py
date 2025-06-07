from djoser import email
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
import os
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
class SendMail:
    template_name = None
    subject = None
    from_email = settings.EMAIL_HOST_USER

    def __init__(self, request, context):
        self.request = request
        self.context = context
        self.user = context.get('user')  # Important: user comes from context!

    def get_context_data(self):
        return self.context

    def send(self, to):
        context = self.get_context_data()
        
        # Render email template
        html_content = render_to_string(self.template_name, context)

        msg = EmailMultiAlternatives(
            subject=self.subject,
            body=html_content,  # fallback to plain text
            from_email=self.from_email,
            to=to,
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()


class CustomActivationEmail(SendMail):
    template_name = "email/activation.html"
    subject = "Confirm your Novo account"

    def get_context_data(self):
        context = super().get_context_data()
        context['name'] = self.user.get_full_name() if self.user else "New User"
        
        user    = self.user

        # 1. UID & token
        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # 2. Base activation endpoint
        activation_path = "activate"  # "/auth/users/activation/"
        # 2) Reverse your custom “activate-page”
        path   = f'activate/{uid}/{token}'
        host_path = os.environ.get("HostPath", "localhost")
        # 3) Full absolute URL
        context['activation_url'] = f"{host_path}/{path}"

        return context

class CustomConfirmationEmail(SendMail):
    template_name = 'email/confirmation.html'  # Path to your HTML template
    subject = "Your Novo account has been successfully activated"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get('user', None)
        context['name'] = user.get_full_name() if user else ""
        
        host_path = os.environ.get("HostPath", "localhost")
        # 3) Full absolute URL
        context['login_url'] = f"{host_path}"
        return context
    
class CustomPasswordResetEmail(SendMail):
    template_name = "email/password_reset.html"
    subject = "Reset your Novo account password"

    def get_context_data(self):
        context = super().get_context_data()
        context['name'] = self.user.get_full_name() if self.user else "User"
        
        user = self.user
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_path = f"password/reset/confirm/{uid}/{token}"
        host_path = os.environ.get("HostPath", "localhost")
        context['reset_url'] = f"{host_path}/{reset_path}"
        
        return context

class CustomPasswordChangedConfirmationEmail(SendMail):
    template_name = "email/password_changed.html"
    subject = "Your Novo password has been changed"

    def get_context_data(self):
        context = super().get_context_data()
        context['name'] = self.user.get_full_name() if self.user else "User"
        
        host_path = os.environ.get("HostPath", "localhost")
        context['login_url'] = f"{host_path}/login"
        context['support_email'] = "support@Novo.com"
        
        return context
    
