const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

// Custom modules and configurations
const bot = require(__dirname + '/lib');
const { VERSION } = require(__dirname + '/config');

// Single file auth state
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

const start = async () => {
    console.info(`Pringles-v1 ${VERSION}`);

    try {
        await bot.init();
        bot.logger.info('⏳ Database syncing!');
        await bot.DATABASE.sync();

        const conn = makeWASocket({
            auth: state,
            logger: require('pino')({ level: 'silent' }),
            printQRInTerminal: true
        });

        conn.ev.on('creds.update', saveState);

        conn.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error === DisconnectReason.loggedOut) ? false : true;
                console.log('Connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
                if (shouldReconnect) start();
            } else if (connection === 'open') {
                console.log('Connected');
            }
        });

        conn.ev.on('messages.upsert', async (m) => {
            console.log(JSON.stringify(m, undefined, 2));
            const msg = m.messages[0];
            if (!msg.message) return;

            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const from = msg.key.remoteJid;

            if (text.startsWith('!download ')) {
                const url = text.split(' ')[1];
                const filename = 'audio.mp3';
                try {
                    await downloadAndConvertToMp3(url, filename);
                    const filePath = path.resolve(__dirname, filename);
                    await conn.sendMessage(from, { document: { url: filePath }, mimetype: 'audio/mpeg', fileName: filename });
                    fs.unlinkSync(filePath); // Clean up the file after sending
                } catch (error) {
                    await conn.sendMessage(from, { text: 'Failed to download and convert the video to MP3. Please try again later.' });
                    console.error(error);
                }
            } else if (text === 'hello') {
                await conn.sendMessage(from, { text: 'Hello! How can I help you?' });
            } else if (text === 'ping') {
                await conn.sendMessage(from, { text: 'Pong!' });
            }
        });

    } catch (error) {
        console.error(error);
        start();
    }
};

const downloadAndConvertToMp3 = (url, filename) => {
    return new Promise((resolve, reject) => {
        const stream = ytdl(url, { quality: 'highestaudio' });
        const filePath = path.resolve(__dirname, filename);

        ffmpeg(stream)
            .audioBitrate(128)
            .toFormat('mp3')
            .save(filePath)
            .on('end', () => resolve(filePath))
            .on('error', reject);
    });
};

start();
    
