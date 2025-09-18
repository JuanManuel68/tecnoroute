#!/usr/bin/env python
"""
Script para limpiar la base de datos MongoDB de datos de prueba
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from logistics.mongo_models import Cliente, Conductor, Vehiculo, Ruta, Envio


def clear_all_data():
    """Limpiar toda la data de prueba"""
    print("🧹 Limpiando datos de prueba...")
    
    # Contar registros antes
    clientes_count = Cliente.objects.count()
    conductores_count = Conductor.objects.count()
    vehiculos_count = Vehiculo.objects.count()
    rutas_count = Ruta.objects.count()
    envios_count = Envio.objects.count()
    
    print(f"📊 Datos antes de limpiar:")
    print(f"   👥 Clientes: {clientes_count}")
    print(f"   🚗 Conductores: {conductores_count}")
    print(f"   🚛 Vehículos: {vehiculos_count}")
    print(f"   🛣️  Rutas: {rutas_count}")
    print(f"   📦 Envíos: {envios_count}")
    
    # Eliminar todos los datos
    Cliente.objects.all().delete()
    Conductor.objects.all().delete()
    Vehiculo.objects.all().delete()
    Ruta.objects.all().delete()
    Envio.objects.all().delete()
    
    print("✅ Base de datos limpiada")
    print("📊 Ahora los usuarios se registrarán desde el frontend")


if __name__ == '__main__':
    clear_all_data()