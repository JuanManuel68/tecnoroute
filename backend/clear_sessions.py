#!/usr/bin/env python
"""
Script para limpiar tokens y sesiones al iniciar el servidor.
Ejecutar con: python clear_sessions.py
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sessions.models import Session
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

def clear_sessions_and_tokens():
    """Limpiar todas las sesiones y tokens existentes"""
    try:
        # Limpiar sesiones
        session_count = Session.objects.all().count()
        Session.objects.all().delete()
        print(f"✅ {session_count} sesiones eliminadas")
        
        # Limpiar tokens (opcional - descomenta si quieres limpiar tokens también)
        # token_count = Token.objects.all().count()
        # Token.objects.all().delete()
        # print(f"✅ {token_count} tokens eliminados")
        
        print("🔄 Sesiones limpiadas exitosamente")
        
    except Exception as e:
        print(f"❌ Error al limpiar sesiones: {e}")

if __name__ == "__main__":
    clear_sessions_and_tokens()