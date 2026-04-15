const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const CREDIT = "⚡ 𝑺𝒌 ꭗ 𓆩𝐌.𝐒.𝐃𓆪 & ☠︎𝙑𝙞𝙧𝙖𝙩𓆪";

const API_BASE = "https://api.vectorxo.online/lookup";
const API_KEY = "vectorxo";

const bot = new TelegramBot("8716571092:AAEE3VH9PAHQJBSC9vmLY1jrfrIizX6XcsM", { polling: true });

// ==================== HEROKU KEEP ALIVE ====================
// YAHAN APNA HEROKU APP NAME CHANGE KAR DO
const MY_APP_URL = "https://your-app-name.herokuapp.com";   

setInterval(async () => {
  try {
    await axios.get(MY_APP_URL);
    console.log(`Keep-alive ping at ${new Date().toLocaleTimeString()}`);
  } catch (e) {}
}, 20 * 60 * 1000);

// START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`💀 NUMBER INFO BOT

Command: /num 9876543210

${CREDIT}`);
});

// NUMBER COMMAND
bot.onText(/\/num (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  let number = match[1].trim().replace(/^(\+91|91|0)/, '');

  if (number.length !== 10 || isNaN(number)) {
    return bot.sendMessage(chatId, "❌ 10 digit valid number bhejo");
  }

  try {
    await bot.sendMessage(chatId, "🔍 Searching... (10-20 seconds lag sakte hain)");

    const res = await axios.get(`\( {API_BASE}?key= \){API_KEY}&mobile=${number}`, {
      timeout: 25000,
    });

    const results = Array.isArray(res.data) ? res.data : [res.data];

    if (!results.length || !results[0]?.mobile) {
      return bot.sendMessage(chatId, "❌ No Data Found");
    }

    const info = results[0];

    const text = `╭━━━ 💀 NUMBER INFO ━━━╮
📱 Number: ${info.mobile}
👤 Name: ${info.name || "N/A"}
👨 Father: ${info.fname || "N/A"}
📍 Address: ${info.address || "N/A"}
📡 Circle: ${info.circle || "N/A"}
${info.alt ? `🔁 Alt: ${info.alt}` : ''}

╰━━━━━━━━━━━━━━╯
${CREDIT}`;

    bot.sendMessage(chatId, text);

  } catch (error) {
    console.error("API Error:", error.message);
    bot.sendMessage(chatId, "⚠️ API slow hai.\n15-20 sec baad phir try karo.");
  }
});

app.get("/", (req, res) => {
  res.send("Bot Running ✅ | Heroku Keep-Alive Active");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bot running on port ${PORT}`);
});
