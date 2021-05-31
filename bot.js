const Discord = require("discord.js");
require("discord-reply");
const client = new Discord.Client();
const fs = require("fs");
const chalk = require("chalk");
const { token, prefix } = require("./config.json");
const u = require("./utils.js");
const { embed } = require("./utils.js");
const cooldown = new Discord.Collection();

client.commands = new Discord.Collection();
client.dmcommands = new Discord.Collection();
client.prefix = prefix;
const eventFiles = fs.readdirSync("./events").filter((x) => x.endsWith(".js"));
if (eventFiles.length > 0) {
    console.log(chalk.magenta.bold.underline("Eventler Yükleniyor...") + "\n ");
}

client.on("ready", () => {
    eventFiles.forEach((file) => {
        const event = require(`./events/${file}`);
        event.execute(client);
        console.log(
            chalk.blueBright.italic(`> ${event.name} Eventi Yüklendi!`)
        );
    });
    console.log(
        chalk.green.bold(`${client.user.tag} adlı bota giriş yapıldı!`)
    );
});

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

client.on("message", (msg) => {
    let gprefix = prefix + "";
    const args = msg.content.slice(gprefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    let commands = client.commands.filter(
        (x) =>
            x.type == "always" ||
            (msg.content.startsWith(prefix) &&
                (x.type == "command" || !x.type) &&
                ((x.aliases && x.aliases.includes(commandName)) ||
                    x.trigger == commandName)) ||
            (x.type == "contains" && msg.content.includes(x.trigger)) ||
            (x.type == "start" && msg.content.startsWith(x.trigger)) ||
            (x.type == "end" && msg.content.endsWith(x.trigger)) ||
            (x.type == "exact" && msg.content == x.trigger) ||
            (x.type == "regex" && msg.content.match(new RegExp(x.trigger, "i")))
    );
    if (!commands) return;
    commands.forEach((command) => {
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
            if (cooldown.get(cnm)) {
                let d = new Date().getTime();
                let kalan = u.okunur_zaman(wait - (d - cooldown.get(cnm)));
                if (command.cooldown.errormsg) {
                    let emsg = command.cooldown.errormsg.replace(
                        "{time}",
                        kalan
                    );
                    msg.lineReply(emsg);
                } else {
                    msg.lineReply(`Komut Bekleme Süresinde... ${kalan}}`);
                }
                return;
            } else {
                let d = new Date().getTime();
                cooldown.set(cnm, d);
                setTimeout(() => {
                    cooldown.delete(cnm);
                }, wait);
            }
        }
        if (
            !(
                msg.content.startsWith(gprefix) ||
                command.type == "contains" ||
                "start" ||
                "regex" ||
                "end" ||
                "exact"
            )
        )
            return;
        try {
            command.execute(msg, args, client);
        } catch (e) {
            console.error(e);
            msg.lineReply("Bir hata oluştu!");
        }
    });
});
client.login(token);
