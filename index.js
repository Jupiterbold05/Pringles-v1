const bot = require(__dirname + '/lib/amd');
const { VERSION } = require(__dirname + '/config');

const start = async () => {
    console.info(`Starting Pringles-v1 ${VERSION}`);
    try {
        await bot.init();
        await bot.DATABASE.sync();
        await bot.connect();
    } catch (error) {
        console.error(error);
        start();
    }
};

start();
