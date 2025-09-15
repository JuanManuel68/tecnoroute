#!/usr/bin/env python
"""
Script para crear usuarios, productos, categorías y pedidos de prueba
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import UserProfile, Categoria, Producto, Carrito, CarritoItem, Pedido, PedidoItem

def create_test_users_and_orders():
    print("🚀 Creando usuarios, productos y pedidos de prueba...")
    
    # Crear usuarios
    print("👥 Creando usuarios...")
    
    # Admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@tecnoroute.com',
            'first_name': 'Admin',
            'last_name': 'TecnoRoute',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
    
    admin_profile, created = UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={
            'role': 'admin',
            'telefono': '+34 600 000 000',
            'direccion': 'Oficina Principal, Madrid'
        }
    )
    
    print(f"  ✓ Usuario admin creado: {admin_user.username}")
    
    # Customer users
    customers_data = [
        {
            'username': 'usuario1',
            'email': 'usuario1@gmail.com',
            'first_name': 'Juan',
            'last_name': 'García',
            'telefono': '+34 600 111 111',
            'direccion': 'Calle Mayor 1, Madrid'
        },
        {
            'username': 'usuario2',
            'email': 'usuario2@gmail.com',
            'first_name': 'María',
            'last_name': 'López',
            'telefono': '+34 600 222 222',
            'direccion': 'Avenida del Sol 2, Barcelona'
        },
        {
            'username': 'cliente1',
            'email': 'cliente@hotmail.com',
            'first_name': 'Pedro',
            'last_name': 'Martínez',
            'telefono': '+34 600 333 333',
            'direccion': 'Plaza Central 3, Valencia'
        }
    ]
    
    customers = []
    for customer_data in customers_data:
        user, created = User.objects.get_or_create(
            username=customer_data['username'],
            defaults={
                'email': customer_data['email'],
                'first_name': customer_data['first_name'],
                'last_name': customer_data['last_name'],
            }
        )
        if created:
            user.set_password('123456')
            user.save()
        
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'role': 'customer',
                'telefono': customer_data['telefono'],
                'direccion': customer_data['direccion']
            }
        )
        
        customers.append(user)
        print(f"  ✓ Usuario creado: {user.username} - {user.get_full_name()}")
    
    # Crear categorías
    print("🏷️ Creando categorías...")
    categorias_data = [
        {'nombre': 'Electrodomésticos', 'descripcion': 'Aparatos eléctricos para el hogar'},
        {'nombre': 'Informática', 'descripcion': 'Computadoras y accesorios'},
        {'nombre': 'Telefonía', 'descripcion': 'Teléfonos móviles y accesorios'},
        {'nombre': 'Audio y Video', 'descripcion': 'Equipos de sonido y televisores'},
    ]
    
    categorias = []
    for cat_data in categorias_data:
        categoria, created = Categoria.objects.get_or_create(
            nombre=cat_data['nombre'],
            defaults=cat_data
        )
        categorias.append(categoria)
        print(f"  ✓ Categoría creada: {categoria.nombre}")
    
    # Crear productos
    print("📦 Creando productos...")
    productos_data = [
        {'nombre': 'Refrigerador LG 300L', 'categoria': categorias[0], 'precio': 450.00, 'stock': 10, 'descripcion': 'Refrigerador de 300 litros con freezer'},
        {'nombre': 'Lavadora Samsung 8kg', 'categoria': categorias[0], 'precio': 380.00, 'stock': 15, 'descripcion': 'Lavadora automática de 8kg'},
        {'nombre': 'Laptop Dell Inspiron', 'categoria': categorias[1], 'precio': 650.00, 'stock': 8, 'descripcion': 'Laptop con procesador i5, 8GB RAM'},
        {'nombre': 'iPhone 13', 'categoria': categorias[2], 'precio': 800.00, 'stock': 20, 'descripcion': 'Smartphone Apple iPhone 13 128GB'},
        {'nombre': 'Smart TV 55" Samsung', 'categoria': categorias[3], 'precio': 550.00, 'stock': 12, 'descripcion': 'Televisor Smart TV 55 pulgadas 4K'},
        {'nombre': 'Microondas Panasonic', 'categoria': categorias[0], 'precio': 120.00, 'stock': 25, 'descripcion': 'Microondas 20L con grill'},
        {'nombre': 'Tablet iPad Air', 'categoria': categorias[1], 'precio': 480.00, 'stock': 18, 'descripcion': 'Tablet Apple iPad Air 64GB'},
        {'nombre': 'Auriculares Sony', 'categoria': categorias[3], 'precio': 85.00, 'stock': 30, 'descripcion': 'Auriculares inalámbricos con cancelación de ruido'},
    ]
    
    productos = []
    for prod_data in productos_data:
        producto, created = Producto.objects.get_or_create(
            nombre=prod_data['nombre'],
            defaults=prod_data
        )
        productos.append(producto)
        print(f"  ✓ Producto creado: {producto.nombre} - ${producto.precio}")
    
    # Crear pedidos
    print("🛒 Creando pedidos...")
    
    # Pedidos para cada usuario
    for i, customer in enumerate(customers):
        # Crear 2-3 pedidos por usuario
        num_pedidos = 2 if i == 0 else 3 if i == 1 else 2
        
        for j in range(num_pedidos):
            # Generar número de pedido único
            numero_pedido = f"PED-{uuid.uuid4().hex[:8].upper()}"
            
            # Seleccionar productos aleatorios
            import random
            num_items = random.randint(1, 4)
            productos_pedido = random.sample(productos, num_items)
            
            # Calcular total
            total = Decimal('0.00')
            items_data = []
            
            for producto in productos_pedido:
                cantidad = random.randint(1, 3)
                precio_unitario = Decimal(str(producto.precio))
                subtotal = precio_unitario * cantidad
                total += subtotal
                
                items_data.append({
                    'producto': producto,
                    'cantidad': cantidad,
                    'precio_unitario': precio_unitario,
                    'subtotal': subtotal
                })
            
            # Estados posibles
            estados = ['pendiente', 'confirmado', 'enviado', 'entregado']
            estado = random.choice(estados)
            
            # Crear pedido
            pedido = Pedido.objects.create(
                usuario=customer,
                numero_pedido=numero_pedido,
                total=total,
                direccion_envio=f"{customer.userprofile.direccion}",
                telefono_contacto=customer.userprofile.telefono,
                notas=f"Pedido de prueba #{j+1} para {customer.get_full_name()}",
                estado=estado
            )
            
            # Crear items del pedido
            for item_data in items_data:
                PedidoItem.objects.create(
                    pedido=pedido,
                    **item_data
                )
            
            print(f"  ✓ Pedido creado: {numero_pedido} - {customer.username} - ${total} ({estado})")
    
    print("\n🎉 ¡Usuarios, productos y pedidos creados exitosamente!")
    
    # Mostrar resumen
    print(f"📊 Resumen:")
    print(f"  - {User.objects.count()} usuarios totales")
    print(f"  - {Categoria.objects.count()} categorías")
    print(f"  - {Producto.objects.count()} productos")
    print(f"  - {Pedido.objects.count()} pedidos")
    print(f"  - {PedidoItem.objects.count()} items de pedidos")

if __name__ == '__main__':
    create_test_users_and_orders()
