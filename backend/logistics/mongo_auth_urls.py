from django.urls import path
from . import mongo_auth_views

app_name = 'mongo_auth'

urlpatterns = [
    path('registro/', mongo_auth_views.registro_usuario, name='registro'),
    path('login/', mongo_auth_views.login_usuario, name='login'),
    path('logout/', mongo_auth_views.logout_usuario, name='logout'),
    path('perfil/', mongo_auth_views.perfil_usuario, name='perfil'),
]