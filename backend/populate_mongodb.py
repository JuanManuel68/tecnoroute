#!/usr/bin/env python
"""
Script para poblar MongoDB con datos de prueba para TecnoRoute
"""

import os
import django
from decimal import Decimal
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from logistics.mongo_models import Cliente, Conductor, Vehiculo, Ruta, Envio


def clear_all_data():
    """Limpiar toda la data existente"""
    print("🧹 Limpiando datos existentes...")
    Cliente.objects.all().delete()
    Conductor.objects.all().delete()
    Vehiculo.objects.all().delete()
    Ruta.objects.all().delete()
    Envio.objects.all().delete()
    print("✅ Datos limpiados")


def create_clientes():
    """Crear clientes de prueba"""
    print("👥 Creando clientes...")
    
    clientes_data = [
        {
            'nombre': 'Empresa ABC S.A.',
            'email': 'contacto@empresaabc.com',
            'telefono': '+34 91 123 4567',
            'direccion': 'Calle Mayor 123, 4º B',
            'ciudad': 'Madrid',
            'codigo_postal': '28001'
        },
        {
            'nombre': 'Logística del Norte SL',
            'email': 'info@logisticanorte.es',
            'telefono': '+34 98 456 7890',
            'direccion': 'Avenida Industrial 45',
            'ciudad': 'Oviedo',
            'codigo_postal': '33001'
        },
        {
            'nombre': 'Distribuciones Valencia',
            'email': 'pedidos@distrivalencia.com',
            'telefono': '+34 96 789 0123',
            'direccion': 'Polígono Industrial Sur, Nave 12',
            'ciudad': 'Valencia',
            'codigo_postal': '46001'
        },
        {
            'nombre': 'Comercial Andaluza',
            'email': 'ventas@comandaluza.es',
            'telefono': '+34 95 234 5678',
            'direccion': 'Plaza de la Constitución 8',
            'ciudad': 'Sevilla',
            'codigo_postal': '41001'
        },
        {
            'nombre': 'Importex Cataluña',
            'email': 'importex@catalonia.com',
            'telefono': '+34 93 345 6789',
            'direccion': 'Passeig de Gràcia 102',
            'ciudad': 'Barcelona',
            'codigo_postal': '08008'
        }
    ]
    
    clientes = []
    for data in clientes_data:
        cliente = Cliente.objects.create(**data)
        clientes.append(cliente)
        print(f"  ✓ {cliente.nombre}")
    
    return clientes


def create_conductores():
    """Crear conductores de prueba"""
    print("🚗 Creando conductores...")
    
    conductores_data = [
        {
            'nombre': 'Juan Pérez García',
            'cedula': '12345678A',
            'licencia': 'B-C1-C-D',
            'telefono': '+34 91 111 2222',
            'email': 'juan.perez@tecnoroute.com',
            'direccion': 'Calle Toledo 25, Madrid',
            'fecha_contratacion': datetime(2022, 1, 15),
            'estado': 'disponible'
        },
        {
            'nombre': 'María López Rodríguez',
            'cedula': '87654321B',
            'licencia': 'B-C1-C',
            'telefono': '+34 98 333 4444',
            'email': 'maria.lopez@tecnoroute.com',
            'direccion': 'Avenida de la Paz 78, Oviedo',
            'fecha_contratacion': datetime(2021, 6, 10),
            'estado': 'en_ruta'
        },
        {
            'nombre': 'Carlos Martínez Sánchez',
            'cedula': '11223344C',
            'licencia': 'B-C1-C-D',
            'telefono': '+34 96 555 6666',
            'email': 'carlos.martinez@tecnoroute.com',
            'direccion': 'Calle Valencia 92, Valencia',
            'fecha_contratacion': datetime(2023, 3, 5),
            'estado': 'disponible'
        },
        {
            'nombre': 'Ana Fernández Torres',
            'cedula': '44556677D',
            'licencia': 'B-C1',
            'telefono': '+34 95 777 8888',
            'email': 'ana.fernandez@tecnoroute.com',
            'direccion': 'Plaza España 14, Sevilla',
            'fecha_contratacion': datetime(2020, 9, 20),
            'estado': 'descanso'
        },
        {
            'nombre': 'Roberto García Villa',
            'cedula': '99887766E',
            'licencia': 'B-C1-C-D-E',
            'telefono': '+34 93 999 0000',
            'email': 'roberto.garcia@tecnoroute.com',
            'direccion': 'Rambla Cataluña 156, Barcelona',
            'fecha_contratacion': datetime(2019, 11, 1),
            'estado': 'disponible'
        }
    ]
    
    conductores = []
    for data in conductores_data:
        conductor = Conductor.objects.create(**data)
        conductores.append(conductor)
        print(f"  ✓ {conductor.nombre} - {conductor.estado}")
    
    return conductores


