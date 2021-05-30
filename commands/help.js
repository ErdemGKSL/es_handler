const Discord = require("discord.js");

module.exports = {
    trigger: "help",
    type: "command",
    aliases: ["yardım"],
    guildOnly: false,
    cooldown: {
        enable: true, //? true false
        timeout: 3, //? SANİYE/SECOND
        type: "user", //? "any", "guild", "user", "member"
        errormsg: "Lütfen Bekleyiniz...",
    },
    help: {
        name: "Help",
        desc: "Kullandığınız Komut :P",
    },
    /**
     * @param {Discord.Message} msg
     * @param {Array} args
     * @param {Discord.Client} client
     * @param {Object} u
     * @param {Discord.MessageEmbed} u.embed
     */
    execute(msg, args, client, u) {
        let desc = "";
        let list = [];
        client.commands.forEach((command) => {
            list.push(command.help.name.toLowerCase());
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
