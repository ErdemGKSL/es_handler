const Discord = require("discord.js");
require("discord-reply");
const client = new Discord.Client();
const fs = require("fs");
const chalk = require("chalk");
const { token, prefix } = require("./config.json");
const u = require("./utils.js");
const { embed } = require("./utils.js");
const cooldown = new Set();

client.commands = new Discord.Collection();
client.dmcommands = new Discord.Collection();
client.prefix = prefix;

const commandFiles = fs
    .readdirSync("./commands")
    .filter((x) => x.endsWith(".js"));
if (commandFiles.length > 0) {
    console.log(chalk.magenta.bold.underline("Komutlar Yükleniyor...") + "\n ");
}
commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.trigger, command);
    console.log(
        chalk.blueBright.italic(`> ${command.trigger} Komutu Yüklendi!`)
    );
});
client.on("ready", () => {
    console.log(
        chalk.green.bold(`${client.user.tag} adlı bota giriş yapıldı!`)
    );
});
client.on("message", (msg) => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    let command =
        client.commands.find(
            (x) =>
                (x.type == "command" || !x.type) &&
                ((x.aliases && x.aliases.includes(commandName)) ||
                    x.trigger == commandName)
        ) ||
        client.commands.find(
            (x) =>
                (x.type == "contains" && msg.content.includes(x.trigger)) ||
                (x.type == "start" && msg.content.startsWith(x.trigger)) ||
                (x.type == "end" && msg.content.endsWith(x.trigger)) ||
                (x.type == "exact" && msg.content == x.trigger) ||
                (x.type == "regex" &&
                    msg.content.match(new RegExp(x.trigger, "i")))
        );

    if (!command) return;
    if (command.guildOnly && msg.channel.type == "dm")
        return msg.lineReply("Bu komut sadece sunucularda çalışır!");
    if (command.cooldown && command.cooldown.enable) {
        let cnm = command.trigger + msg.author.id;
        let type = command.cooldown.type;
        let wait = 10000;
        if (type == "member" && command.guildOnly) {
            cnm = command.trigger + msg.author.id + msg.guild.id;
        } else if (type == "any") {
            cnm = command.trigger;
        } else if (type == "guild" && command.guildOnly) {
            cnm = command.trigger + msg.guild.id;
        }
        if (command.cooldown.timeout) {
            wait = command.cooldown.timeout * 1000;
        }
        if (cooldown.has(cnm)) {
            if (command.cooldown.errormsg) {
                msg.lineReply(command.cooldown.errormsg);
            } else {
                msg.lineReply("Komut Bekleme Süresinde...");
            }
            return;
        } else {
            cooldown.add(cnm);
            setTimeout(() => {
                cooldown.delete(cnm);
            }, wait);
        }
    }
    if (
        !(
            msg.content.startsWith(prefix) ||
            command.type == "contains" ||
            "start" ||
            "regex" ||
            "end" ||
            "exact"
        )
    )
        return;
    try {
        command.execute(msg, args, client, u);
    } catch (e) {
        console.error(e);
        msg.lineReply("Bir hata oluştu!");
    }
});
client.login(token);
