const Discord = require("discord.js");

module.exports = {
    arr: {
        /**
         * @param {Array} a
         * @returns {Array}
         */
        kar(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        },
        /**
         * @param {Array} arr
         */
        rand(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        /**
         * @param {Array} arr
         * @returns {Array}
         */
        sil(arr) {
            var what,
                a = arguments,
                L = a.length,
                ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax = arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        },
    },
    misc: {
        /**
         * @param {Number} length
         * @returns {String}
         */
        randtext(length) {
            var result = [];
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result.push(
                    characters.charAt(
                        Math.floor(Math.random() * charactersLength)
                    )
                );
            }
            return result.join("");
        },
        /**
         * @param {Number} min
         * @param {Number} max
         * @returns {Number}
         */
        randInt(min, max) {
            let m = max + 1;
            return Math.floor(Math.random() * (m - min)) + min;
        },
    },
    /**
     * @param {Object} embed
     * @param {String} embed.title
     * @param {String} embed.desc
     * @param {String} embed.color
     * @param {String} embed.thumb
     * @param {String} embed.image
     * @param {Object} embed.footer
     * @param {String} embed.footer.icon
     * @param {String} embed.footer.text
     * @param {Number|Date} embed.time
     * @param {Array[]} embed.field
     * @returns {Discord.MessageEmbed}
     */
    embed(embed) {
        const embed2 = new Discord.MessageEmbed()
            .setColor(embed.color ? embed.color : "#0099ff")
            .setTitle(embed.title ? embed.title : "")
            .setDescription(embed.desc ? embed.desc : "Açıklama");
        if (embed.thumb) embed2.setThumbnail(embed.thumb);
        if (embed.image) embed2.setImage(embed.image);
        if (embed.footer)
            embed2.setFooter(embed.footer.text || "", embed.footer.icon || "");
        if (embed.time) embed2.setTimestamp(embed.time);
        if (embed.field) {
            embed.field.forEach((x) => {
                embed2.addField(x[0], x[1], x[2]);
            });
        }

        return embed2;
    },
};
