const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
	name: "ping",
	description: "shows up discord's ping",
	options: [
		{
			name: "embed",
			description: "would you like to have an embed?",
			type: 4, // 4 = Means Integer
			required: true,
			choices: [
				{
					name: "YES",
					value: 1
				},
				{
					name: "no",
					value: 0
				}
			]
		}
	],
-	workOnly: "all", //? "guild" , "dm" , "all"
-	ignoreBots: true, 
	permLevel: 0,
	cooldown: {
		enable: true, //? true false
		timeout: 90, //? Seconds
		type: "user", //? "any", "guild", "user", "member"
		errormsg: "please wait {time} brother..."
	},
	/**
	 * @param {Discord.Client} client
	 * @param {Object} obj
	 * @param {Discord.User} obj.author
	 * @param {Discord.GuildMember} obj.member
	 * @param {Discord.Guild} obj.guild
	 * @param {Discord.TextChannel} obj.channel
	 */
	execute(i, client, obj) {
		const dping = client.ws.ping;
		let data = i.data.options.find((d) => d.name == "embed");
		if (data.value) {
			return u.embed({
				desc: `Discord's ping: ${dping}`
			});
		} else {
			return `Discord's ping: ${dping}`;
		}
	}
};
