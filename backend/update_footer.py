import json

file_path = r'C:\xampp\htdocs\backend\settings_full.json'

with open(file_path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

if 'footerData' in data:
    data['footerData']['smsBannerHeading'] = "for a good time\ntext lover to fleur (35387)"
    data['footerData']['smsBannerSubtext'] = "By entering your phone number and submitting this form, you consent to receive marketing text messages (such as promotion codes and cart reminders) from Fleur du Mal at the number provided. Consent is not a condition of any purchase."
    
    if 'newsletterHeading' in data['footerData']:
        data['footerData']['newsletterHeading'] = "JOIN THE LIST"
        data['footerData']['newsletterSubheading'] = "Get VIP access to our newest launches, limited-edition sets, sales, and more."

    # Update any links mentioning UnderPure
    if 'links' in data['footerData']:
        for column in data['footerData']['links']:
            for link in column['links']:
                if 'UnderPure' in link['name']:
                    link['name'] = link['name'].replace('UnderPure', 'Fleur du Mal')
                if 'UnderPure' in link['name']:
                    link['name'] = link['name'].replace('UnderPure', 'Fleur du Mal')

# Save back
with open(file_path, 'w', encoding='utf-8-sig') as f:
    json.dump(data, f)
print("Footer data updated successfully.")
