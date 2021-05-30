const u = require("../utils.js");
const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client) => {
    client.on("guildMemberAdd", (member) => {
        console.log(
            `${member.guild.name} sunucusuna ${member.user.username} giriş yapmış bulunmakta.`
        );
    });
};
