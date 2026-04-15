import telebot
import requests
import os
from datetime import datetime

# Token Heroku Config Vars se lega
BOT_TOKEN = os.getenv("BOT_TOKEN")

if not BOT_TOKEN:
    raise ValueError("❌ BOT_TOKEN nahi mila! Heroku Settings > Config Vars mein add karo.")

bot = telebot.TeleBot(BOT_TOKEN)

def mobile_lookup(mobile):
    try:
        url = f"https://api.vectorxo.online/lookup?key=vectorxo&mobile={mobile}"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()

        if isinstance(data, list) and data:
            rec = data[0]
            return f"""✅ **Lookup Successful**

📱 **Mobile** : `{rec.get('mobile', 'N/A')}`
👤 **Name**    : {rec.get('name', 'N/A')}
👨‍👧 **Father** : {rec.get('fname', 'N/A')}
📍 **Address** : {rec.get('address', 'N/A')}
📡 **Circle**  : {rec.get('circle', 'N/A')}
🆔 **ID**      : {rec.get('id', 'N/A')}
⏰ **Time**    : {datetime.now().strftime("%d-%m-%Y %I:%M %p")}"""
        else:
            return "❌ Is number ka data nahi mila."
    except Exception as e:
        return f"❌ Error: {str(e)}"

@bot.message_handler(commands=['start'])
def start(msg):
    bot.reply_to(msg, "👋 **Bot Ready hai!**\n\nKoi 10 digit mobile number bhejo...")

@bot.message_handler(func=lambda m: True)
def handle(msg):
    text = msg.text.strip()
    if text.isdigit() and len(text) == 10:
        bot.send_chat_action(msg.chat.id, 'typing')
        result = mobile_lookup(text)
        bot.reply_to(msg, result, parse_mode="Markdown")
    else:
        bot.reply_to(msg, "⚠️ Sirf 10 digit mobile number bhejo\nExample: `7070727268`")

if __name__ == "__main__":
    print("🤖 Bot Started Successfully on Heroku...")
    bot.infinity_polling()
