const u = require("../utils.js");
const Discord = require("discord.js");

module.exports = {
    name: "Join Event",
    /**
     * @param {Discord.Client} client
     */
    execute(client) {
        client.on("guildMemberAdd", (member) => {
            console.log(
                `${member.guild.name} named server has been joined by ${member.user.username}`
            );
        });
    },
};
