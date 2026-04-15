const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const CREDIT = "⚡ 𝑺𝒌 ꭗ 𓆩𝐌.𝐒.𝐃𓆪 & ☠︎𝙑𝙞𝙧𝙖𝙩𓆪";

// ==================== VECTORXO API ====================
const API_BASE = "https://api.vectorxo.online/lookup";
const API_KEY = "vectorxo";

// BOT
const bot = new TelegramBot("8716571092:AAEE3VH9PAHQJBSC9vmLY1jrfrIizX6XcsM", { polling: true });

// START Command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`💀 NUMBER INFO BOT

Command: /num 9876543210

${CREDIT}`);
});

// NUMBER Command
bot.onText(/\/num (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  let number = match[1].trim().replace(/^(\+91|91|0)/, '');

  if (number.length !== 10 || isNaN(number)) {
    return bot.sendMessage(chatId, "❌ 10 digit valid number bhejo.");
  }

  const url = `\( {API_BASE}?key= \){API_KEY}&mobile=${number}`;

  try {
    bot.sendMessage(chatId, "🔍 Searching... Please wait.");   // ← User ko pata chale

    const res = await axios.get(url, {
      timeout: 20000,                    // 20 seconds timeout (important)
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NumberBot/1.0)"
      }
    });

    const data = res.data;
    const results = Array.isArray(data) ? data : [data];

    if (!results.length || !results[0]?.mobile) {
      return bot.sendMessage(chatId, "❌ No Data Found");
    }

    // Best result (pehle wala)
    const info = results[0];

    const message = `╭━━━ 💀 NUMBER INFO ━━━╮
📱 Number: ${info.mobile}
👤 Name: ${info.name || "N/A"}
👨 Father: ${info.fname || "N/A"}
📍 Address: ${info.address || "N/A"}
📡 Circle: ${info.circle || "N/A"}
${info.alt ? `🔁 Alt: ${info.alt}` : ''}

╰━━━━━━━━━━━━━━╯
${CREDIT}`;

    bot.sendMessage(chatId, message);

  } catch (error) {
    console.error("Full Error:", error.message);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      bot.sendMessage(chatId, "⚠️ API slow chal rahi hai.\n10-15 seconds baad phir try karo.");
    } else {
      bot.sendMessage(chatId, "⚠️ API Error\nThodi der baad try karo.");
    }
  }
});

// Server
app.get("/", (req, res) => res.send("Bot Running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bot is running on port ${PORT}`);
});
