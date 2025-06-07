import os,json
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from django.conf import settings
# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-3=ac@+e*^c#c03qz9umiglbvvbo0l0ym56*o_ax*sdfS*SDfSdfsdwesefsdfaa')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DJANGO_DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = [
    os.getenv('DJANGO_ALLOWED_HOSTS', ''),
    os.environ.get("FRONTEND_URL", "localhost"),
    os.getenv('HostPath', ''),
    ]

# Application definition
INSTALLED_APPS = [
    'jazzmin',
    'circuitbreaker',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    'djoser',
    
    # Local apps
    'apps.users',
    'apps.metadata',
    'apps.youtube',
]

MIDDLEWARE = [
    'social_django.middleware.SocialAuthExceptionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'meta_genius.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,'dist'),os.path.join(BASE_DIR,'templates'),os.path.join(BASE_DIR,'templates','emails')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'meta_genius.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'meta_genius'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'postgres'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Cache (Redis)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    }
}

# Celery Configuration
CELERY_BROKER_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 minutes

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 3,
        },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

VITE_APP_DIR = os.path.join(BASE_DIR,'dist')
def load_json_from_dist(json_filename="manifest.json"):
    manifest_file_path = Path(str(settings.VITE_APP_DIR), "dist", json_filename)
    if not manifest_file_path.exists():
        raise OSError(
            f"Vite manifest file not found on path: {str(manifest_file_path)}"
        )
    with open(manifest_file_path, "r") as manifest_file:
        try:
            manifest = json.load(manifest_file)
        except json.JSONDecodeError as e:
            raise json.JSONDecodeError(
                f"Vite manifest file invalid. Maybe your {str(manifest_file_path)} file is empty?"
            ) from e
        else:
            return manifest

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'users.User'

#cors origins 
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL'),
] 



CSRF_TRUSTED_ORIGINS = [
    os.environ.get('FRONTEND_URL'),
]

ALLWOED_REDIRECT_URIS = [
    os.environ.get('FRONTEND_URL'),
    ]

#to prevent downgrading https to http in PRODUCTION level
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
CORS_ALLOW_CREDENTIALS = True

#to prevent csrf attack
CSRF_COOKIE_NAME = "Inject"
CSRF_COOKIE_SECURE = True # only true for httpp
# CSRF_COOKIE_HTTPONLY   = False    # so JavaScript can read it
CIRCUIT_BREAKER_BACKEND = 'circuitbreaker.backends.memory.MemoryBackend'
CIRCUIT_BREAKER_DEFAULT_TIMEOUT = 60  
CIRCUIT_BREAKER_DEFAULT_FAILURE_THRESHOLD = 5
CIRCUIT_BREAKER_DEFAULT_RECOVERY_TIMEOUT = 30  
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_SAMESITE = 'Lax'  # or 'None' if cross-site
CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript to read it
CSRF_USE_SESSIONS = False
SESSION_ENGINE = "django.contrib.sessions.backends.db"  # Or 'cache' for better performance
SESSION_COOKIE_NAME = "sessionid"
SESSION_COOKIE_AGE = 3600  # 1 hour
SESSION_COOKIE_SECURE = False # only true for httpp
SESSION_COOKIE_HTTPONLY = True
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_DOMAIN = None  # For production



# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication', ### Aded
        'rest_framework_simplejwt.authentication.JWTAuthentication',        
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10/minutes',
        'user': '30/minutes',
        'data' : '5/min'
    }
}

# Simple JWT settings
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Shorter in production
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_TOKEN_CLASSES' : (
        'rest_framework_simplejwt.tokens.AccessToken',
    )
    # 'ROTATE_REFRESH_TOKENS': True,
    # 'BLACKLIST_AFTER_ROTATION': True,
    # 'UPDATE_LAST_LOGIN': False,
    # 'ALGORITHM': 'HS256',
    # 'SIGNING_KEY': SECRET_KEY,
    # 'VERIFYING_KEY': None,
    # 'AUDIENCE': None,
    # 'ISSUER': None,
    # 'JWK_URL': None,
    # 'AUTH_HEADER_TYPES': ('Bearer',),
    # 'USER_ID_FIELD': 'id',
    # 'USER_ID_CLAIM': 'user_id',
    # 'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    # 'TOKEN_TYPE_CLAIM': 'token_type',
    # 'JTI_CLAIM': 'jti',
}




