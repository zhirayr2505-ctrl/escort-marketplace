import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from dotenv import load_dotenv

from handlers import setup_routers

logging.basicConfig(level=logging.INFO)
load_dotenv()


async def main() -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not set")

    bot = Bot(token=token, parse_mode=ParseMode.HTML)
    dp = Dispatcher()
    setup_routers(dp)

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
