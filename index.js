const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const { Boom } = require('@hapi/boom');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

const connectToWhatsApp = async () => {
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    conn.ev.on('creds.update', saveState);

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error === DisconnectReason.loggedOut) ? false : true;
            console.log('Connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('Connected');
        }
    });

    conn.ev.on('messages.upsert', async (m) => {
        console.log(JSON.stringify(m, undefined, 2));
        const msg = m.messages[0];
        if (!msg.message) return;
        
        const { text } = msg.message.conversation || msg.message.extendedTextMessage || {};
        const from = msg.key.remoteJid;
        
        if (text === 'hello') {
            await conn.sendMessage(from, { text: 'Hello! How can I help you?' });
        } else if (text === 'ping') {
            await conn.sendMessage(from, { text: 'Pong!' });
        }
    });
};

connectToWhatsApp();
          
