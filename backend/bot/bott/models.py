from django.db import models

class TelegramUser(models.Model):
    telegram_id = models.BigIntegerField(unique=True)
    name = models.CharField(max_length=120, blank=True, null=True)
    wallet_address = models.CharField(max_length=120, blank=True, null=True)
    referrer_wallet = models.CharField(max_length=120, blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.telegram_id} ({self.wallet_address or 'no wallet'})"
