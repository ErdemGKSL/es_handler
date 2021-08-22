module.exports = {
    name: "dm",
    aliases: ["dm-at"],
    async execute(cmd,args,client) {
        console.log(args)
        let id = args.shift();
        let content = args.join(" ");
        let user = await client.users.cache.get(id);
        if(user) {
            if(content.length > 0) {
                await user.send(content)
                console.log("Succesful!")
            } else console.log("Please insert a message to send")
        } else console.log("please specify a valid user's id")
    }
}
