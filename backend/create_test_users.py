#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from logistics.mongo_models import Usuario, Cliente, Conductor, Administrador

def crear_usuarios_prueba():
    """Crear usuarios de prueba para cada rol"""
    
    print("🔧 Creando usuarios de prueba...")
    
    # Limpiar usuarios existentes
    Usuario.drop_collection()
    Cliente.drop_collection()
    Conductor.drop_collection()
    Administrador.drop_collection()
    
    # 1. Crear Administrador
    print("👤 Creando administrador...")
    admin_user = Usuario(
        email="admin@tecnoroute.com",
        rol="admin",
        nombre="Juan Carlos Administrador",
        telefono="+57 300 123 0001"
    )
    admin_user.set_password("admin123")
    admin_user.save()
    
    admin_profile = Administrador(
        usuario_id=admin_user.id,
        departamento="Administración General",
        fecha_contratacion=datetime.utcnow(),
        permisos_especiales=["gestionar_usuarios", "reportes", "configuracion"]
    )
    admin_profile.save()
    print(f"✅ Admin creado: {admin_user.email}")
    
    # 2. Crear Cliente
    print("🏢 Creando cliente...")
    cliente_user = Usuario(
        email="cliente@tecnoroute.com",
        rol="cliente",
        nombre="María López García",
        telefono="+57 300 123 0002"
    )
    cliente_user.set_password("cliente123")
    cliente_user.save()
    
    cliente_profile = Cliente(
        usuario_id=cliente_user.id,
        nombre="María López García",
        email="cliente@tecnoroute.com",
        telefono="+57 300 123 0002",
        direccion="Carrera 15 #123-45",
        ciudad="Bogotá",
        codigo_postal="110111",
        tipo_cliente="individual",
        documento_identidad="12345678"
    )
    cliente_profile.save()
    print(f"✅ Cliente creado: {cliente_user.email}")
    
    # 3. Crear Conductor
    print("🚛 Creando conductor...")
    conductor_user = Usuario(
        email="conductor@tecnoroute.com",
        rol="conductor",
        nombre="Carlos Ramírez Pérez",
        telefono="+57 300 123 0003"
    )
    conductor_user.set_password("conductor123")
    conductor_user.save()
    
    conductor_profile = Conductor(
        usuario_id=conductor_user.id,
        nombre="Carlos Ramírez Pérez",
        cedula="87654321",
        licencia="LIC987654321",
        categoria_licencia="C1",
        fecha_vencimiento_licencia=datetime.utcnow() + timedelta(days=365*2),  # 2 años
        telefono="+57 300 123 0003",
        email="conductor@tecnoroute.com",
        direccion="Calle 45 #67-89",
        fecha_nacimiento=datetime(1985, 5, 15),
        fecha_contratacion=datetime.utcnow() - timedelta(days=30),  # Hace 1 mes
        experiencia_años=8,
        estado="disponible"
    )
    conductor_profile.save()
    print(f"✅ Conductor creado: {conductor_user.email}")
    
    print("\n🎉 ¡Usuarios de prueba creados exitosamente!")
    print("\nCredenciales de acceso:")
    print("=" * 50)
    print("🔐 ADMINISTRADOR:")
    print("   Email: admin@tecnoroute.com")
    print("   Contraseña: admin123")
    print()
    print("🏢 CLIENTE:")
    print("   Email: cliente@tecnoroute.com")
    print("   Contraseña: cliente123")
    print()
    print("🚛 CONDUCTOR:")
    print("   Email: conductor@tecnoroute.com")
    print("   Contraseña: conductor123")
    print("=" * 50)

if __name__ == "__main__":
    crear_usuarios_prueba()