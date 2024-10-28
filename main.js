const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const Config = require('./Config');
const buttonHandler = require('./lib/buttonHandler');
const plugins = require('./plugins');

const client = new Client({ authStrategy: new LocalAuth() });
const app = express();
const PORT = Config.port;

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    if (message.body === '!menu') {
        const buttons = [
            { buttonId: 'id1', buttonText: { displayText: 'Joke' }, type: 1 },
            { buttonId: 'id2', buttonText: { displayText: 'Info' }, type: 1 }
        ];
        const text = "Welcome to Pringles Md! Choose an option below:";
        await buttonHandler.sendButtonMenu(client, message.from, text, buttons);
    } else if (message.body === '!joke') {
        const jokePlugin = require('./plugins/joke');
        jokePlugin.execute(client, message);
    }
});

client.initialize();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
