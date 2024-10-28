module.exports = {
    createGroup: async (client, groupName, contacts) => {
        const group = await client.groupCreate(groupName, contacts);
        return group;
    },
    sendGroupMessage: async (client, groupId, message) => {
        await client.sendMessage(groupId, message);
    }
};
