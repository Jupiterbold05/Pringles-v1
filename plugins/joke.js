module.exports = {
    name: "joke",
    description: "Sends a random joke",
    execute: async (client, message) => {
        const jokes = [
            "Why don’t scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "I'm reading a book on anti-gravity. It's impossible to put down!"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        client.sendMessage(message.from, joke);
    }
};
