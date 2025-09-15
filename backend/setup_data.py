#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from user_management.models import UserProfile, Categoria, Producto
from logistics.models import Cliente, Conductor, Vehiculo, Ruta, PedidoTransporte
import uuid

def crear_datos_prueba():
    print("🚀 Creando datos de prueba para TECNOROUTE...")
    
    # 1. Crear superusuario administrador
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@tecnoroute.com',
            password='admin123',
            first_name='Administrador',
            last_name='Sistema'
        )
        
        UserProfile.objects.create(
            user=admin_user,
            role='admin',
            telefono='3001112233',
            direccion='Oficina Principal TECNOROUTE'
        )
        print("✅ Administrador creado: admin / admin123")
    
    # 2. Crear usuarios normales
    usuarios_data = [
        {
            'username': 'juan_perez',
            'email': 'juan.perez@email.com',
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'telefono': '3005551234',
            'direccion': 'Calle 123 #45-67, Bogotá'
        },
        {
            'username': 'maria_gonzalez',
            'email': 'maria.gonzalez@email.com',
            'first_name': 'María',
            'last_name': 'González',
            'telefono': '3007775555',
            'direccion': 'Carrera 78 #12-34, Medellín'
        },
        {
            'username': 'carlos_rodriguez',
            'email': 'carlos.rodriguez@email.com',
            'first_name': 'Carlos',
            'last_name': 'Rodríguez',
            'telefono': '3009998888',
            'direccion': 'Avenida 45 #23-12, Cali'
        }
    ]
    
    for user_data in usuarios_data:
        if not User.objects.filter(username=user_data['username']).exists():
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password='password123',
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )
            
            UserProfile.objects.create(
                user=user,
                role='customer',
                telefono=user_data['telefono'],
                direccion=user_data['direccion']
            )
            print(f"✅ Usuario creado: {user_data['username']} / password123")
    
    # 3. Crear conductores
    conductores_data = [
        {
            'nombre': 'Pedro Martín Conductor',
            'cedula': '12345678',
            'licencia': 'C1-12345678',
            'telefono': '3111234567',
            'email': 'pedro.conductor@tecnoroute.com',
            'direccion': 'Calle Conductores #1',
            'fecha_contratacion': '2023-01-15'
        },
        {
            'nombre': 'Ana López Conductora',
            'cedula': '87654321',
            'licencia': 'C1-87654321',
            'telefono': '3127654321',
            'email': 'ana.conductora@tecnoroute.com',
            'direccion': 'Calle Conductores #2',
            'fecha_contratacion': '2023-02-20'
        },
        {
            'nombre': 'Luis García Conductor',
            'cedula': '11223344',
            'licencia': 'C1-11223344',
            'telefono': '3141122334',
            'email': 'luis.conductor@tecnoroute.com',
            'direccion': 'Calle Conductores #3',
            'fecha_contratacion': '2023-03-10'
        }
    ]
    
    for conductor_data in conductores_data:
        if not Conductor.objects.filter(cedula=conductor_data['cedula']).exists():
            conductor = Conductor.objects.create(**conductor_data)
            
            # Crear usuario para el conductor
            if not User.objects.filter(email=conductor_data['email']).exists():
                user = User.objects.create_user(
                    username=f"conductor_{conductor_data['cedula']}",
                    email=conductor_data['email'],
                    password='conductor123',
                    first_name=conductor_data['nombre'].split()[0],
                    last_name=' '.join(conductor_data['nombre'].split()[1:])
                )
                
                UserProfile.objects.create(
                    user=user,
                    role='conductor',
                    telefono=conductor_data['telefono'],
                    direccion=conductor_data['direccion']
                )
            
            print(f"✅ Conductor creado: {conductor.nombre}")
    
    # 4. Crear clientes
    clientes_data = [
        {
            'nombre': 'Empresa ABC Ltda',
            'email': 'contacto@empresaabc.com',
            'telefono': '3201234567',
            'direccion': 'Zona Industrial Norte, Bodega 15',
            'ciudad': 'Bogotá',
            'codigo_postal': '110111'
        },
        {
            'nombre': 'Distribuidora XYZ S.A.S',
            'email': 'info@distribuidoraxyz.com',
            'telefono': '3207654321',
            'direccion': 'Centro de Distribución Sur, Manzana 8',
            'ciudad': 'Medellín',
            'codigo_postal': '050001'
        },
        {
            'nombre': 'Comercial 123',
            'email': 'ventas@comercial123.com',
            'telefono': '3209876543',
            'direccion': 'Plaza de Mercado Central, Local 45',
            'ciudad': 'Cali',
            'codigo_postal': '760001'
        },
        {
            'nombre': 'Logística del Valle',
            'email': 'operaciones@logisticavalle.com',
            'telefono': '3195678901',
            'direccion': 'Zona Franca, Edificio A, Oficina 302',
            'ciudad': 'Barranquilla',
            'codigo_postal': '080001'
        }
    ]
    
    for cliente_data in clientes_data:
        if not Cliente.objects.filter(email=cliente_data['email']).exists():
            cliente = Cliente.objects.create(**cliente_data)
            print(f"✅ Cliente creado: {cliente.nombre}")
    
    # 5. Crear vehículos
    vehiculos_data = [
        {
            'placa': 'ABC123',
            'marca': 'Chevrolet',
            'modelo': 'NPR',
            'año': 2020,
            'tipo': 'camion',
            'capacidad_peso': 3500.00,
            'capacidad_volumen': 15.50,
            'estado': 'disponible',
            'kilometraje': 45000
        },
        {
            'placa': 'DEF456',
            'marca': 'Ford',
            'modelo': 'Transit',
            'año': 2019,
            'tipo': 'furgoneta',
            'capacidad_peso': 1200.00,
            'capacidad_volumen': 8.50,
            'estado': 'disponible',
            'kilometraje': 67000
        },
        {
            'placa': 'GHI789',
            'marca': 'Mercedes-Benz',
            'modelo': 'Sprinter',
            'año': 2021,
            'tipo': 'furgoneta',
            'capacidad_peso': 2000.00,
            'capacidad_volumen': 12.00,
            'estado': 'disponible',
            'kilometraje': 23000
        }
    ]
    
    for vehiculo_data in vehiculos_data:
        if not Vehiculo.objects.filter(placa=vehiculo_data['placa']).exists():
            vehiculo = Vehiculo.objects.create(**vehiculo_data)
            print(f"✅ Vehículo creado: {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}")
    
    # 6. Crear rutas
    rutas_data = [
        {
            'nombre': 'Ruta Bogotá - Medellín',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Medellín, Antioquia',
            'distancia_km': 415.50,
            'tiempo_estimado_horas': 7.5,
            'costo_combustible': 180000,
            'peajes': 45000
        },
        {
            'nombre': 'Ruta Bogotá - Cali',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Cali, Valle del Cauca',
            'distancia_km': 462.80,
            'tiempo_estimado_horas': 8.0,
            'costo_combustible': 210000,
            'peajes': 52000
        },
        {
            'nombre': 'Ruta Medellín - Barranquilla',
            'origen': 'Medellín, Antioquia',
            'destino': 'Barranquilla, Atlántico',
            'distancia_km': 525.30,
            'tiempo_estimado_horas': 9.0,
            'costo_combustible': 240000,
            'peajes': 38000
        }
    ]
    
    for ruta_data in rutas_data:
        if not Ruta.objects.filter(nombre=ruta_data['nombre']).exists():
            ruta = Ruta.objects.create(**ruta_data)
            print(f"✅ Ruta creada: {ruta.nombre}")
    
    # 7. Crear algunos pedidos de transporte de prueba
    usuarios = User.objects.filter(userprofile__role='customer')
    clientes = Cliente.objects.all()
    
    if usuarios.exists() and clientes.exists():
        from datetime import datetime, timedelta
        
        pedidos_data = [
            {
                'descripcion': 'Transporte de productos electrónicos',
                'direccion_recogida': 'Bodega Central, Calle 80 #45-23, Bogotá',
                'direccion_entrega': 'Centro Comercial Los Molinos, Medellín',
                'peso_estimado': 150.50,
                'valor_declarado': 5000000.00,
                'fecha_recogida_deseada': datetime.now() + timedelta(days=2),
                'observaciones': 'Mercancía frágil, manejo con cuidado'
            },
            {
                'descripcion': 'Transporte de productos farmacéuticos',
                'direccion_recogida': 'Laboratorio FarmaCorp, Zona Industrial, Bogotá',
                'direccion_entrega': 'Hospital San Vicente, Cali',
                'peso_estimado': 75.25,
                'valor_declarado': 8000000.00,
                'fecha_recogida_deseada': datetime.now() + timedelta(days=1),
                'observaciones': 'Cadena de frío requerida'
            },
            {
                'descripcion': 'Transporte de repuestos automotrices',
                'direccion_recogida': 'AutoPartes del Norte, Medellín',
                'direccion_entrega': 'Taller MecánicoExpress, Barranquilla',
                'peso_estimado': 320.00,
                'valor_declarado': 3500000.00,
                'fecha_recogida_deseada': datetime.now() + timedelta(days=3),
                'observaciones': 'Piezas metálicas pesadas'
            }
        ]
        
        for i, pedido_data in enumerate(pedidos_data):
            usuario = usuarios[i % usuarios.count()]
            cliente = clientes[i % clientes.count()]
            
            pedido = PedidoTransporte.objects.create(
                usuario=usuario,
                cliente=cliente,
                numero_pedido=f'PED-{uuid.uuid4().hex[:8].upper()}',
                **pedido_data
            )
            print(f"✅ Pedido de transporte creado: {pedido.numero_pedido}")
    
    print("\n🎉 ¡Datos de prueba creados exitosamente!")
    print("\n👤 Credenciales de acceso:")
    print("🔑 Administrador: admin / admin123")
    print("🔑 Usuario 1: juan_perez / password123")
    print("🔑 Usuario 2: maria_gonzalez / password123")
    print("🔑 Conductor 1: conductor_12345678 / conductor123")
    print("🔑 Conductor 2: conductor_87654321 / conductor123")
    print("\n📧 Todos los emails están disponibles para login también")
    print("\n🚀 ¡El sistema está listo para usar!")

if __name__ == '__main__':
    crear_datos_prueba()