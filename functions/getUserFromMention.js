module.exports= {
    getUserFromMention
};

function getUserFromMention(client, mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        console.log('mention : ' + mention);
        console.log('user : ' + client.users.get(mention));
        return client.users.get(mention);
    }
}