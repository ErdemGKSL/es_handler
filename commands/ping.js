const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
    trigger: "ping",
    type: "command",
    aliases: ["p"],
    workOnly: "all", //? "guild" , "dm" , "all"
    ignoreBots: true, 
    permLevel: 0,
    cooldown: {
        enable: true, //? true false
        timeout: 90, //?  Seconds
        type: "user", //? "any", "guild", "user", "member"
        errormsg: "Please wait {time}",
    },
    help: {
        name: "Ping",
        desc: "Shows discords and bots ping!",
    },
    /**
     * @param {Discord.Message} msg
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    execute(msg, args, client) {
        const dping = msg.client.ws.ping;
        let bping;
        msg.channel
            .send(
                u.embed({
                    title: "Pingmeter",
                    desc: "Here is my ping... 🤔",
                })
            )
            .then((x) => {
                bping = x.createdTimestamp - msg.createdTimestamp;
                setTimeout(() => {
                    x.edit(
                        u.embed({
                            title: "Pingmeter",
                            desc: `Discord's Ping: ${dping} ms\nBot's Ping: ${bping} ms`,
                        })
                    );
                }, 500);
            });
    },
};
