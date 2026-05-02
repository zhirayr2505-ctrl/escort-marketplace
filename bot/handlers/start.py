from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

router = Router(name="start")


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    await message.answer(
        "Привет! Маркетплейс — в разработке.\n"
        "Позже здесь будут кнопки WebApp и «Стать моделью»."
    )
