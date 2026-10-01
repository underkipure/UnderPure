-- Add shipping_email column to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email VARCHAR(255) NULL AFTER shipping_name;

-- Add notification settings to site_settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('smtp_host', 'smtp.gmail.com'),
('smtp_port', '587'),
('smtp_user', ''),
('smtp_pass', ''),
('smtp_from_name', 'UnderPure Store'),
('whatsapp_api_url', ''),
('whatsapp_api_key', '')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- CallMeBot settings (FREE WhatsApp API, no hosting needed)
INSERT INTO site_settings (setting_key, setting_value) VALUES
('whatsapp_provider', 'callmebot'),
('whatsapp_bot_phone', ''),
('whatsapp_api_key', '')
ON DUPLICATE KEY UPDATE setting_value = setting_value;
