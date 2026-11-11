const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "Tgp2Cabb#SZxhIQSJsH83YbpVwJ9yWCNPkg67KRfpgXB4uvycOUQ",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/anarga-ofc/Zero-Md/blob/main/lib/Menu-anrga.PNG?raw=true",
ALIVE_MSG: process.env.ALIVE_MSG || `👋 𝐇𝐈, *WΞLCΩMΞ TΩ USΞR* 𝐈❜𝐀𝐌 𝐀𝐋𝐈𝐕𝐄 𝐍𝐎𝐖 👾

*╭─「  ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ  」*
*┃* ❖ 🧑‍💻 *Owner* : *ᴀɴᴀʀɢᴀ.ᴍ.ꜱ*
*┃* ❖ ⏰ *Time* : 17:57:11
*╰─────────────❖●►*

*╭─「  ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ  」*
*┃* ➤ 👩‍💼 *User* : *USER*
*┃* ➤ ✒️ *Prefix* : *(.)*
*┃* ➤ 🧬 *Version* : *ᴠ3.0 ᴜʟᴛʀᴀ*
*┃* ➤ 🖥️ *Platform* : *ʟɪɴᴜx*
*┃* ➤ 📡 *Host* : *ᴢᴇʀᴏ-x ᴠᴘꜱ*
*┃* ➤ 📟 *Uptime* : *0h 1m 52s*
*┃* ➤ 📂 *Memory* : *255.2MB / 15984MB*
*╰─────────────❖◆►*

*╭─「 ᴢᴇʀᴏ-x ᴍᴅ ᴜᴘᴅᴀᴛᴇ & ᴅᴇᴘʟᴏʏ 」*
┃  *ᴊᴏɪɴ ɴᴇᴡ ÷*
┃
*╰──────────❖✦►*

> ©️𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙰𝚗𝚊𝚛𝚐𝚊-𝕏`,
BOT_OWNER: '+94767467020',  // Replace with the owner's phone number
AUTO_STATUS_SEEN: 'true',
AUTO_STATUS_REACT: 'true',



};