def create_vehiculos():
    """Crear vehículos de prueba"""
    print("🚛 Creando vehículos...")
    
    vehiculos_data = [
        {
            'placa': 'ABC-1234',
            'marca': 'Mercedes-Benz',
            'modelo': 'Sprinter 316',
            'año': 2020,
            'tipo': 'furgoneta',
            'capacidad_peso': Decimal('3500.00'),
            'capacidad_volumen': Decimal('14.00'),
            'estado': 'disponible',
            'kilometraje': 45000
        },
        {
            'placa': 'DEF-5678',
            'marca': 'Iveco',
            'modelo': 'Daily 35S14',
            'año': 2019,
            'tipo': 'furgoneta',
            'capacidad_peso': Decimal('3500.00'),
            'capacidad_volumen': Decimal('12.50'),
            'estado': 'en_uso',
            'kilometraje': 72000
        },
        {
            'placa': 'GHI-9012',
            'marca': 'Volvo',
            'modelo': 'FH16 750',
            'año': 2021,
            'tipo': 'camion',
            'capacidad_peso': Decimal('40000.00'),
            'capacidad_volumen': Decimal('90.00'),
            'estado': 'disponible',
            'kilometraje': 28000
        },
        {
            'placa': 'JKL-3456',
            'marca': 'MAN',
            'modelo': 'TGX 28.480',
            'año': 2018,
            'tipo': 'camion',
            'capacidad_peso': Decimal('40000.00'),
            'capacidad_volumen': Decimal('100.00'),
            'estado': 'mantenimiento',
            'kilometraje': 95000
        },
        {
            'placa': 'MNO-7890',
            'marca': 'Ford',
            'modelo': 'Transit 350L',
            'año': 2022,
            'tipo': 'furgoneta',
            'capacidad_peso': Decimal('2000.00'),
            'capacidad_volumen': Decimal('9.50'),
            'estado': 'disponible',
            'kilometraje': 12000
        }
    ]
    
    vehiculos = []
    for data in vehiculos_data:
        vehiculo = Vehiculo.objects.create(**data)
        vehiculos.append(vehiculo)
        print(f"  ✓ {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}")
    
    return vehiculos


def create_rutas():
    """Crear rutas de prueba"""
    print("🛣️ Creando rutas...")
    
    rutas_data = [
        {
            'nombre': 'Madrid - Barcelona Express',
            'origen': 'Madrid, España',
            'destino': 'Barcelona, España',
            'distancia_km': Decimal('620.50'),
            'tiempo_estimado_horas': Decimal('6.50'),
            'costo_combustible': Decimal('185.00'),
            'peajes': Decimal('45.20'),
            'estado': 'planificada'
        },
        {
            'nombre': 'Valencia - Sevilla Sur',
            'origen': 'Valencia, España',
            'destino': 'Sevilla, España',
            'distancia_km': Decimal('520.00'),
            'tiempo_estimado_horas': Decimal('5.25'),
            'costo_combustible': Decimal('156.00'),
            'peajes': Decimal('32.50'),
            'estado': 'en_progreso'
        },
        {
            'nombre': 'Bilbao - Madrid Norte',
            'origen': 'Bilbao, España',
            'destino': 'Madrid, España',
            'distancia_km': Decimal('395.00'),
            'tiempo_estimado_horas': Decimal('4.00'),
            'costo_combustible': Decimal('118.50'),
            'peajes': Decimal('28.70'),
            'estado': 'completada'
        },
        {
            'nombre': 'Barcelona - Valencia Costa',
            'origen': 'Barcelona, España',
            'destino': 'Valencia, España',
            'distancia_km': Decimal('350.00'),
            'tiempo_estimado_horas': Decimal('3.50'),
            'costo_combustible': Decimal('105.00'),
            'peajes': Decimal('25.40'),
            'estado': 'planificada'
        },
        {
            'nombre': 'Sevilla - Granada Andalucía',
            'origen': 'Sevilla, España',
            'destino': 'Granada, España',
            'distancia_km': Decimal('250.00'),
            'tiempo_estimado_horas': Decimal('2.75'),
            'costo_combustible': Decimal('75.00'),
            'peajes': Decimal('15.30'),
            'estado': 'planificada'
        }
    ]
    
    rutas = []
    for data in rutas_data:
        ruta = Ruta.objects.create(**data)
        rutas.append(ruta)
        print(f"  ✓ {ruta.nombre} - {ruta.distancia_km} km")
    
    return rutas


