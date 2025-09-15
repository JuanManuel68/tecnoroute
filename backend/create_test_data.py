#!/usr/bin/env python
"""
Script para crear datos de prueba en TecnoRoute
Ejecutar desde el directorio backend: python create_test_data.py
"""
import os
import sys
import django
from datetime import date, datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from logistics.models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio
from django.contrib.auth.models import User

def crear_datos_prueba():
    print("🚀 Creando datos de prueba para TecnoRoute...")
    
    # Limpiar datos existentes (opcional)
    print("🧹 Limpiando datos existentes...")
    Envio.objects.all().delete()
    SeguimientoEnvio.objects.all().delete()
    Cliente.objects.all().delete()
    Conductor.objects.all().delete() 
    Vehiculo.objects.all().delete()
    Ruta.objects.all().delete()
    
    # Crear clientes de prueba
    print("👥 Creando clientes...")
    clientes = [
        {
            'nombre': 'Empresa ABC S.A.',
            'email': 'contacto@abc.com',
            'telefono': '+34 912 345 678',
            'direccion': 'Calle Mayor 123, 4º A',
            'ciudad': 'Madrid',
            'codigo_postal': '28001'
        },
        {
            'nombre': 'Logística del Norte SL',
            'email': 'info@norte.es',
            'telefono': '+34 985 123 456',
            'direccion': 'Avenida de Asturias 45',
            'ciudad': 'Oviedo',
            'codigo_postal': '33001'
        },
        {
            'nombre': 'Distribuciones Valencia',
            'email': 'ventas@valencia.es',
            'telefono': '+34 963 789 012',
            'direccion': 'Gran Vía 78, 2º',
            'ciudad': 'Valencia',
            'codigo_postal': '46001'
        },
        {
            'nombre': 'Comercial Andaluza',
            'email': 'pedidos@andaluza.es',
            'telefono': '+34 954 456 789',
            'direccion': 'Plaza de España 12',
            'ciudad': 'Sevilla',
            'codigo_postal': '41001'
        },
        {
            'nombre': 'Importex Cataluña',
            'email': 'clientes@importex.cat',
            'telefono': '+34 934 567 890',
            'direccion': 'Passeig de Gràcia 101',
            'ciudad': 'Barcelona',
            'codigo_postal': '08008'
        }
    ]
    
    clientes_creados = []
    for cliente_data in clientes:
        cliente = Cliente.objects.create(**cliente_data)
        clientes_creados.append(cliente)
        print(f"  ✓ Cliente creado: {cliente.nombre}")
    
    # Crear conductores de prueba
    print("🚗 Creando conductores...")
    conductores = [
        {
            'nombre': 'Juan Pérez García',
            'cedula': '12345678A',
            'licencia': 'B123456789',
            'telefono': '+34 666 111 222',
            'email': 'juan.perez@tecnoroute.com',
            'direccion': 'Calle Luna 15, 1º B',
            'fecha_contratacion': date(2023, 1, 15),
            'estado': 'disponible'
        },
        {
            'nombre': 'María López Rodríguez',
            'cedula': '87654321B',
            'licencia': 'C987654321',
            'telefono': '+34 666 333 444',
            'email': 'maria.lopez@tecnoroute.com',
            'direccion': 'Avenida Sol 32, 3º A',
            'fecha_contratacion': date(2023, 3, 20),
            'estado': 'en_ruta'
        },
        {
            'nombre': 'Carlos Martínez Sánchez',
            'cedula': '45678912C',
            'licencia': 'C456789123',
            'telefono': '+34 666 555 666',
            'email': 'carlos.martinez@tecnoroute.com',
            'direccion': 'Plaza Mayor 8, 2º D',
            'fecha_contratacion': date(2023, 2, 10),
            'estado': 'disponible'
        },
        {
            'nombre': 'Ana Fernández Torres',
            'cedula': '32165498D',
            'licencia': 'B321654987',
            'telefono': '+34 666 777 888',
            'email': 'ana.fernandez@tecnoroute.com',
            'direccion': 'Calle Estrella 25, 4º C',
            'fecha_contratacion': date(2023, 4, 5),
            'estado': 'descanso'
        },
        {
            'nombre': 'Roberto García Villa',
            'cedula': '65498732E',
            'licencia': 'C654987321',
            'telefono': '+34 666 999 000',
            'email': 'roberto.garcia@tecnoroute.com',
            'direccion': 'Avenida Libertad 50',
            'fecha_contratacion': date(2023, 1, 30),
            'estado': 'disponible'
        }
    ]
    
    conductores_creados = []
    for conductor_data in conductores:
        conductor = Conductor.objects.create(**conductor_data)
        conductores_creados.append(conductor)
        print(f"  ✓ Conductor creado: {conductor.nombre} - {conductor.estado}")
    
    # Crear vehículos de prueba
    print("🚛 Creando vehículos...")
    vehiculos = [
        {
            'placa': 'ABC-1234',
            'marca': 'Mercedes-Benz',
            'modelo': 'Sprinter',
            'año': 2022,
            'tipo': 'furgoneta',
            'capacidad_peso': 3500.00,
            'capacidad_volumen': 15.50,
            'estado': 'disponible',
            'kilometraje': 25000
        },
        {
            'placa': 'DEF-5678',
            'marca': 'Iveco',
            'modelo': 'Daily',
            'año': 2021,
            'tipo': 'furgoneta',
            'capacidad_peso': 3200.00,
            'capacidad_volumen': 12.80,
            'estado': 'en_uso',
            'kilometraje': 45000
        },
        {
            'placa': 'GHI-9012',
            'marca': 'Volvo',
            'modelo': 'FH16',
            'año': 2023,
            'tipo': 'camion',
            'capacidad_peso': 18000.00,
            'capacidad_volumen': 85.00,
            'estado': 'disponible',
            'kilometraje': 12000
        },
        {
            'placa': 'JKL-3456',
            'marca': 'MAN',
            'modelo': 'TGX',
            'año': 2022,
            'tipo': 'trailer',
            'capacidad_peso': 40000.00,
            'capacidad_volumen': 120.00,
            'estado': 'mantenimiento',
            'kilometraje': 78000
        },
        {
            'placa': 'MNO-7890',
            'marca': 'Ford',
            'modelo': 'Transit',
            'año': 2020,
            'tipo': 'furgoneta',
            'capacidad_peso': 2500.00,
            'capacidad_volumen': 10.20,
            'estado': 'disponible',
            'kilometraje': 65000
        }
    ]
    
    vehiculos_creados = []
    for vehiculo_data in vehiculos:
        vehiculo = Vehiculo.objects.create(**vehiculo_data)
        vehiculos_creados.append(vehiculo)
        print(f"  ✓ Vehículo creado: {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}")
    
    # Crear rutas de prueba
    print("🛣️ Creando rutas...")
    rutas = [
        {
            'nombre': 'Madrid - Barcelona Express',
            'origen': 'Madrid',
            'destino': 'Barcelona',
            'distancia_km': 620.50,
            'tiempo_estimado_horas': 6.5,
            'costo_combustible': 85.00,
            'peajes': 45.50,
            'estado': 'planificada'
        },
        {
            'nombre': 'Valencia - Sevilla Sur',
            'origen': 'Valencia',
            'destino': 'Sevilla', 
            'distancia_km': 520.30,
            'tiempo_estimado_horas': 5.2,
            'costo_combustible': 72.00,
            'peajes': 38.20,
            'estado': 'en_progreso'
        },
        {
            'nombre': 'Bilbao - Madrid Norte',
            'origen': 'Bilbao',
            'destino': 'Madrid',
            'distancia_km': 395.80,
            'tiempo_estimado_horas': 4.0,
            'costo_combustible': 58.50,
            'peajes': 28.90,
            'estado': 'planificada'
        },
        {
            'nombre': 'Barcelona - Valencia Costa',
            'origen': 'Barcelona',
            'destino': 'Valencia',
            'distancia_km': 350.20,
            'tiempo_estimado_horas': 3.5,
            'costo_combustible': 48.00,
            'peajes': 22.50,
            'estado': 'completada'
        },
        {
            'nombre': 'Sevilla - Granada Andalucía',
            'origen': 'Sevilla',
            'destino': 'Granada',
            'distancia_km': 250.60,
            'tiempo_estimado_horas': 2.8,
            'costo_combustible': 35.00,
            'peajes': 15.80,
            'estado': 'planificada'
        }
    ]
    
    rutas_creadas = []
    for ruta_data in rutas:
        ruta = Ruta.objects.create(**ruta_data)
        rutas_creadas.append(ruta)
        print(f"  ✓ Ruta creada: {ruta.nombre} ({ruta.distancia_km} km)")
    
    # Crear algunos envíos de prueba
    print("📦 Creando envíos...")
    envios = [
        {
            'numero_guia': 'TR001',
            'cliente': clientes_creados[0],
            'ruta': rutas_creadas[0],
            'vehiculo': vehiculos_creados[0],
            'conductor': conductores_creados[0],
            'descripcion_carga': 'Equipos electrónicos - Computadoras y periféricos',
            'peso_kg': 500.00,
            'volumen_m3': 3.50,
            'direccion_recogida': 'Polígono Industrial Las Rosas, Nave 15',
            'direccion_entrega': 'Centro Comercial Plaza Norte, Local 45',
            'contacto_recogida': 'Alberto Ruiz',
            'contacto_entrega': 'Carmen Silva',
            'telefono_recogida': '+34 915 123 456',
            'telefono_entrega': '+34 934 789 012',
            'fecha_recogida_programada': datetime.now() + timedelta(days=1),
            'fecha_entrega_programada': datetime.now() + timedelta(days=2),
            'costo_envio': 350.00,
            'valor_declarado': 12000.00,
            'estado': 'pendiente',
            'prioridad': 'alta'
        },
        {
            'numero_guia': 'TR002',
            'cliente': clientes_creados[1],
            'ruta': rutas_creadas[1],
            'vehiculo': vehiculos_creados[1],
            'conductor': conductores_creados[1],
            'descripcion_carga': 'Muebles de oficina - Escritorios y sillas',
            'peso_kg': 800.00,
            'volumen_m3': 8.20,
            'direccion_recogida': 'Almacén Central Muebles, Calle Industria 22',
            'direccion_entrega': 'Oficinas Torre Business, Planta 8',
            'contacto_recogida': 'Miguel Torres',
            'contacto_entrega': 'Laura Vega',
            'telefono_recogida': '+34 963 456 789',
            'telefono_entrega': '+34 954 123 456',
            'fecha_recogida_programada': datetime.now() - timedelta(days=1),
            'fecha_entrega_programada': datetime.now() + timedelta(days=1),
            'fecha_recogida_real': datetime.now() - timedelta(hours=8),
            'costo_envio': 280.00,
            'valor_declarado': 8500.00,
            'estado': 'en_transito',
            'prioridad': 'media'
        },
        {
            'numero_guia': 'TR003',
            'cliente': clientes_creados[2],
            'ruta': rutas_creadas[2],
            'vehiculo': vehiculos_creados[2],
            'conductor': conductores_creados[2],
            'descripcion_carga': 'Material de construcción - Herramientas y cemento',
            'peso_kg': 1200.00,
            'volumen_m3': 6.80,
            'direccion_recogida': 'Almacén Construcción Norte, Polígono El Prado',
            'direccion_entrega': 'Obra Residencial Los Olivos, Parcela 12',
            'contacto_recogida': 'José Antonio López',
            'contacto_entrega': 'Francisco Martín',
            'telefono_recogida': '+34 985 789 123',
            'telefono_entrega': '+34 912 456 789',
            'fecha_recogida_programada': datetime.now() + timedelta(days=3),
            'fecha_entrega_programada': datetime.now() + timedelta(days=4),
            'costo_envio': 420.00,
            'valor_declarado': 6200.00,
            'estado': 'pendiente',
            'prioridad': 'baja'
        }
    ]
    
    envios_creados = []
    for envio_data in envios:
        envio = Envio.objects.create(**envio_data)
        envios_creados.append(envio)
        print(f"  ✓ Envío creado: {envio.numero_guia} - {envio.cliente.nombre}")
        
        # Crear seguimiento inicial para cada envío
        SeguimientoEnvio.objects.create(
            envio=envio,
            estado=envio.estado,
            descripcion=f"Envío {envio.numero_guia} registrado en el sistema",
            ubicacion=envio.ruta.origen if envio.estado == 'pendiente' else 'En tránsito'
        )
    
    print("\n🎉 ¡Datos de prueba creados exitosamente!")
    print(f"📊 Resumen:")
    print(f"  - {len(clientes_creados)} clientes")
    print(f"  - {len(conductores_creados)} conductores")  
    print(f"  - {len(vehiculos_creados)} vehículos")
    print(f"  - {len(rutas_creadas)} rutas")
    print(f"  - {len(envios_creados)} envíos")
    
    print(f"\n🚀 Ahora puedes probar el sistema en:")
    print(f"  Frontend: http://localhost:3000")
    print(f"  Admin: http://localhost:8000/admin/ (admin/admin123)")

if __name__ == "__main__":
    crear_datos_prueba()
