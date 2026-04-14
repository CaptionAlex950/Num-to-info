const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const CREDIT = "⚡ 𝑺𝒌 ꭗ 𓆩𝐌.𝐒.𝐃𓆪 & ☠︎𝙑𝙞𝙧𝙖𝙩𓆪";

// ==================== NEW API ====================
const API_BASE = "https://api.vectorxo.online/lookup";
const API_KEY = "vectorxo";   // Your key

// BOT
const bot = new TelegramBot("8716571092:AAEE3VH9PAHQJBSC9vmLY1jrfrIizX6XcsM", { polling: true });

// START Command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`💀 NUMBER INFO BOT

Command:
/num 9876543210

${CREDIT}`);
});

// NUMBER Command
bot.onText(/\/num (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  let number = match[1].trim();

  // Optional: Remove +91 or 0 if user sends with prefix
  number = number.replace(/^(\+91|91|0)/, '');

  if (number.length !== 10 || isNaN(number)) {
    return bot.sendMessage(chatId, "❌ Please send a valid 10-digit Indian mobile number.");
  }

  const url = `\( {API_BASE}?key= \){API_KEY}&mobile=${number}`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    // New API returns an array → take the first result
    let result = Array.isArray(data) ? data[0] : data;

    if (!result || !result.mobile) {
      return bot.sendMessage(chatId, "❌ No Data Found");
    }

    bot.sendMessage(chatId,
`╭━━━ 💀 NUMBER INFO ━━━╮
📱 Number: ${result.mobile}
👤 Name: ${result.name || "N/A"}
👨 Father: ${result.fname || "N/A"}
📍 Address: ${result.address || "N/A"}
📡 Circle: ${result.circle || "N/A"}

╰━━━━━━━━━━━━━━╯
${CREDIT}`);

  } catch (e) {
    console.error(e.message);
    bot.sendMessage(chatId, "⚠️ API Error\nTry again later.");
  }
});

// SERVER
app.get("/", (req, res) => res.send("Bot Running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
