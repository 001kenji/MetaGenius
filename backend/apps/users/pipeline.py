from django.core.files import File
from io import BytesIO
import requests
from django.conf import settings
import os,datetime


# your_app/pipeline.py
def set_user_name(strategy, details, user=None, *args, **kwargs):
    if user:
        # Combine first_name and last_name if they exist
        first_name = details.get('first_name', '')
        last_name = details.get('last_name', '')
        
        if first_name or last_name:
            user.name = f"{first_name} {last_name}".strip()
            strategy.storage.user.changed(user)
    
    return kwargs

# your_app/pipeline.py
def save_profile_picture(strategy, details,response, backend, user=None, *args, **kwargs):
    #print('calling the pipleline 🌙🌙🌙', backend.name,response.get('picture'))
    if user and backend.name == 'google-oauth2' and response.get('picture'):
        try:
            #print('inside the pipeline profile')
            response = requests.get(response.get('picture'), timeout=5)
            if response.status_code == 200:
                #print('image got success')
                now = datetime.datetime.now()
                short_date = now.strftime("%H_%M_%S")
                img_name = f"{short_date}_profile_picture.jpg"
                folder_path = os.path.join(settings.MEDIA_ROOT,user.email)
                img_path = os.path.join(settings.MEDIA_ROOT,user.email, img_name)
                storage_name = f'/{user.email}/{img_name}'
                os.makedirs(os.path.dirname(folder_path), exist_ok=True)
                #print('saving')
                with open(img_path, 'wb') as f:
                    f.write(response.content)
                
                user.ProfilePic = storage_name
                user.save()
        except Exception as e:
            print(f"Error saving profile picture: {e}")
    
    return kwargs