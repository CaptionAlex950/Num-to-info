const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const CREDIT = "⚡ 𝑺𝒌 ꭗ 𓆩𝐌.𝐒.𝐃𓆪 & ☠︎𝙑𝙞𝙧𝙖𝙩𓆪";

// New API
const API_BASE = "https://api.vectorxo.online/lookup";
const API_KEY = "vectorxo";

// BOT
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
    return bot.sendMessage(chatId, "❌ Please send a valid 10-digit Indian mobile number.");
  }

  const url = `\( {API_BASE}?key= \){API_KEY}&mobile=${number}`;

  try {
    // Increased timeout + better config
    const res = await axios.get(url, { 
      timeout: 15000,           // 15 seconds timeout
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = res.data;

    // API mostly returns array
    const results = Array.isArray(data) ? data : [data];

    if (!results || results.length === 0 || !results[0].mobile) {
      return bot.sendMessage(chatId, "❌ No Data Found for this number.");
    }

    // Agar multiple results hain to pehle wala best dikhao
    const info = results[0];

    bot.sendMessage(chatId,
`╭━━━ 💀 NUMBER INFO ━━━╮
📱 Number: ${info.mobile}
👤 Name: ${info.name || "N/A"}
👨 Father: ${info.fname || "N/A"}
📍 Address: ${info.address || "N/A"}
📡 Circle: ${info.circle || "N/A"}

╰━━━━━━━━━━━━━━╯
${CREDIT}`);

  } catch (error) {
    console.error("API Error:", error.message);   // Console mein detail dikhega

    if (error.code === 'ECONNABORTED') {
      bot.sendMessage(chatId, "⚠️ API is slow right now.\nTry again after 10-15 seconds.");
    } else if (error.response) {
      bot.sendMessage(chatId, `⚠️ API Error (${error.response.status})\nTry again later.`);
    } else {
      bot.sendMessage(chatId, "⚠️ API Error\nTry again later.");
    }
  }
});

// Server
app.get("/", (req, res) => res.send("Bot Running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot Running on port ${PORT}`);
});
