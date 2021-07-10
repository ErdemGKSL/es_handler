const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
	name: "ping",
	//? İsmi
	description: "pingini söyler",
	//? Açıklama
	options: [
		{
			name: "embed",
			description: "embedli mi olsun?",
			type: 4, // 4 = Sayı demek
			required: true,
			choices: [
				{
					name: "Olsun",
					value: 1
				},
				{
					name: "Olmasın",
					value: 0
				}
			]
		}
	],
	//? Eğer Tetiklenme tipi "command" ise ana komut dışındaki tetiklenmeler.
	workOnly: "all", //? "guild" , "dm" , "all"
	//? Sadece Sunucularda'mı Çalışsın
	ignoreBots: true, //?Botlar umursanmasın mı
	/**
	 * * 0: Herkes
	 * * 1: Alt Yetkililer (Mesajları yönet vb.)
	 * * 2: Orta Yetkililer (Kanalları veya Rolleri yönet vb.)
	 * * 3: Üst Yetkililer (BAN veya KICK)
	 * * 4: Yöneticiler (ADMINSTRATORS)
	 * * 5: Botun Sahipleri (config.json)
	 */
	permLevel: 0,
	cooldown: {
		enable: true, //? true false
		timeout: 90, //? SANİYE | Seconds
		type: "user", //? "any", "guild", "user", "member"
		errormsg: "Bi dur la {time} bekler misin kardeş"
	},
	//* Bekleme Süresi
	//* enable: Açıksa true Kapalı İse False
	//* timeout: kaç saniye beklesinler
	//* type: ne kadar kapsamlı olsun Kullanılabilir: "any" (heryerde) "guild" (sunucu başına) "user" (kullanıcı başına) "member" (sunucudaki üye başına)
	//! guildOnly kapalı ise "guild" ve "member" çalışmaz!!!!
	//* errormsg: Hata Mesajı, {time} yazdığınız yere kalan bekleme süresi gelmektedir.

	/**
	 * @param {Discord.Client} client
	 */
	execute(i, client) {
		const dping = client.ws.ping;
		let data = i.data.options.find((d) => d.name == "embed");
		if (data.value) {
			return u.embed({
				desc: `Discordun pingi: ${dping}`
			});
		} else {
			return `Discordun pingi: ${dping}`;
		}
	}
};
