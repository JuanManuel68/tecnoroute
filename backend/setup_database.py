#!/usr/bin/env python
"""
Script para configurar automáticamente la base de datos (MySQL o SQLite)
según la disponibilidad de XAMPP MySQL
"""

import os
import sys
import socket
import re

def check_mysql_available():
    """Verifica si MySQL está disponible en localhost:3306"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex(('localhost', 3306))
        sock.close()
        return result == 0
    except Exception:
        return False

def update_settings_to_sqlite():
    """Actualiza settings.py para usar SQLite"""
    
    settings_file = 'backend/settings.py'
    
    try:
        with open(settings_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Reemplazar configuración MySQL por SQLite
        sqlite_config = """# Base de datos - SQLite (temporal mientras XAMPP no esté disponible)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'tecnoroute_db.sqlite3',
    }
}"""
        
        # Buscar y reemplazar la sección DATABASES
        pattern = r"# Base de datos.*?DATABASES\s*=\s*\{.*?\}\s*\}"
        new_content = re.sub(pattern, sqlite_config, content, flags=re.DOTALL)
        
        with open(settings_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ Configuración cambiada a SQLite")
        return True
        
    except Exception as e:
        print(f"❌ Error actualizando settings.py: {e}")
        return False

def update_settings_to_mysql():
    """Actualiza settings.py para usar MySQL"""
    
    settings_file = 'backend/settings.py'
    
    try:
        with open(settings_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Configuración MySQL
        mysql_config = """# Base de datos - MySQL con XAMPP
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tecnoroute_db',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        }
    }
}"""
        
        # Buscar y reemplazar la sección DATABASES
        pattern = r"# Base de datos.*?DATABASES\s*=\s*\{.*?\}\s*\}"
        new_content = re.sub(pattern, mysql_config, content, flags=re.DOTALL)
        
        with open(settings_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ Configuración cambiada a MySQL")
        return True
        
    except Exception as e:
        print(f"❌ Error actualizando settings.py: {e}")
        return False

def main():
    print("🔧 CONFIGURADOR AUTOMÁTICO DE BASE DE DATOS TECNOROUTE")
    print("=" * 60)
    
    print("🔍 Verificando disponibilidad de MySQL...")
    
    if check_mysql_available():
        print("✅ MySQL está disponible en localhost:3306")
        print("📝 Configurando Django para usar MySQL...")
        
        if update_settings_to_mysql():
            # Verificar conexión con mysql-connector-python
            try:
                import mysql.connector
                connection = mysql.connector.connect(
                    host='localhost',
                    port=3306,
                    user='root',
                    password='',
                    charset='utf8mb4'
                )
                cursor = connection.cursor()
                
                # Crear base de datos si no existe
                cursor.execute("CREATE DATABASE IF NOT EXISTS tecnoroute_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                print("✅ Base de datos 'tecnoroute_db' verificada/creada")
                
                cursor.close()
                connection.close()
                
                print("\n🎉 ¡MySQL configurado correctamente!")
                print("📋 Próximos pasos:")
                print("   1. python manage.py migrate")
                print("   2. python create_production_data.py")
                
            except Exception as e:
                print(f"⚠️  Error verificando MySQL: {e}")
                print("🔄 Cambiando a SQLite como respaldo...")
                update_settings_to_sqlite()
    else:
        print("⚠️  MySQL no está disponible (XAMPP no iniciado)")
        print("🔄 Configurando SQLite como base de datos temporal...")
        
        if update_settings_to_sqlite():
            print("\n📋 SQLite configurado correctamente")
            print("📋 Próximos pasos:")
            print("   1. python manage.py migrate")
            print("   2. python create_production_data.py")
            print("\n💡 Cuando XAMPP esté disponible:")
            print("   1. Ejecuta este script de nuevo")
            print("   2. Los datos se migrarán automáticamente")

if __name__ == '__main__':
    main()