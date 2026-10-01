import json
import os

file_path = r'C:\xampp\htdocs\backend\settings_full.json'

with open(file_path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Update texts
data['storeName'] = "Fleur du Mal"
data['storeTagline'] = "Luxury Lingerie & Ready-to-Wear"
data['announcementBar'] = "FREE STANDARD SHIPPING ON ORDERS OVER Rs. 25,000"
data['announcementText'] = "For a good time & 15% off, text LOVER to FLEUR (35387)"

if 'heroData' in data:
    data['heroData']['heading'] = "SEDUCE-U PLUNGE"
    data['heroData']['buttonText'] = "SHOP THE COLLECTION"
else:
    data['heroData'] = {
        'heading': "SEDUCE-U PLUNGE",
        'buttonText': "SHOP THE COLLECTION",
        'buttonLink': "/collections/new-arrivals",
        'mediaType': "image",
        'mediaUrl': "/images/HP_MAIN_HERO_BANNER_-_NEW_ARRIVALS_4855c4d5-c02c-4a1c-955c-2294ee7c9ebb.jpg"
    }

# Save back
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f)
print("Settings updated successfully.")
