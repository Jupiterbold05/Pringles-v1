module.exports = { 
    init: async () => console.log('smd module initialized'), 
    DATABASE: { 
        sync: async () => console.log('Database synced') 
    }, 
    logger: console 
};
