const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const AUTH_FOLDER = path.join(__dirname, 'auth_info_baileys');

let sock = null;
let isConnected = false;

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['UnderPure Server', 'Chrome', '1.0.0'],
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('Scan this QR code with your WhatsApp phone:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            isConnected = false;
            if (shouldReconnect) {
                setTimeout(startWhatsApp, 3000);
            }
        } else if (connection === 'open') {
            console.log('WhatsApp connected successfully!');
            isConnected = true;
        }
    });
}

function normalizePhone(phone) {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11 && phone.startsWith('0')) {
        phone = '92' + phone.substring(1);
    }
    // Baileys needs @s.whatsapp.net suffix
    if (!phone.includes('@')) {
        phone = phone + '@s.whatsapp.net';
    }
    return phone;
}

// Health check
app.get('/', (req, res) => {
    res.json({ status: isConnected ? 'connected' : 'disconnected', message: 'UnderPure WhatsApp Bridge' });
});

// Send message endpoint
app.post('/send', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ success: false, error: 'phone and message are required' });
    }

    if (!isConnected || !sock) {
        return res.status(503).json({ success: false, error: 'WhatsApp not connected' });
    }

    try {
        const jid = normalizePhone(phone);
        const result = await sock.sendMessage(jid, { text: message });
        return res.json({ success: true, messageId: result?.key?.id || null });
    } catch (err) {
        console.error('Send message error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`WhatsApp Bridge HTTP server running on http://localhost:${PORT}`);
    startWhatsApp();
});
