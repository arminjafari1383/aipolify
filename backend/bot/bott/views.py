from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TelegramUser
import re
import requests
import json
from django.conf import settings


BOT_SERVER_URL = getattr(settings, "BOT_SERVER_URL", "https://bot.cryptoohubcapital.com/api/send_message/")

# 🟢 ذخیره referrer وقتی کاربر با لینک دعوت وارد میشه
@api_view(['POST'])
def save_referrer(request):
    print("\n📩 [save_referrer] Raw Data:", request.data)

    telegram_id = request.data.get("telegram_id")
    name = request.data.get("name")
    referrer_wallet = request.data.get("referrer_wallet")

    if not telegram_id or not referrer_wallet:
        print("❌ Missing telegram_id or referrer_wallet")
        return Response({"success": False, "error": "Missing data"}, status=400)

    user, created = TelegramUser.objects.get_or_create(telegram_id=telegram_id)
    user.name = name or user.name
    user.referrer_wallet = referrer_wallet
    user.save()

    print(f"✅ Referrer saved -> TelegramID={telegram_id}, Referrer={referrer_wallet}")

    return Response({
        "success": True,
        "message": "Referrer saved successfully",
        "created": created
    })


# 🟣 ثبت آدرس ولت بعد از اینکه کاربر در DApp یا بات آدرس خود را فرستاد
@api_view(['POST'])
def register_wallet(request):
    print("\n📩 [register_wallet] Raw Data:", request.data)

    telegram_id = request.data.get("telegram_id")
    name = request.data.get("name")
    wallet_address = request.data.get("wallet_address")

    # اعتبارسنجی مقادیر ورودی
    if not telegram_id or not wallet_address:
        print("❌ Missing telegram_id or wallet_address")
        return Response({"success": False, "error": "Missing data"}, status=400)

    # چک کردن فرمت ولت
    if not re.match(r"^0x[a-fA-F0-9]{40}$", wallet_address):
        print("❌ Invalid wallet format:", wallet_address)
        return Response({"success": False, "error": "Invalid wallet format"}, status=400)

    # دریافت یا ساخت کاربر
    user, created = TelegramUser.objects.get_or_create(telegram_id=telegram_id)

    # جلوگیری از ثبت تکراری
    if user.wallet_address and user.wallet_address.lower() != wallet_address.lower():
        print("⚠️ Wallet already exists for user:", telegram_id)
        return Response({"success": False, "error": "Wallet already registered"}, status=400)

    # ذخیره اطلاعات جدید
    user.wallet_address = wallet_address
    if name:
        user.name = name
    user.save()

    print(f"✅ Wallet registered -> TelegramID={telegram_id}, Wallet={wallet_address}, Referrer={user.referrer_wallet}")

    # ساخت پیام پاسخ
    msg = f"✅ آدرس ولت شما با موفقیت ثبت شد!\n<code>{wallet_address}</code>"
    if user.referrer_wallet:
        msg += f"\n🎁 شما با کد معرفی زیر ثبت شدید:\n<code>{user.referrer_wallet}</code>"

    # 📤 ارسال پیام به ربات تلگرام (اختیاری)
    try:
        payload = {"telegram_id": telegram_id, "message": msg}
        r = requests.post(BOT_SERVER_URL, json=payload, timeout=5)
        print("📨 Sent to Telegram bot:", r.text)
    except Exception as e:
        print("⚠️ Failed to notify bot:", str(e))

    return Response({
        "success": True,
        "message": "Wallet registered successfully",
        "wallet": wallet_address,
        "referrer": user.referrer_wallet,
    })

@api_view(['POST'])
def connect_wallet(request):
    print("\n📩 [connect_wallet] Raw Data:", request.data)  # 👈 این خط را اضافه کن
    telegram_id = request.data.get("telegram_id")
    wallet = request.data.get("wallet")
    referrer = request.data.get("referrer", "direct")

    # 🛑 اگر telegram_id ارسال نشده، از ساخت رکورد جلوگیری کن
    if not telegram_id:
        return Response({"success": False, "error": "Missing telegram_id"}, status=400)

    if not wallet:
        return Response({"success": False, "error": "Missing wallet"}, status=400)

    user, _ = TelegramUser.objects.get_or_create(telegram_id=telegram_id)
    user.wallet_address = wallet
    user.referrer_wallet = referrer if referrer != "direct" else None
    user.save()

    print(f"✅ Wallet connected: {wallet} (Telegram ID: {telegram_id})")

    return Response({
        "success": True,
        "wallet": wallet,
        "telegram_id": telegram_id,
        "message": "Wallet connected successfully"
    })