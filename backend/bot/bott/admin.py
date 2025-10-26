from django.contrib import admin
from .models import TelegramUser


@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    # فیلدهایی که در لیست اصلی نمایش داده می‌شوند
    list_display = (
        'telegram_id',
        'name',
        'wallet_address',
        'referrer_wallet',
        'joined_at',
    )

    # قابلیت جستجو در این فیلدها
    search_fields = (
        'telegram_id',
        'name',
        'wallet_address',
        'referrer_wallet',
    )

    # فیلتر کناری برای تاریخ ثبت‌نام
    list_filter = ('joined_at',)

    # مرتب‌سازی بر اساس جدیدترین ثبت‌ها
    ordering = ('-joined_at',)

    # تعداد آیتم‌ها در هر صفحه در پنل ادمین
    list_per_page = 25

    # فقط‌خواندنی برای فیلدهایی که نباید دستی ویرایش شوند (اختیاری)
    readonly_fields = ('joined_at',)

    # عنوان‌های فارسی‌تر برای جدول (اختیاری)
    fieldsets = (
        ("👤 اطلاعات کاربر تلگرام", {
            "fields": ("telegram_id", "name", "wallet_address", "referrer_wallet")
        }),
        ("📅 زمان عضویت", {
            "fields": ("joined_at",),
        }),
    )
