const Discord = require("discord.js");
const { token, prefix, owners, bot_id } = require("./config.json");
const { Client } = require("discord-slash-commands-client");
const interclient = new Client(token, bot_id);
require("discord-reply");
const client = new Discord.Client();
const fs = require("fs");
const chalk = require("chalk");
const u = require("./utils.js");
const { embed } = require("./utils.js");
const cooldown = new Discord.Collection();

client.commands = new Discord.Collection();
client.prefix = prefix;
const eventFiles = fs.readdirSync("./events").filter((x) => x.endsWith(".js"));
if (eventFiles.length > 0) {
	console.log(chalk.magenta.bold.underline("Eventler Yükleniyor...") + "\n ");
}
eventFiles.forEach((file) => {
	const event = require(`./events/${file}`);
	event.execute(client);
	console.log(chalk.blueBright.italic(`> ${event.name} Eventi Yüklendi!`));
});
client.on("ready", () => {
	console.log(
		chalk.green.bold(`${client.user.tag} adlı bota giriş yapıldı!`)
	);
});
const incommandFiles = fs
	.readdirSync("./commands")
	.filter((x) => !x.includes("."));

const commandFiles = fs
	.readdirSync("./commands")
	.filter((x) => x.endsWith(".js"));

incommandFiles.forEach((folder) => {
	const lcommandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((x) => x.endsWith(".js"));
	if (lcommandFiles.length > 0) {
		console.log(
			chalk.magenta.bold.underline(
				`${folder} Dosyasından Komutlar Yükleniyor...`
			) + "\n "
		);
	}
	lcommandFiles.forEach((file) => {
		const command = require(`./commands/${folder}/${file}`);
		let name = file.slice(0, file.length - 3);
		client.commands.set(name, command);
		console.log(chalk.blueBright.italic(`> ${name} Komutu Yüklendi!`));
	});
});
if (commandFiles.length > 0) {
	console.log(chalk.magenta.bold.underline("Komutlar Yükleniyor...") + "\n ");
}
commandFiles.forEach((file) => {
	const command = require(`./commands/${file}`);
	let name = file.slice(0, file.length - 3);
	client.commands.set(name, command);
	console.log(chalk.blueBright.italic(`> ${name} Komutu Yüklendi!`));
});

client.slashcommands = new Discord.Collection();

setTimeout(async () => {
	const slashCommandFiles = fs
		.readdirSync("./slashcommands")
		.filter((x) => x.endsWith(".js"));

	if (slashCommandFiles.length > 0) {
		console.log(
			chalk.magenta.bold.underline("Slash Komutları Yükleniyor...") +
				"\n "
		);
	}
	let all = await interclient.getCommands({});
	await slashCommandFiles.forEach((file) => {
		const command = require(`./slashcommands/${file}`);
		client.slashcommands.set(command.name, command);
		let ocmd = all.find(
			(ck) =>
				ck.name == command.name &&
				JSON.stringify(ck.options) == JSON.stringify(command.options) &&
				ck.description == command.description
		);
		if (ocmd) {
			console.log(
				chalk.blueBright.italic(`> ${command.name} Komutu Yüklendi!`)
			);
			return;
		}
		let ecmd = all.find((ck) => ck.name == command.name);
		if (ecmd) {
			interclient.editCommand(
				{
					name: command.name,
					description: command.description,
					options: command.options ? command.options : undefined
				},
				ecmd.id
			);
			console.log(
				chalk.blueBright.italic(`> ${command.name} Komutu Düzenlendi!`)
			);
			return;
		}
		if (command.options) {
			interclient
				.createCommand({
					name: command.name,
					description: command.description,
					options: command.options
				})
				.catch(command.name + " yüklenemedi!")
				.then(() => {
					console.log(
						chalk.blueBright.italic(
							`> ${command.name} Komutu Yaratıldı!`
						)
					);
				});
		} else {
			interclient
				.createCommand({
					name: command.name,
					description: command.description
				})
				.catch(command.name + " yüklenemedi!")
				.then(() => {
					console.log(
						chalk.blueBright.italic(
							`> ${command.name} Komutu Yaratıldı!`
						)
					);
				});
		}
	});
	let names = await client.slashcommands.map((command) => command.name);
	let allx = await all.filter((c) => !names.includes(c.name));

	await allx.forEach((cx) => {
		interclient.deleteCommand(cx.id);
		console.log(
			chalk.redBright(
				"> " + cx.name + " komutu artık olmadığı için silindi."
			)
		);
	});
}, 30);
client.ws.on("INTERACTION_CREATE", async (i) => {
	let member;
	let author;
	let guild;
	let channel = client.channels.cache.get(i.channel_id);
	
	if (i.guild_id) {
		guild = await client.guilds.cache.get(i.guild_id);
		author = await client.users.cache.get(i.member.user.id);
		member = await guild.members.cache.get(i.member.user.id);
	} else {
		author = await client.users.cache.get(i.user.id);
	}

	let command = client.slashcommands.get(i.data.name);
	if (command) {
		if (command.workOnly) {
			if (command.workOnly.toLowerCase() == "dm" && i.guild_id)
				return respond(
					i,
					"Bu komut sadece DM'lerde kullanılmaz üzere tasarlanmıştır!",
					1
				);
			if (command.workOnly.toLowerCase() == "guild" && !i.guild_id)
				return respond(
					i,
					"Bu komut sadece sunucularda kullanılabilir!",
					1
				);
		}
		if (command.workOnly.toLowerCase() == "guild" && command.permLevel) {
			let permlvl = 0;
			if (
				member.hasPermission(
					"MANAGE_EMOJIS" || "MANAGE_MESSAGES" || "MANAGE_NICKNAMES"
				)
			)
				permlvl = 1;
			if (member.hasPermission("MANAGE_CHANNELS" || "MANAGE_ROLES"))
				permlvl = 2;
			if (member.hasPermission("BAN_MEMBERS" || "KICK_MEMBERS"))
				permlvl = 3;
			if (member.hasPermission("ADMINISTRATOR")) permlvl = 4;
			if (owners.includes(author.id)) permlvl = 5;
			if (command.permLevel > permlvl)
				return respond(i, "Yetersiz Yetki!", 1);
		}

		if (command.cooldown && command.cooldown.enable) {
			let cnm = command.name + author.id;
			let type = command.cooldown.type;
			let wait = 10000;
			if (type == "member" && command.workOnly.toLowerCase() == "guild") {
				cnm = command.name + author.id + guild.id;
			} else if (type == "any") {
				cnm = command.name;
			} else if (
				type == "guild" &&
				command.workOnly.toLowerCase() == "guild"
			) {
				cnm = command.name + guild.id;
			}
			if (command.cooldown.timeout) {
				wait = command.cooldown.timeout * 1000;
			}
			if (cooldown.get(cnm)) {
				let d = new Date().getTime();
				let kalan = u.okunur_zaman(wait - (d - cooldown.get(cnm)));
				if (command.cooldown.errormsg) {
					if (command.cooldown.errormsg === "") {
						respond(i, `Komut Bekleme Süresinde... ${kalan}`, 1);
					} else {
						let emsg = command.cooldown.errormsg.replace(
							"{time}",
							kalan
						);
						respond(i, emsg, 1);
					}
				}
				return;
			} else {
				let d = new Date().getTime();
				cooldown.set(cnm, d);
				setTimeout(() => {
					cooldown.delete(cnm);
				}, wait);
			}
		}
		if (command.ignoreBots && author.bot) return;
		try {
			let msg = command.execute(i, client);
			if (msg) {
				respond(i, msg);
			}
		} catch (e) {
			console.error(e);
			respond(i, "Bir hata oluştu!", 1);
		}
	}
});

