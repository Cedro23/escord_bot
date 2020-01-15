'use strict';

// file system
const fs = require('fs');

// Discord
const Discord = require('discord.js');
const client = new Discord.Client();


// Commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
// Cooldowns
const cooldowns = new Discord.Collection();

// Env variables
const dotenv = require('dotenv');
dotenv.config();

// Constant variables
const botAuthToken = process.env.BOT_AUTH_TOKEN;
const prefix = process.env.PREFIX;


// Core of the bot
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase(); // Takes the first argument which is the command name

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName); // Gets the command name

    // Checks if command needs arguments. If so, checks if there are any
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    // Checks cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

});

client.login(botAuthToken);