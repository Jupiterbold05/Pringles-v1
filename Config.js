require('dotenv').config();

module.exports = {
    botname: process.env.BOT_NAME || "Pringles Md",
    ownername: process.env.OWNER_NAME || "Your Name",
    port: process.env.PORT || 3000,
};