# Djoser settings
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': False,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': False,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'username/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    "DELETE_USER_ON_REQUEST": False,  # Enable deletion via request
    'SOCIAL_AUTH_TOKEN_STRATEGY' : 'djoser.social.token.jwt.TokenStrategy',
    'SOCIAL_AUTH_STATE_PARAMETER': True,  # Enable state parameter handling
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS' : [os.getenv('GROK_URL_PATH'),os.environ.get('FRONTEND_URL'),os.environ.get("HostPath", "localhost")],
    'SOCIAL_AUTH_USER_FIELDS': ['email', 'name'],  # Specify your custom fields
    'SOCIAL_AUTH_GOOGLE_OAUTH2_AUTH_EXTRA_ARGUMENTS': {
        'access_type': 'offline',
        'prompt': 'consent',
    },
    'SERIALIZERS': {
        'user_create': 'apps.users.serializers.UserCreateSerializer',
        'user': 'apps.users.serializers.UserSerializer',
        'current_user': 'apps.users.serializers.UserSerializer',
    },
    'EMAIL': {
        'activation': 'apps.users.emails.CustomActivationEmail',
        'confirmation': 'apps.users.emails.CustomConfirmationEmail',
        'password_reset': 'apps.users.emails.CustomPasswordResetEmail',
        'password_changed_confirmation': 'apps.users.emails.CustomPasswordChangedConfirmationEmail',
        'resend_activation': 'apps.users.emails.CustomActivationEmail',  # Add this line

    },
    # Add this to enable the resend activation endpoint
    'PERMISSIONS': {
        'user_delete': ['rest_framework.permissions.IsAdminUser'],
        'user_create': ['rest_framework.permissions.AllowAny'],
        'user': ['rest_framework.permissions.IsAuthenticated'],
        'user_list': ['rest_framework.permissions.IsAdminUser'],
        'activation': ['rest_framework.permissions.AllowAny'],  # Important for resend
        'resend_activation': ['rest_framework.permissions.AllowAny'],  # Add this line
    },
}


AUTHENTICATION_BACKENDS = (
    'apps.users.custom_auth.CustomAuthBackend',
    'social_core.backends.google.GoogleOAuth2',
    # 'apps.users.custom_auth.CustomUserDeleteBackend',
    'django.contrib.auth.backends.ModelBackend',
)


GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('GOOGLE_CLIENT_ID')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile','openid']


SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = [
    ('given_name', 'first_name'),
    ('family_name', 'last_name'),
    ('picture', 'picture'),
    ('locale', 'locale'),
]
SOCIAL_AUTH_FIELDS_STORED_IN_SESSION = ['state']
SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.user.create_user',
    # 'social_core.pipeline.social_auth.associate_by_email',  # Add this line
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
    'apps.users.pipeline.set_user_name',  # Add this custom step
    'apps.users.pipeline.save_profile_picture',  # Custom pipeline step
)

# CORS settings
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only in development
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if not DEBUG else []

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465
EMAIL_HOST_USER = 'machariabrian712@gmail.com'
EMAIL_HOST_PASSWORD= 'tmni cnhb nqho csqs'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL =  'noreply@metagenius.ai'

# OpenAI settings
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

# Google/YouTube API settings
GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID', '')
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET', '')
GOOGLE_OAUTH_REDIRECT_URI = os.getenv('GOOGLE_OAUTH_REDIRECT_URI', '')


#for password hashes
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher", ## make sure argon 2 is up top since is the best
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]


# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/django.log'),
            'maxBytes': 1024*1024*5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Ensure logs directory exists
os.makedirs(os.path.join(BASE_DIR, 'logs'), exist_ok=True)


JAZZMIN_SETTINGS = {
    "site_title": "Daimac-Intel",
    "welcome_sign": "Welcome to Administrators",
    "site_header": "login admin",
    "site_brand": "DAIMAC",
    "copyright": "daimac@domain.com",
    "login_logo": None,
    "site_icon": None,
    "usermenu_links": [
        {"model": "auth.user", },
     
    ], 
    "search_model": ["auth.User"]
}


JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-success",
}
