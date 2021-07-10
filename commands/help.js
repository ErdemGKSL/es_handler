const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
    trigger: "help",
    type: "command",
    aliases: ["yardım"],
    workOnly: "all", 
    ignoreBots: true, 
    permLevel: 0,
    cooldown: {
        enable: true, //? true false
        timeout: 3, //?  Seconds
        type: "user", //? "any", "guild", "user", "member"
        errormsg: "You should wait {time}...", //?
    },
    help: {
        name: "Help",
        desc: "The command that you used :P",
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
                        title: "・Help!",
                        desc: "__**Command**__",
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
                desc = "**・I couldnt found the command you was looking for...**";
                desc += "\n・Command List: *" + list.join(", ") + "*";
            }
        } else {
            desc =
                "・" +
                client.prefix +
                "help <Komut>\n\n・Command List: \n\n**・" +
                list.join("\n・") +
                "**";
        }
        msg.channel.send(u.embed({ title: "・Help!", desc: desc }));
    },
};
