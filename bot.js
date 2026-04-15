const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const CREDIT = "⚡ 𝑺𝒌 ꭗ 𓆩𝐌.𝐒.𝐃𓆪 & ☠︎𝙑𝙞𝙧𝙖𝙩𓆪";

const API_BASE = "https://api.vectorxo.online/lookup";
const API_KEY = "vectorxo";

const bot = new TelegramBot("8716571092:AAEE3VH9PAHQJBSC9vmLY1jrfrIizX6XcsM", { polling: true });

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
    return bot.sendMessage(chatId, "❌ 10 digit valid mobile number bhejo.");
  }

  const url = `\( {API_BASE}?key= \){API_KEY}&mobile=${number}`;

  try {
    // User ko waiting message
    const waitMsg = await bot.sendMessage(chatId, "🔍 Searching... Please wait (10-15 sec)");

    const res = await axios.get(url, {
      timeout: 25000,   // 25 seconds (bahut important)
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = res.data;
    const results = Array.isArray(data) ? data : [data];

    if (!results.length || !results[0]?.mobile) {
      return bot.sendMessage(chatId, "❌ No Data Found");
    }

    const info = results[0];   // Pehla result best hota hai

    const message = `╭━━━ 💀 NUMBER INFO ━━━╮
📱 Number: ${info.mobile}
👤 Name: ${info.name || "N/A"}
👨 Father: ${info.fname || "N/A"}
📍 Address: ${info.address || "N/A"}
📡 Circle: ${info.circle || "N/A"}
${info.alt ? `🔁 Alt Number: ${info.alt}` : ''}

╰━━━━━━━━━━━━━━╯
${CREDIT}`;

    bot.sendMessage(chatId, message);

  } catch (error) {
    console.error("API Error Details:", error.message || error);

    if (error.code === 'ECONNABORTED') {
      bot.sendMessage(chatId, "⚠️ API bahut slow hai right now.\n10-20 seconds baad phir try karo.");
    } else {
      bot.sendMessage(chatId, "⚠️ API Error\nThodi der baad try karo.");
    }
  }
});

app.get("/", (req, res) => res.send("Bot Running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot Running on port ${PORT}`);
});
