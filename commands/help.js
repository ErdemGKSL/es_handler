const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
    trigger: "help",
    type: "command",
    aliases: ["yardım"],
    guildOnly: false,
    ignoreBots: true, //?Botlar umursanmasın mı
    /**
     * * 0: Herkes
     * * 1: Alt Yetkililer (Mesajları yönet vb.)
     * * 2: Orta Yetkililer (Kanalları veya Rolleri yönet vb.)
     * * 3: Üst Yetkililer (BAN veya KICK)
     * * 4: Yöneticiler (ADMINSTRATORS)
     * * 5: Botun Sahipleri (config.json)
     */
    permLevel: 0,
    cooldown: {
        enable: true, //? true false
        timeout: 3, //? SANİYE | Seconds
        type: "user", //? "any", "guild", "user", "member"
        errormsg: "Lütfen {time} Bekleyiniz...", //? {time} = remaining time in language of config.json
    },
    help: {
        name: "Help",
        desc: "Kullandığınız Komut :P",
    },
    /**
     * @param {Discord.Message} msg
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    execute(msg, args, client) {
        let desc = "";
        let list = [];
        client.commands.forEach((command) => {
            if (command.type == "command") {
                list.push(command.help.name.toLowerCase());
            }
        });
        if (args[0]) {
            let search = args.join(" ");
            let command = client.commands.find(
                (x) => x.help.name.toLowerCase() == search.toLowerCase()
            );
            if (command) {
                msg.channel.send(
                    u.embed({
                        title: "・Yardım!",
                        desc: "__**Komut**__",
                        field: [
                            [
                                client.prefix + command.help.name,
                                command.help.desc,
                            ],
                        ],
                    })
                );
                return;
            } else {
                desc = "**・Aradığınız komut bulunamadı...**";
                desc += "\n・Komut Listesi: *" + list.join(", ") + "*";
            }
        } else {
            desc =
                "・" +
                client.prefix +
                "help <Komut>\n\n・Komut Listesi: \n\n**・" +
                list.join("\n・") +
                "**";
        }
        msg.channel.send(u.embed({ title: "・Yardım!", desc: desc }));
    },
};
