const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
    trigger: "example",
    //? Trigger
    type: "command",
    //? Trigger Type, Use "regex", "contains", "end", "start", "exact", "command" or "always"
    aliases: ["e1", "e2"],
    //? If trigger type is command aliases works.
    workOnly: "all", //? "guild" , "dm" , "all"
    ignoreBots: true,
    /**
     * * 0: Everyone
     * * 1: Manage Messages
     * * 2: Manage Channels and Roles
     * * 3: Ban Kick
     * * 4: ADMINSTRATORS
     * * 5: Owner of the bots (config.json)
     */
    permLevel: 0,
    cooldown: {
        enable: true, //? true false
        timeout: 90, //? Seconds
        type: "user", //? "any", "guild", "user" or "member"
        errormsg: "You should wait {time}.",
    },
    help: {
        name: "Example",
        desc: "example description",
    },
    //* Name and description for help command
    /**
     * @param {Discord.Message} msg
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    execute(msg, args, client) {
        //! YOUR CODE HERE
        console.log(this.trigger + " triggered!");
    },
};
