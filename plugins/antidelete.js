const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const tempFolder = path.join(__dirname, '../temp');
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
}

const messageStore = new Map();
const mediaStore = new Map();

const CLEANUP_TIME = 10 * 60 * 1000;

function unwrapMessage(message) {
  if (!message) return null;

  if (message.ephemeralMessage) {
    return unwrapMessage(message.ephemeralMessage.message);
  }

  if (message.viewOnceMessageV2) {
    return unwrapMessage(message.viewOnceMessageV2.message);
  }

  if (message.viewOnceMessage) {
    return unwrapMessage(message.viewOnceMessage.message);
  }

  return message;
}

function getExtension(type, msg) {
  switch (type) {
    case 'imageMessage': return '.jpg';
    case 'videoMessage': return '.mp4';
    case 'audioMessage': return '.ogg';
    case 'stickerMessage': return '.webp';
    case 'documentMessage':
      return msg.documentMessage?.fileName
        ? path.extname(msg.documentMessage.fileName)
        : '.bin';
    default:
      return '.bin';
  }
}

function getSriLankaTime() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Colombo',
    hour12: true
  });
}

function makeCaption(sender, messageText) {
  return `*╭─「 🫟Message Recovered🫟」*
┃ ➤ *👤 Sender* : @${sender.split('@')[0]}
┃ ➤ *🕒 Time* : ${getSriLankaTime()}
┃ ➤ *📝 Message* : ${messageText || 'Media Message'}
*╰──────────────❖◆►*
©️ 𝟸𝟶𝟸𝟼 𝚉𝚎𝚛𝚘-𝚇 𝙼𝙳`;
}

module.exports = {
  name: 'antidelete',

  onMessage: async (anarga, msg) => {
    if (!msg?.message || msg.key.fromMe) return;

    const keyId = msg.key.id;
    const remoteJid = msg.key.remoteJid;

    const cleanMessage = unwrapMessage(msg.message);
    if (!cleanMessage) return;

    messageStore.set(keyId, {
      key: msg.key,
      message: cleanMessage,
      remoteJid
    });

    const type = Object.keys(cleanMessage)[0];
    if (!type) return;

    const mediaTypes = [
      'imageMessage',
      'videoMessage',
      'audioMessage',
      'stickerMessage',
      'documentMessage'
    ];

    if (!mediaTypes.includes(type)) return;

    try {
      const stream = await downloadContentFromMessage(
        cleanMessage[type],
        type.replace('Message', '')
      );

      let buffer = Buffer.from([]);

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      if (!buffer.length) return;

      const ext = getExtension(type, cleanMessage);
      const filePath = path.join(tempFolder, `${keyId}${ext}`);

      await fs.promises.writeFile(filePath, buffer);
      mediaStore.set(keyId, filePath);

      setTimeout(() => {
        messageStore.delete(keyId);

        if (mediaStore.has(keyId)) {
          try {
            fs.unlinkSync(mediaStore.get(keyId));
          } catch {}

          mediaStore.delete(keyId);
        }
      }, CLEANUP_TIME);

    } catch (err) {
      console.log('❌ AntiDelete media download error:', err.message);
    }
  },

  onDelete: async (anarga, updates) => {
    for (const update of updates) {
      const key = update?.key;
      if (!key?.id) continue;

      const isDelete =
        update.action === 'delete' ||
        update.update?.message === null;

      if (!isDelete) continue;

      const keyId = key.id;
      const stored = messageStore.get(keyId);
      if (!stored) continue;

      const from = key.remoteJid;
      const sender = key.participant || from;

      try {
        const msgObj = stored.message;

        const messageText =
          msgObj.conversation ||
          msgObj.extendedTextMessage?.text ||
          msgObj.imageMessage?.caption ||
          msgObj.videoMessage?.caption ||
          msgObj.documentMessage?.caption ||
          '';

        const caption = makeCaption(sender, messageText);

        const mediaPath = mediaStore.get(keyId);

        if (mediaPath && fs.existsSync(mediaPath)) {
          const opts = {
            caption,
            mentions: [sender]
          };

          if (mediaPath.endsWith('.jpg')) {
            await anarga.sendMessage(from, {
              image: { url: mediaPath },
              ...opts
            });

          } else if (mediaPath.endsWith('.mp4')) {
            await anarga.sendMessage(from, {
              video: { url: mediaPath },
              ...opts
            });

          } else if (mediaPath.endsWith('.webp')) {
            await anarga.sendMessage(from, {
              sticker: { url: mediaPath }
            });

            await anarga.sendMessage(from, {
              text: caption,
              mentions: [sender]
            });

          } else if (mediaPath.endsWith('.ogg')) {
            await anarga.sendMessage(from, {
              audio: { url: mediaPath },
              mimetype: 'audio/ogg; codecs=opus'
            });

            await anarga.sendMessage(from, {
              text: caption,
              mentions: [sender]
            });

          } else {
            await anarga.sendMessage(from, {
              document: { url: mediaPath },
              ...opts
            });
          }

          continue;
        }

        await anarga.sendMessage(from, {
          text: caption,
          mentions: [sender]
        });

      } catch (err) {
        console.log('❌ AntiDelete resend error:', err.message);
      }
    }
  }
};
