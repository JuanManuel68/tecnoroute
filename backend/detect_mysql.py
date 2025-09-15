#!/usr/bin/env python
"""
Script para detectar y conectar a MySQL en diferentes configuraciones
"""

import socket
import mysql.connector
from mysql.connector import Error

def check_port(host, port):
    """Verifica si un puerto está abierto"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False

def test_mysql_configs():
    """Prueba diferentes configuraciones de MySQL"""
    
    configs = [
        {'host': 'localhost', 'port': 3306, 'user': 'root', 'password': ''},
        {'host': '127.0.0.1', 'port': 3306, 'user': 'root', 'password': ''},
        {'host': 'localhost', 'port': 3307, 'user': 'root', 'password': ''},
        {'host': 'localhost', 'port': 3308, 'user': 'root', 'password': ''},
    ]
    
    print("🔍 Detectando configuración de MySQL...")
    
    for i, config in enumerate(configs, 1):
        host = config['host']
        port = config['port']
        
        print(f"\n{i}. Probando {host}:{port}...")
        
        # Verificar si el puerto está abierto
        if not check_port(host, port):
            print(f"   ❌ Puerto {port} no está abierto")
            continue
            
        print(f"   ✅ Puerto {port} está abierto")
        
        # Intentar conexión MySQL
        try:
            connection = mysql.connector.connect(
                host=host,
                port=port,
                user=config['user'],
                password=config['password'],
                charset='utf8mb4'
            )
            
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()[0]
            
            print(f"   ✅ Conexión MySQL exitosa - Versión: {version}")
            
            # Crear base de datos
            cursor.execute("SHOW DATABASES LIKE 'tecnoroute_db'")
            if cursor.fetchone():
                print("   ✅ Base de datos 'tecnoroute_db' ya existe")
            else:
                print("   ⚠️  Creando base de datos 'tecnoroute_db'...")
                cursor.execute("""
                    CREATE DATABASE tecnoroute_db 
                    CHARACTER SET utf8mb4 
                    COLLATE utf8mb4_unicode_ci
                """)
                print("   ✅ Base de datos 'tecnoroute_db' creada")
            
            cursor.close()
            connection.close()
            
            return config
            
        except Error as e:
            print(f"   ❌ Error MySQL: {e}")
            continue
        except Exception as e:
            print(f"   ❌ Error: {e}")
            continue
    
    return None

def update_django_settings(config):
    """Actualiza la configuración de Django con la configuración detectada"""
    
    print(f"\n📝 Configuración detectada para Django:")
    print(f"Host: {config['host']}")
    print(f"Puerto: {config['port']}")
    print(f"Usuario: {config['user']}")
    
    settings_content = f"""
# Configuración MySQL detectada automáticamente
DATABASES = {{
    'default': {{
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tecnoroute_db',
        'USER': '{config['user']}',
        'PASSWORD': '{config['password']}',
        'HOST': '{config['host']}',
        'PORT': '{config['port']}',
        'OPTIONS': {{
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        }}
    }}
}}
    """
    
    print(settings_content)
    
    # Actualizar el archivo settings.py
    try:
        with open('backend/settings.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Buscar y reemplazar la sección DATABASES
        import re
        pattern = r"DATABASES\s*=\s*\{.*?\}\s*\}"
        replacement = f"""DATABASES = {{
    'default': {{
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tecnoroute_db',
        'USER': '{config['user']}',
        'PASSWORD': '{config['password']}',
        'HOST': '{config['host']}',
        'PORT': '{config['port']}',
        'OPTIONS': {{
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        }}
    }}
}}"""
        
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        with open('backend/settings.py', 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ Archivo settings.py actualizado automáticamente")
        
    except Exception as e:
        print(f"⚠️  No se pudo actualizar settings.py automáticamente: {e}")
        print("Por favor, actualiza manualmente con la configuración mostrada arriba")

if __name__ == '__main__':
    print("🚀 DETECTOR DE MYSQL PARA TECNOROUTE")
    print("=" * 50)
    
    # Verificar puertos comunes
    common_ports = [3306, 3307, 3308, 3309]
    print("\n🔍 Verificando puertos MySQL comunes...")
    
    open_ports = []
    for port in common_ports:
        if check_port('localhost', port):
            open_ports.append(port)
            print(f"✅ Puerto {port} está abierto")
        else:
            print(f"❌ Puerto {port} está cerrado")
    
    if not open_ports:
        print("\n❌ No se encontraron puertos MySQL abiertos")
        print("🔧 Por favor verifica que XAMPP MySQL esté ejecutándose")
        exit(1)
    
    # Probar configuraciones
    config = test_mysql_configs()
    
    if config:
        print(f"\n🎉 ¡MySQL detectado y configurado!")
        update_django_settings(config)
        print(f"\n✅ Próximos pasos:")
        print(f"   1. python manage.py migrate")
        print(f"   2. python create_production_data.py")
        print(f"   3. python manage.py runserver")
    else:
        print("\n❌ No se pudo conectar a MySQL")
        print("🔧 Verifica que XAMPP MySQL esté ejecutándose correctamente")