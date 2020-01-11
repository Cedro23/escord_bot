'use strict';

// Discord
const Discord = require('discord.js');
const client = new Discord.Client();

// Env variables
const dotenv = require('dotenv');
dotenv.config();

// Constant variables
const botAuthToken = process.env.BOT_AUTH_TOKEN;
const prefix = process.env.PREFIX;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase(); // Takes the first argument which is the command name

    if (command === 'avatar') {
        if (args[0]) {
            const user = getUserFromMention(args[0]);
            if (!user) {
                return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
            }

            return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL()}`);
        }

        return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL()}`);
    }
});

client.login(botAuthToken);


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
