const Discord = require("discord.js");
const u = require("../utils.js");
module.exports = {
    trigger: "example",
    //? Tetiklenme İçeriği
    type: "command",
    //? Komutun Tetiklenme Tipi, Kullanılabilir: "regex" "contains" "end" "start" "exact" "command" "always"
    aliases: ["e1", "e2"],
    //? Eğer Tetiklenme tipi "command" ise ana komut dışındaki tetiklenmeler.
    guildOnly: true,
    //? Sadece Sunucularda'mı Çalışsın
    ignoreBots: true, //?Botlar umursanmasın mı
    cooldown: {
        enable: true, //? true false
        timeout: 90, //? SANİYE | Seconds
        type: "user", //? "any", "guild", "user", "member"
        errormsg: "{time} beklemelisin.",
    },
    //* Bekleme Süresi
    //* enable: Açıksa true Kapalı İse False
    //* timeout: kaç saniye beklesinler
    //* type: ne kadar kapsamlı olsun Kullanılabilir: "any" (heryerde) "guild" (sunucu başına) "user" (kullanıcı başına) "member" (sunucudaki üye başına)
    //! guildOnly kapalı ise "guild" ve "member" çalışmaz!!!!
    //* errormsg: Hata Mesajı, {time} yazdığınız yere kalan bekleme süresi gelmektedir.
    help: {
        name: "Example",
        desc: "example description",
    },
    //* Yardım Komutu İçin İsim ve Açıklama
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
