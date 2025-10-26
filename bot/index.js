import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { Telegraf, session, Markup } from "telegraf";
import 'dotenv/config';

const app = express();
app.use(bodyParser.json());

// ===========================
// 🔹 تنظیمات محیطی
// ===========================
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

const API_BASE = process.env.API_BASE || "http://localhost:8000/api";
const DAPP_URL = process.env.DAPP_URL || "http://localhost:5173"; // 👈 آدرس سایت React (HTTP برای لوکال)

// ===========================
// 🎯 /start — ثبت referrer و ارسال دکمه اتصال
// ===========================
bot.start(async (ctx) => {
  const telegram_id = ctx.from.id;
  const name = `${ctx.from.first_name || ""} ${ctx.from.last_name || ""}`.trim();
  const referrer_wallet = ctx.message.text.split(" ")[1] || null;

  ctx.session = { telegram_id, name, referrer_wallet };
  console.log("📩 /start received:", { telegram_id, name, referrer_wallet });

  // ✅ ثبت referrer در Django
  if (referrer_wallet) {
    try {
      const res = await fetch(`${API_BASE}/save_referrer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram_id, name, referrer_wallet }),
      });
      console.log("✅ Referrer saved:", await res.text());
    } catch (err) {
      console.error("❌ Error saving referrer:", err);
    }
  }

  // 🧩 ساخت لینک DApp (با پارامترها)
  const refParam = referrer_wallet || "direct";
  const connectPage = `${DAPP_URL}/boost?ref=${refParam}&tg_id=${telegram_id}`;

  const messageText = referrer_wallet
    ? `👋 خوش اومدی ${name}!\n\nکد دعوت از طرف 👇\n<code>${referrer_wallet}</code>\n\nبرای اتصال کیف‌پول روی دکمه زیر بزن 👇`
    : `👋 سلام ${name}!\nبرای شروع، کیف پول خود را متصل کن 👇`;

  // ✅ فقط یک دکمه امن با HTTPS/HTTP
  await ctx.reply(messageText, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [Markup.button.url("🔗 اتصال به کیف پول", connectPage)],
    ]),
  });
});

// ===========================
// 📡 Endpoint برای DApp — ارسال پیام بعد از اتصال کیف پول
// ===========================
app.post("/api/send_message/", async (req, res) => {
  const { telegram_id, message } = req.body;
  console.log("📩 /api/send_message received:", req.body);

  if (!telegram_id || !message) {
    return res.status(400).json({ success: false, error: "Missing telegram_id or message" });
  }

  try {
    await bot.telegram.sendMessage(telegram_id, message, { parse_mode: "HTML" });
    console.log(`✅ Message sent to ${telegram_id}`);
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Telegram sendMessage error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ===========================
// 🟢 راه‌اندازی بات و سرور Express
// ===========================
bot.launch();
console.log("🤖 Telegram bot is running...");

const PORT = process.env.PORT || 7157;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
