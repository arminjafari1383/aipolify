from django.urls import path
from . import views

urlpatterns = [
    path('save_referrer/', views.save_referrer, name='save_referrer'),
    path('register_wallet/', views.register_wallet, name='register_wallet'),
    path("connect-wallet/", views.connect_wallet, name="connect_wallet"),
]
