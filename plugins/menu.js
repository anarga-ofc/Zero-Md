const { cmd, commands } = require("../command");
const os = require("os");

cmd(
  {
    pattern: "menu",
    desc: "Displays all available commands",
    category: "main",
    filename: __filename,
  },
  async (anarga, mek, m, { from, reply }) => {
    try {
      const categories = {};

      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";

        if (!categories[cat]) categories[cat] = [];

        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description"
        });
      }

      // SYSTEM INFORMATION
      const usedRAM = Math.round(
        (os.totalmem() - os.freemem()) / 1024 / 1024
      );

      const totalRAM = Math.round(os.totalmem() / 1024 / 1024);

      const uptime = Math.floor(process.uptime());
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = uptime % 60;

      const formattedUptime = `${hours}h ${minutes}m ${seconds}s`;

      const now = new Date();

      const time = now.toLocaleTimeString("en-US", {
        hour12: true
      });

      const date = now.toISOString().split("T")[0];

      const categoryNames = Object.keys(categories);

      const categoryIcons = {
        main: "🛡️",
        anime: "😘",
        edits: "🎨",
        search: "🔍",
        ai: "✨",
        group: "🎭",
        mathtool: "🛠️",
        downloades: "📥",
        downloads: "📥"
      };

      // MENU HEADER
      let menuText = `👋 Hello, Welcome メ Zero-𝙈𝘿 メ

🫟 *WΞLCΩMΞ TΩ Zero-X MD* 🫟

*╭─「 STATUS DETAILS 」────❖◆►*
┃➤ 🧑‍💻 *𝙾𝚆𝙽𝙴𝚁* : [Anarga]
┃➤ 📌 *𝙿𝚁𝙴𝙵𝙸𝚇* : [.]
┃➤ 🎲 *𝙼𝙾𝙳𝙴* : [Private]
┃➤ 💻 *𝙿𝙻𝙰𝚃𝙵𝙾𝚁𝙼* : [${os.platform()}]
┃➤ 📞 *𝙾𝚆𝙽𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁* : [94767467020]
┃➤ 💾 *𝚁𝙰𝙼* : [${usedRAM} MB / ${totalRAM} MB]
┃➤ ⏱️ *𝚄𝙿𝚃𝙸𝙼𝙴* : [${formattedUptime}]
┃➤ ⏰ *𝚃𝙸𝙼𝙴* : [${time}]
┃➤ 📅 *𝙳𝙰𝚃𝙴* : [${date}]
┃➤ 📂 *𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝙸𝙴𝚂* : [${categoryNames.length}]
*╰───────────────❖◆►*

*Reply Below Number 🔢*

*╭──────────❖●►*
┃📖 *LIST MENU*
┃ ◄❖══════❖►`;

      // CATEGORY LIST
      categoryNames.forEach((cat, index) => {
        const icon = categoryIcons[cat] || "📁";

        menuText += `\n┃❖ _${index + 1}._ ${icon} *${cat.toUpperCase()}*`;
      });

      menuText += `\n*╰───────────❖●►*

`;

      // COMMAND LIST
      for (const [cat, cmds] of Object.entries(categories)) {
        const icon = categoryIcons[cat] || "📁";

        menuText += `\n*╭─「 ${icon} ${cat.toUpperCase()} 」*\n`;

        cmds.forEach(c => {
          menuText += `┃ ➤ .${c.pattern} : ${c.desc}\n`;
        });

        menuText += `*╰──────────────❖◆►*\n`;
      }

      menuText += `\n©️ 𝟸𝟶𝟸𝟼 𝚉𝚎𝚛𝚘-𝚇 𝙼𝙳`;

      await reply(menuText.trim());

    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