client.on("message", (msg) => {
	if (client.user.id == msg.author.id) return;
	let content = msg.content.toLowerCase();
	let gprefix = prefix + "";
	const args = msg.content.slice(gprefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	let commands = client.commands.filter(
		(x) =>
			x.type == "always" ||
			(content.startsWith(prefix) &&
				(x.type == "command" || !x.type) &&
				((x.aliases && x.aliases.includes(commandName)) ||
					x.trigger == commandName)) ||
			(x.type == "contains" && content.includes(x.trigger)) ||
			(x.type == "start" && content.startsWith(x.trigger)) ||
			(x.type == "end" && content.endsWith(x.trigger)) ||
			(x.type == "exact" && content == x.trigger) ||
			(x.type == "regex" && content.match(new RegExp(x.trigger, "i")))
	);
	if (!commands) return;
	commands.forEach((command) => {
		if (command.workOnly) {
			if (command.workOnly.toLowerCase() == "dm" && msg.guild)
				return msg.lineReply(
					"Bu komut sadece DM'lerde kullanılmaz üzere tasarlanmıştır!"
				);
			if (command.workOnly.toLowerCase() == "guild" && !msg.guild)
				return msg.lineReply(
					"Bu komut sadece sunucularda kullanılabilir!"
				);
		}
		if (command.workOnly.toLowerCase() == "guild" && command.permLevel) {
			let permlvl = 0;
			if (
				msg.member.hasPermission(
					"MANAGE_EMOJIS" || "MANAGE_MESSAGES" || "MANAGE_NICKNAMES"
				)
			)
				permlvl = 1;
			if (msg.member.hasPermission("MANAGE_CHANNELS" || "MANAGE_ROLES"))
				permlvl = 2;
			if (msg.member.hasPermission("BAN_MEMBERS" || "KICK_MEMBERS"))
				permlvl = 3;
			if (msg.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
			if (owners.includes(msg.author.id)) permlvl = 5;
			if (command.permLevel > permlvl)
				return msg.lineReply("Yetersiz Yetki!");
		}
		if (command.cooldown && command.cooldown.enable) {
			let cnm = command.trigger + msg.author.id;
			let type = command.cooldown.type;
			let wait = 10000;
			if (type == "member" && command.workOnly.toLowerCase() == "guild") {
				cnm = command.trigger + msg.author.id + msg.guild.id;
			} else if (type == "any") {
				cnm = command.trigger;
			} else if (
				type == "guild" &&
				command.workOnly.toLowerCase() == "guild"
			) {
				cnm = command.trigger + msg.guild.id;
			}
			if (command.cooldown.timeout) {
				wait = command.cooldown.timeout * 1000;
			}
			if (cooldown.get(cnm)) {
				let d = new Date().getTime();
				let kalan = u.okunur_zaman(wait - (d - cooldown.get(cnm)));
				if (command.cooldown.errormsg) {
					if (command.cooldown.errormsg === "") {
						msg.lineReply(`Komut Bekleme Süresinde... ${kalan}`);
					} else {
						let emsg = command.cooldown.errormsg.replace(
							"{time}",
							kalan
						);
						msg.lineReply(emsg);
					}
				}
				return;
			} else {
				let d = new Date().getTime();
				cooldown.set(cnm, d);
				setTimeout(() => {
					cooldown.delete(cnm);
				}, wait);
			}
		}
		if (
			!(
				msg.content.startsWith(gprefix) ||
				command.type == "contains" ||
				"start" ||
				"regex" ||
				"end" ||
				"exact"
			)
		)
			return;
		if (command.ignoreBots && msg.author.bot) return;
		try {
			command.execute(msg, args, client);
		} catch (e) {
			console.error(e);
			msg.lineReply("Bir hata oluştu!");
		}
	});
});
client.login(token);