def create_envios(clientes, conductores, vehiculos, rutas):
    """Crear envíos de prueba"""
    print("📦 Creando envíos...")
    
    # Crear algunos envíos usando los datos creados
    envios_data = [
        {
            'numero_guia': 'TR001-2024-001',
            'cliente_id': clientes[0].id,
            'ruta_id': rutas[0].id,
            'vehiculo_id': vehiculos[0].id,
            'conductor_id': conductores[0].id,
            'descripcion_carga': 'Equipos electrónicos - Ordenadores y periféricos',
            'peso_kg': Decimal('850.50'),
            'volumen_m3': Decimal('12.30'),
            'direccion_recogida': 'Almacén Central, Calle de la Industria 45, Madrid',
            'direccion_entrega': 'Centro Comercial Barcelona Plaza, Barcelona',
            'contacto_recogida': 'Luis Martínez',
            'contacto_entrega': 'Carmen Torres',
            'telefono_recogida': '+34 91 234 5678',
            'telefono_entrega': '+34 93 876 5432',
            'fecha_recogida_programada': datetime.now() + timedelta(days=1),
            'fecha_entrega_programada': datetime.now() + timedelta(days=2),
            'costo_envio': Decimal('450.00'),
            'valor_declarado': Decimal('25000.00'),
            'estado': 'pendiente',
            'prioridad': 'alta',
            'observaciones': 'Mercancía frágil - Manejar con cuidado'
        },
        {
            'numero_guia': 'TR002-2024-002',
            'cliente_id': clientes[1].id,
            'ruta_id': rutas[1].id,
            'vehiculo_id': vehiculos[1].id,
            'conductor_id': conductores[1].id,
            'descripcion_carga': 'Muebles de oficina - Mesas y sillas ejecutivas',
            'peso_kg': Decimal('1200.00'),
            'volumen_m3': Decimal('18.50'),
            'direccion_recogida': 'Fábrica Norte, Polígono Industrial Oviedo',
            'direccion_entrega': 'Oficinas Centrales, Sevilla Business Park',
            'contacto_recogida': 'Pedro González',
            'contacto_entrega': 'Ana Ruiz',
            'telefono_recogida': '+34 98 456 7890',
            'telefono_entrega': '+34 95 321 6547',
            'fecha_recogida_programada': datetime.now() - timedelta(days=1),
            'fecha_entrega_programada': datetime.now() + timedelta(days=1),
            'fecha_recogida_real': datetime.now() - timedelta(days=1, hours=2),
            'costo_envio': Decimal('380.00'),
            'valor_declarado': Decimal('15000.00'),
            'estado': 'en_transito',
            'prioridad': 'media',
            'observaciones': 'Entrega en horario de oficina (9:00-18:00)'
        },
        {
            'numero_guia': 'TR003-2024-003',
            'cliente_id': clientes[2].id,
            'ruta_id': rutas[2].id,
            'vehiculo_id': vehiculos[2].id,
            'conductor_id': conductores[2].id,
            'descripcion_carga': 'Material de construcción - Herramientas y maquinaria',
            'peso_kg': Decimal('2500.75'),
            'volumen_m3': Decimal('35.20'),
            'direccion_recogida': 'Almacén Valencia Puerto, Valencia',
            'direccion_entrega': 'Obra Nueva Construcción, Madrid Norte',
            'contacto_recogida': 'Miguel Fernández',
            'contacto_entrega': 'Javier Castro',
            'telefono_recogida': '+34 96 789 0123',
            'telefono_entrega': '+34 91 654 3210',
            'fecha_recogida_programada': datetime.now() + timedelta(days=3),
            'fecha_entrega_programada': datetime.now() + timedelta(days=5),
            'costo_envio': Decimal('620.00'),
            'valor_declarado': Decimal('45000.00'),
            'estado': 'pendiente',
            'prioridad': 'baja',
            'observaciones': 'Requiere grúa para descarga'
        }
    ]
    
    envios = []
    for data in envios_data:
        envio = Envio.objects.create(**data)
        envios.append(envio)
        print(f"  ✓ {envio.numero_guia} - {envio.estado}")
    
    return envios


def main():
    """Función principal"""
    print("🚀 Iniciando población de MongoDB para TecnoRoute...")
    print("=" * 50)
    
    try:
        # Limpiar datos existentes
        clear_all_data()
        
        # Crear datos de prueba
        clientes = create_clientes()
        conductores = create_conductores()
        vehiculos = create_vehiculos()
        rutas = create_rutas()
        envios = create_envios(clientes, conductores, vehiculos, rutas)
        
        # Estadísticas finales
        print("\n" + "=" * 50)
        print("✅ ¡Población completada exitosamente!")
        print(f"📊 Resumen:")
        print(f"   👥 Clientes: {len(clientes)}")
        print(f"   🚗 Conductores: {len(conductores)}")
        print(f"   🚛 Vehículos: {len(vehiculos)}")
        print(f"   🛣️  Rutas: {len(rutas)}")
        print(f"   📦 Envíos: {len(envios)}")
        print("\n🎯 La base de datos está lista para usar!")
        
    except Exception as e:
        print(f"❌ Error durante la población: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()