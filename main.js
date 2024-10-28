const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const Config = require('./Config');

const client = new Client({ authStrategy: new LocalAuth() });
const app = express();
const PORT = Config.port;

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
