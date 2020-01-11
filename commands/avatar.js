module.exports = {
    name: 'avatar',
    usage: '<user>',
    cooldown: 5,
    description: 'Shows the avatar of the user using. Or the avatar of the first argument if it is a user',
    execute(message, args) {
        if (args[0]) {
            const user = getUserFromMention(args[0]);
            if (!user) {
                return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
            }

            return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL()}`);
        }

        return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL()}`);
    },
};

function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.get(mention);
    }
}