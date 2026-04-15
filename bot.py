import telebot
import requests
import os
from datetime import datetime

# Bot Token Environment se lega (Heroku pe Config Vars mein daalenge)
BOT_TOKEN = os.getenv('BOT_TOKEN')
if not BOT_TOKEN:
    raise ValueError("8716571092:AAEE3VH9PAHQJBSC9vmLY1jrfrIizX6XcsM")

bot = telebot.TeleBot(BOT_TOKEN)

def mobile_lookup(mobile):
    url = f"https://api.vectorxo.online/lookup?key=vectorxo&mobile={mobile}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        if isinstance(data, list) and len(data) > 0:
            rec = data[0]
            return f"""✅ **Lookup Result**

📱 **Mobile** : `{rec.get('mobile', 'N/A')}`
👤 **Name**    : {rec.get('name', 'N/A')}
👨‍👧 **Father** : {rec.get('fname', 'N/A')}
📍 **Address** : {rec.get('address', 'N/A')}
📡 **Circle**  : {rec.get('circle', 'N/A')}
🆔 **ID**      : {rec.get('id', 'N/A')}
⏰ **Time**    : {datetime.now().strftime("%d-%m-%Y %H:%M:%S")}"""
        else:
            return "❌ Koi data nahi mila is number ke liye."

    except Exception as e:
        return f"❌ Error: {str(e)}"

# ====================== COMMANDS ======================
@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(
        message.chat.id,
        "👋 **Welcome to Mobile Lookup Bot!**\n\n"
        "Koi bhi 10 digit mobile number bhejo aur turant information mil jayegi.\n\n"
        "Example: `7070727268`",
        parse_mode="Markdown"
    )

@bot.message_handler(func=lambda message: True)
def handle_message(message):
    text = message.text.strip()
    
    if text.isdigit() and len(text) == 10:
        bot.send_chat_action(message.chat.id, 'typing')
        result = mobile_lookup(text)
        bot.reply_to(message, result, parse_mode="Markdown")
    else:
        bot.reply_to(
            message,
            "⚠️ Sirf **10 digit** mobile number bhejo.\n\nExample: `9876543210`"
        )

# ====================== START BOT ======================
if __name__ == "__main__":
    print("🤖 Bot Started...")
    bot.infinity_polling()
