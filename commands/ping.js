const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
    trigger: "ping",
    //? Tetiklenme İçeriği
    type: "end",
    //? Komutun Tetiklenme Tipi, Kullanılabilir: "regex" "contains" "end" "start" "exact" "command" "always"
    aliases: ["p"],
    //? Eğer Tetiklenme tipi "command" ise ana komut dışındaki tetiklenmeler.
    guildOnly: false,
    //? Sadece Sunucularda'mı Çalışsın
    cooldown: {
        enable: true, //? true false
        timeout: 90, //? SANİYE | Seconds
        type: "user", //? "any", "guild", "user", "member"
        errormsg: "Bi dur la {time} bekler misin kardeş",
    },
    //* Bekleme Süresi
    //* enable: Açıksa true Kapalı İse False
    //* timeout: kaç saniye beklesinler
    //* type: ne kadar kapsamlı olsun Kullanılabilir: "any" (heryerde) "guild" (sunucu başına) "user" (kullanıcı başına) "member" (sunucudaki üye başına)
    //! guildOnly kapalı ise "guild" ve "member" çalışmaz!!!!
    //* errormsg: Hata Mesajı, {time} yazdığınız yere kalan bekleme süresi gelmektedir.
    help: {
        name: "Ping",
        desc: "Botun ve discordun mevcut gecikmesini alır ve size iletir.",
    },
    //* Yardım Komutu İçin İsim ve Açıklama
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
                    title: "Gecikme Ölçümü",
                    desc: "Acaba pingim kaç hadi bakalım 🤔",
                })
            )
            .then((x) => {
                bping = x.createdTimestamp - msg.createdTimestamp;
                setTimeout(() => {
                    x.edit(
                        u.embed({
                            title: "Gecikme Ölçümü",
                            desc: `Discord'un Pingi: ${dping} ms\nBot'un Pingi: ${bping} ms`,
                        })
                    );
                }, 500);
            });
    },
};
