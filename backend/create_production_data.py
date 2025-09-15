#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from user_management.models import UserProfile, Categoria, Producto
from logistics.models import Cliente, Conductor, Vehiculo, Ruta, PedidoTransporte
import uuid

def crear_datos_produccion():
    print("🏭 Creando datos de PRODUCCIÓN para TECNOROUTE...")
    print("⚠️  Este script creará datos REALES para el sistema en producción")
    
    # 1. Crear superusuario administrador principal
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
            telefono='3001234567',
            direccion='Sede Principal TECNOROUTE, Bogotá'
        )
        print("✅ Administrador principal creado: admin@tecnoroute.com")
    
    # 2. Crear usuarios del sistema (empleados)
    usuarios_sistema = [
        {
            'username': 'juan_perez',
            'email': 'juan.perez@tecnoroute.com',
            'first_name': 'Juan Carlos',
            'last_name': 'Pérez Rodríguez',
            'telefono': '3101234567',
            'direccion': 'Calle 127 #15-30, Bogotá',
            'role': 'customer'
        },
        {
            'username': 'maria_gonzalez',
            'email': 'maria.gonzalez@tecnoroute.com',
            'first_name': 'María Fernanda',
            'last_name': 'González López',
            'telefono': '3157890123',
            'direccion': 'Carrera 43A #25-67, Medellín',
            'role': 'customer'
        },
        {
            'username': 'carlos_admin',
            'email': 'carlos.admin@tecnoroute.com',
            'first_name': 'Carlos Eduardo',
            'last_name': 'Martínez Silva',
            'telefono': '3209876543',
            'direccion': 'Avenida El Dorado #68-45, Bogotá',
            'role': 'admin'
        }
    ]
    
    for user_data in usuarios_sistema:
        if not User.objects.filter(username=user_data['username']).exists():
            role = user_data.pop('role')
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password='tecno2024*',
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )
            
            UserProfile.objects.create(
                user=user,
                role=role,
                telefono=user_data['telefono'],
                direccion=user_data['direccion']
            )
            print(f"✅ Usuario del sistema creado: {user_data['username']} ({role})")
    
    # 3. Crear conductores profesionales
    conductores_data = [
        {
            'nombre': 'Pedro Antonio Martínez López',
            'cedula': '80123456',
            'licencia': 'C2-80123456',
            'telefono': '3112345678',
            'email': 'pedro.martinez@tecnoroute.com',
            'direccion': 'Barrio Kennedy, Calle 38 Sur #78F-23, Bogotá',
            'fecha_contratacion': '2023-01-15'
        },
        {
            'nombre': 'Ana Lucía Rodríguez Vargas',
            'cedula': '43987654',
            'licencia': 'C2-43987654',
            'telefono': '3207654321',
            'email': 'ana.rodriguez@tecnoroute.com',
            'direccion': 'Comuna 10, Carrera 65 #48-12, Medellín',
            'fecha_contratacion': '2023-03-20'
        },
        {
            'nombre': 'Luis Fernando García Morales',
            'cedula': '17555888',
            'licencia': 'C2-17555888',
            'telefono': '3165432109',
            'email': 'luis.garcia@tecnoroute.com',
            'direccion': 'Barrio El Poblado, Calle 85 #34-56, Cali',
            'fecha_contratacion': '2023-05-10'
        },
        {
            'nombre': 'Carmen Elena Jiménez Torres',
            'cedula': '52777999',
            'licencia': 'C2-52777999',
            'telefono': '3198765432',
            'email': 'carmen.jimenez@tecnoroute.com',
            'direccion': 'Barrio El Prado, Calle 72 #45-78, Barranquilla',
            'fecha_contratacion': '2023-07-01'
        },
        {
            'nombre': 'Roberto Carlos Medina Cruz',
            'cedula': '80333444',
            'licencia': 'C3-80333444',
            'telefono': '3145678901',
            'email': 'roberto.medina@tecnoroute.com',
            'direccion': 'Localidad Chapinero, Carrera 13 #67-89, Bogotá',
            'fecha_contratacion': '2023-08-15'
        }
    ]
    
    for conductor_data in conductores_data:
        if not Conductor.objects.filter(cedula=conductor_data['cedula']).exists():
            conductor = Conductor.objects.create(**conductor_data)
            
            # Crear usuario para el conductor
            if not User.objects.filter(email=conductor_data['email']).exists():
                username = conductor_data['email'].split('@')[0].replace('.', '_')
                user = User.objects.create_user(
                    username=username,
                    email=conductor_data['email'],
                    password='conductor2024*',
                    first_name=conductor_data['nombre'].split()[0],
                    last_name=' '.join(conductor_data['nombre'].split()[1:])
                )
                
                UserProfile.objects.create(
                    user=user,
                    role='conductor',
                    telefono=conductor_data['telefono'],
                    direccion=conductor_data['direccion']
                )
            
            print(f"✅ Conductor profesional registrado: {conductor.nombre}")
    
    # 4. Crear clientes corporativos reales
    clientes_data = [
        {
            'nombre': 'Almacenes Éxito S.A.',
            'email': 'logistica@exito.com',
            'telefono': '6013204500',
            'direccion': 'Carrera 48 #32B Sur-139, Bogotá',
            'ciudad': 'Bogotá',
            'codigo_postal': '110911'
        },
        {
            'nombre': 'Grupo Nutresa S.A.',
            'email': 'distribución@nutresa.com',
            'telefono': '6044309830',
            'direccion': 'Calle 8 Sur #50-67, Medellín',
            'ciudad': 'Medellín',
            'codigo_postal': '050010'
        },
        {
            'nombre': 'Alpina Productos Alimenticios S.A.',
            'email': 'transporte@alpina.com',
            'telefono': '6018878000',
            'direccion': 'Carrera 23 #127-15, Bogotá',
            'ciudad': 'Bogotá',
            'codigo_postal': '110121'
        },
        {
            'nombre': 'Tecnoquímicas S.A.',
            'email': 'logistica@tecnoquimicas.com',
            'telefono': '6024441444',
            'direccion': 'Calle 23 #7-87, Cali',
            'ciudad': 'Cali',
            'codigo_postal': '760045'
        },
        {
            'nombre': 'Corona S.A.',
            'email': 'distribución@corona.com',
            'telefono': '6015461500',
            'direccion': 'Autopista Norte Km 18, Madrid, Cundinamarca',
            'ciudad': 'Madrid',
            'codigo_postal': '250040'
        },
        {
            'nombre': 'Carvajal Educación S.A.S',
            'email': 'envios@carvajaleducacion.com',
            'telefono': '6025551000',
            'direccion': 'Carrera 11 #93-07, Cali',
            'ciudad': 'Cali',
            'codigo_postal': '760001'
        },
        {
            'nombre': 'Bimbo de Colombia S.A.',
            'email': 'transporte@bimbo.com.co',
            'telefono': '6014238400',
            'direccion': 'Calle 17 #69-18, Bogotá',
            'ciudad': 'Bogotá',
            'codigo_postal': '110931'
        }
    ]
    
    for cliente_data in clientes_data:
        if not Cliente.objects.filter(email=cliente_data['email']).exists():
            cliente = Cliente.objects.create(**cliente_data)
            print(f"✅ Cliente corporativo registrado: {cliente.nombre}")
    
    # 5. Flota de vehículos profesional
    vehiculos_data = [
        {
            'placa': 'TEC001',
            'marca': 'Freightliner',
            'modelo': 'Cascadia',
            'año': 2022,
            'tipo': 'trailer',
            'capacidad_peso': 34000.00,
            'capacidad_volumen': 76.00,
            'estado': 'disponible',
            'kilometraje': 45000
        },
        {
            'placa': 'TEC002',
            'marca': 'Kenworth',
            'modelo': 'T880',
            'año': 2021,
            'tipo': 'trailer',
            'capacidad_peso': 34000.00,
            'capacidad_volumen': 76.00,
            'estado': 'disponible',
            'kilometraje': 67000
        },
        {
            'placa': 'TEC003',
            'marca': 'Mercedes-Benz',
            'modelo': 'Actros 2644',
            'año': 2023,
            'tipo': 'camion',
            'capacidad_peso': 26000.00,
            'capacidad_volumen': 62.00,
            'estado': 'disponible',
            'kilometraje': 12000
        },
        {
            'placa': 'TEC004',
            'marca': 'Volvo',
            'modelo': 'FH16',
            'año': 2022,
            'tipo': 'camion',
            'capacidad_peso': 18000.00,
            'capacidad_volumen': 45.00,
            'estado': 'disponible',
            'kilometraje': 34000
        },
        {
            'placa': 'TEC005',
            'marca': 'Iveco',
            'modelo': 'Daily 70C17',
            'año': 2023,
            'tipo': 'furgoneta',
            'capacidad_peso': 3500.00,
            'capacidad_volumen': 17.00,
            'estado': 'disponible',
            'kilometraje': 8000
        },
        {
            'placa': 'TEC006',
            'marca': 'Ford',
            'modelo': 'Transit 350L',
            'año': 2022,
            'tipo': 'furgoneta',
            'capacidad_peso': 2000.00,
            'capacidad_volumen': 15.10,
            'estado': 'disponible',
            'kilometraje': 23000
        }
    ]
    
    for vehiculo_data in vehiculos_data:
        if not Vehiculo.objects.filter(placa=vehiculo_data['placa']).exists():
            vehiculo = Vehiculo.objects.create(**vehiculo_data)
            print(f"✅ Vehículo de flota registrado: {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}")
    
    # 6. Rutas comerciales principales
    rutas_data = [
        {
            'nombre': 'Corredor Bogotá - Medellín Express',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Medellín, Antioquia',
            'distancia_km': 415.50,
            'tiempo_estimado_horas': 7.00,
            'costo_combustible': 350000.00,
            'peajes': 85000.00
        },
        {
            'nombre': 'Ruta Bogotá - Cali Premium',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Cali, Valle del Cauca',
            'distancia_km': 462.80,
            'tiempo_estimado_horas': 8.50,
            'costo_combustible': 420000.00,
            'peajes': 95000.00
        },
        {
            'nombre': 'Corredor Caribe: Medellín - Barranquilla',
            'origen': 'Medellín, Antioquia',
            'destino': 'Barranquilla, Atlántico',
            'distancia_km': 525.30,
            'tiempo_estimado_horas': 9.50,
            'costo_combustible': 480000.00,
            'peajes': 78000.00
        },
        {
            'nombre': 'Ruta Santandereana: Bogotá - Bucaramanga',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Bucaramanga, Santander',
            'distancia_km': 395.20,
            'tiempo_estimado_horas': 6.50,
            'costo_combustible': 320000.00,
            'peajes': 65000.00
        },
        {
            'nombre': 'Conexión Pacífico: Cali - Cartagena',
            'origen': 'Cali, Valle del Cauca',
            'destino': 'Cartagena, Bolívar',
            'distancia_km': 612.00,
            'tiempo_estimado_horas': 11.00,
            'costo_combustible': 550000.00,
            'peajes': 88000.00
        },
        {
            'nombre': 'Ruta Triángulo de Oro: Bogotá - Pereira',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Pereira, Risaralda',
            'distancia_km': 325.80,
            'tiempo_estimado_horas': 5.50,
            'costo_combustible': 280000.00,
            'peajes': 52000.00
        }
    ]
    
    for ruta_data in rutas_data:
        if not Ruta.objects.filter(nombre=ruta_data['nombre']).exists():
            ruta = Ruta.objects.create(**ruta_data)
            print(f"✅ Ruta comercial registrada: {ruta.nombre}")
    
    # 7. Crear algunos pedidos de transporte iniciales
    usuarios_activos = User.objects.filter(userprofile__role__in=['customer', 'admin'])
    clientes = Cliente.objects.all()[:5]  # Primeros 5 clientes
    
    if usuarios_activos.exists() and clientes.exists():
        pedidos_iniciales = [
            {
                'descripcion': 'Transporte de productos farmacéuticos refrigerados',
                'direccion_recogida': 'Planta Tecnoquímicas - Calle 23 #7-87, Cali',
                'direccion_entrega': 'Centro de Distribución Nacional - Zona Franca Bogotá',
                'peso_estimado': 2500.00,
                'valor_declarado': 45000000.00,
                'precio_estimado': 2800000.00,
                'fecha_recogida_deseada': datetime.now() + timedelta(days=1),
                'observaciones': 'URGENTE - Productos con cadena de frío. Entrega en máximo 18 horas. Documentación sanitaria incluida.'
            },
            {
                'descripcion': 'Distribución de productos alimentarios para supermercados',
                'direccion_recogida': 'Centro de Distribución Nutresa - Medellín',
                'direccion_entrega': 'Almacenes Éxito - Múltiples ubicaciones Bogotá',
                'peso_estimado': 15000.00,
                'valor_declarado': 85000000.00,
                'precio_estimado': 4500000.00,
                'fecha_recogida_deseada': datetime.now() + timedelta(days=2),
                'observaciones': 'Entrega programada en 15 puntos diferentes. Ruta optimizada requerida. Productos perecederos.'
            },
            {
                'descripcion': 'Transporte de material educativo y libros',
                'direccion_recogida': 'Carvajal Educación - Carrera 11 #93-07, Cali',
                'direccion_entrega': 'Instituciones Educativas - Departamento del Atlántico',
                'peso_estimado': 8500.00,
                'valor_declarado': 25000000.00,
                'precio_estimado': 3200000.00,
                'fecha_recogida_deseada': datetime.now() + timedelta(days=3),
                'observaciones': 'Material educativo para inicio de año escolar. Entregar en 45 colegios diferentes según listado adjunto.'
            }
        ]
        
        for i, pedido_data in enumerate(pedidos_iniciales):
            usuario = usuarios_activos[i % usuarios_activos.count()]
            cliente = clientes[i]
            
            pedido = PedidoTransporte.objects.create(
                usuario=usuario,
                cliente=cliente,
                numero_pedido=f'TR-{datetime.now().year}-{str(uuid.uuid4().hex[:6]).upper()}',
                **pedido_data
            )
            print(f"✅ Pedido comercial registrado: {pedido.numero_pedido}")
    
    print("\n🎯 ¡Sistema TECNOROUTE configurado para PRODUCCIÓN!")
    print("\n📊 Resumen de datos creados:")
    print(f"👥 Usuarios del sistema: {User.objects.count()}")
    print(f"🚛 Conductores: {Conductor.objects.count()}")
    print(f"🏢 Clientes corporativos: {Cliente.objects.count()}")
    print(f"🚚 Flota de vehículos: {Vehiculo.objects.count()}")
    print(f"🗺️ Rutas comerciales: {Ruta.objects.count()}")
    print(f"📦 Pedidos iniciales: {PedidoTransporte.objects.count()}")
    
    print("\n🔑 CREDENCIALES DE ACCESO:")
    print("👨‍💼 Administrador Principal: admin@tecnoroute.com / admin123")
    print("👨‍💼 Admin Secundario: carlos.admin@tecnoroute.com / tecno2024*")
    print("👤 Usuario Cliente 1: juan.perez@tecnoroute.com / tecno2024*")
    print("👤 Usuario Cliente 2: maria.gonzalez@tecnoroute.com / tecno2024*")
    print("🚛 Conductores: [email]@tecnoroute.com / conductor2024*")
    
    print("\n🌐 URLs del sistema:")
    print("📱 API Base: http://localhost:8000/api/")
    print("🔐 Admin Panel: http://localhost:8000/admin/")
    print("📊 Login API: http://localhost:8000/api/auth/login/")
    print("🚚 Pedidos: http://localhost:8000/api/pedidos-transporte/")
    
    print("\n✅ ¡SISTEMA LISTO PARA PRODUCCIÓN!")

if __name__ == '__main__':
    crear_datos_produccion()