module.exports = {
    sendButtonMenu: async (client, chatId, text, buttons) => {
        const buttonMessage = {
            text: text,
            buttons: buttons,
            headerType: 1
        };
        await client.sendMessage(chatId, buttonMessage);
    }
};
