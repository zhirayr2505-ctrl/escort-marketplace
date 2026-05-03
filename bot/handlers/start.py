import os

from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import (
    KeyboardButton,
    Message,
    ReplyKeyboardMarkup,
    WebAppInfo,
)

router = Router(name="start")


def _webapp_url() -> str:
    return (os.getenv("WEBAPP_URL") or "").strip().rstrip("/")


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    url = _webapp_url()
    text = (
        "Привет! Нажми кнопку ниже — откроется каталог маркетплейса (Mini App).\n"
        "В BotFather для бота должен быть добавлен тот же домен, что в начале ссылки "
        "(Settings → Configure Mini App / Domain)."
    )

    if not url:
        await message.answer(
            text
            + "\n\n⚠️ В `bot/.env` не задан `WEBAPP_URL` "
            "(например https://escort-marketplace.vercel.app)."
        )
        return

    keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="Открыть маркетплейс", web_app=WebAppInfo(url=url))]],
        resize_keyboard=True,
    )
    await message.answer(text, reply_markup=keyboard)
