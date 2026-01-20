from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = "8215798352:AAETTckhkTw6vxCzmK8q7I7mVx-go4SjWDk"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("Comando /start recebido")

    keyboard = [
        [KeyboardButton(
            text="📦 Abrir Controle de Estoque",
            web_app=WebAppInfo(
                url="https://guimaraesna.github.io/telegram-miniapp/"
            )
        )]
    ]

    reply_markup = ReplyKeyboardMarkup(
        keyboard, resize_keyboard=True
    )

    await update.message.reply_text(
        "Clique no botão abaixo 👇",
        reply_markup=reply_markup
    )

if __name__ == "__main__":
    print("Iniciando bot...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()
