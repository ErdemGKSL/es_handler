const u = require("../utils.js");
const Discord = require("discord.js");

module.exports = {
    name: "Giriş",
    /**
     * @param {Discord.Client} client
     */
    execute(client) {
        client.on("guildMemberAdd", (member) => {
            console.log(
                `${member.guild.name} sunucusuna ${member.user.username} giriş yapmış bulunmakta.`
            );
        });
    },
};
