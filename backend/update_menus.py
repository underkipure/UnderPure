import json

file_path = r'C:\xampp\htdocs\backend\settings_full.json'

with open(file_path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

fleur_menus = [
    {"id": "nav-1", "name": "NEW ARRIVALS", "url": "/collections/new-arrivals", "hasDropdown": False},
    {"id": "nav-2", "name": "LINGERIE", "url": "/collections/lingerie", "hasDropdown": False},
    {"id": "nav-3", "name": "DRESSES", "url": "/collections/dresses", "hasDropdown": False},
    {"id": "nav-4", "name": "CLOTHING", "url": "/collections/clothing", "hasDropdown": False},
    {"id": "nav-5", "name": "MATCHING SETS", "url": "/collections/matching-sets", "hasDropdown": False},
    {"id": "nav-6", "name": "SWIM", "url": "/collections/swim", "hasDropdown": False},
    {"id": "nav-7", "name": "PLEASURE", "url": "/collections/pleasure", "hasDropdown": False}
]

if 'megaMenuData' not in data:
    data['megaMenuData'] = {}
data['megaMenuData']['menus'] = fleur_menus

# Save back
with open(file_path, 'w', encoding='utf-8-sig') as f:
    json.dump(data, f)
print("Mega menu updated successfully.")
