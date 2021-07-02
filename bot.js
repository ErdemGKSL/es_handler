const Discord = require("discord.js");
require("discord-reply");
const client = new Discord.Client();
const fs = require("fs");
const chalk = require("chalk");
const { token, prefix, owners } = require("./config.json");
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
eventFiles.forEach((file) => {
    const event = require(`./events/${file}`);
    event.execute(client);
    console.log(chalk.blueBright.italic(`> ${event.name} Eventi Yüklendi!`));
});
client.on("ready", () => {
    console.log(
        chalk.green.bold(`${client.user.tag} adlı bota giriş yapıldı!`)
    );
});
const incommandFiles = fs
    .readdirSync("./commands")
    .filter((x) => !x.includes("."));

const commandFiles = fs
    .readdirSync("./commands")
    .filter((x) => x.endsWith(".js"));
if (commandFiles.length > 0) {
    console.log(chalk.magenta.bold.underline("Komutlar Yükleniyor...") + "\n ");
}
incommandFiles.forEach((folder) => {
    const lcommandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((x) => x.endsWith(".js"));
    if (lcommandFiles.length > 0) {
        console.log(
            chalk.magenta.bold.underline(
                `${folder} Dosyasından Komutlar Yükleniyor...`
            ) + "\n "
        );
    }
    lcommandFiles.forEach((file) => {
        const command = require(`./commands/${folder}/${file}`);
        let name = file.slice(0, file.length - 3);
        client.commands.set(name, command);
        console.log(chalk.blueBright.italic(`> ${name} Komutu Yüklendi!`));
    });
});
commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    let name = file.slice(0, file.length - 3);
    client.commands.set(name, command);
    console.log(chalk.blueBright.italic(`> ${name} Komutu Yüklendi!`));
});

client.on("message", (msg) => {
    if (client.user.id == msg.author.id) return;
    let content = msg.content.toLowerCase();
    let gprefix = prefix + "";
    const args = msg.content.slice(gprefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    let commands = client.commands.filter(
        (x) =>
            x.type == "always" ||
            (content.startsWith(prefix) &&
                (x.type == "command" || !x.type) &&
                ((x.aliases && x.aliases.includes(commandName)) ||
                    x.trigger == commandName)) ||
            (x.type == "contains" && content.includes(x.trigger)) ||
            (x.type == "start" && content.startsWith(x.trigger)) ||
            (x.type == "end" && content.endsWith(x.trigger)) ||
            (x.type == "exact" && content == x.trigger) ||
            (x.type == "regex" && content.match(new RegExp(x.trigger, "i")))
    );
    if (!commands) return;
    commands.forEach((command) => {
        if (command.workOnly) {
            if (command.workOnly.toLowerCase() == "dm" && msg.guild)
                return msg.lineReply(
                    "Bu komut sadece DM'lerde kullanılmaz üzere tasarlanmıştır!"
                );
            if (command.workOnly.toLowerCase() == "guild" && !msg.guild)
                return msg.lineReply(
                    "Bu komut sadece sunucularda kullanılabilir!"
                );
        }
        if (command.workOnly.toLowerCase() == "guild" && command.permLevel) {
            let permlvl = 0;
            if (
                msg.member.hasPermission(
                    "MANAGE_EMOJIS" || "MANAGE_MESSAGES" || "MANAGE_NICKNAMES"
                )
            )
                permlvl = 1;
            if (msg.member.hasPermission("MANAGE_CHANNELS" || "MANAGE_ROLES"))
                permlvl = 2;
            if (msg.member.hasPermission("BAN_MEMBERS" || "KICK_MEMBERS"))
                permlvl = 3;
            if (msg.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
            if (owners.includes(msg.author.id)) permlvl = 5;
            if (command.permLevel > permlvl)
                return msg.lineReply("Yetersiz Yetki!");
        }
        if (command.cooldown && command.cooldown.enable) {
            let cnm = command.trigger + msg.author.id;
            let type = command.cooldown.type;
            let wait = 10000;
            if (type == "member" && command.workOnly.toLowerCase() == "guild") {
                cnm = command.trigger + msg.author.id + msg.guild.id;
            } else if (type == "any") {
                cnm = command.trigger;
            } else if (
                type == "guild" &&
                command.workOnly.toLowerCase() == "guild"
            ) {
                cnm = command.trigger + msg.guild.id;
            }
            if (command.cooldown.timeout) {
                wait = command.cooldown.timeout * 1000;
            }
            if (cooldown.get(cnm)) {
                let d = new Date().getTime();
                let kalan = u.okunur_zaman(wait - (d - cooldown.get(cnm)));
                if (command.cooldown.errormsg) {
                    if (command.cooldown.errormsg === "") {
                        msg.lineReply(`Komut Bekleme Süresinde... ${kalan}`);
                    } else {
                        let emsg = command.cooldown.errormsg.replace(
                            "{time}",
                            kalan
                        );
                        msg.lineReply(emsg);
                    }
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
        if (command.ignoreBots && msg.author.bot) return;
        try {
            command.execute(msg, args, client);
        } catch (e) {
            console.error(e);
            msg.lineReply("Bir hata oluştu!");
        }
    });
});
client.login(token);
