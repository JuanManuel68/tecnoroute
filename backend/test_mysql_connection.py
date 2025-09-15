#!/usr/bin/env python
"""
Script para verificar y configurar la conexión MySQL con XAMPP
"""

import sys
import mysql.connector
from mysql.connector import Error

def test_mysql_connection():
    """Prueba la conexión a MySQL y crea la base de datos si es necesario"""
    
    print("🔍 Verificando conexión a MySQL...")
    
    # Configuración de conexión para XAMPP
    config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '',  # XAMPP por defecto no tiene contraseña
        'charset': 'utf8mb4',
        'collation': 'utf8mb4_unicode_ci'
    }
    
    try:
        # Conectar a MySQL (sin especificar base de datos)
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        
        print("✅ Conexión a MySQL exitosa")
        
        # Verificar si la base de datos existe
        cursor.execute("SHOW DATABASES LIKE 'tecnoroute_db'")
        result = cursor.fetchone()
        
        if result:
            print("✅ Base de datos 'tecnoroute_db' ya existe")
        else:
            print("⚠️  Base de datos 'tecnoroute_db' no existe. Creándola...")
            
            # Crear la base de datos
            cursor.execute("""
                CREATE DATABASE tecnoroute_db 
                CHARACTER SET utf8mb4 
                COLLATE utf8mb4_unicode_ci
            """)
            
            print("✅ Base de datos 'tecnoroute_db' creada exitosamente")
        
        # Verificar que podemos conectarnos a la base de datos específica
        cursor.execute("USE tecnoroute_db")
        
        # Mostrar información de la base de datos
        cursor.execute("SELECT DATABASE()")
        current_db = cursor.fetchone()[0]
        print(f"📊 Base de datos actual: {current_db}")
        
        # Mostrar características de la base de datos
        cursor.execute("""
            SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
            FROM information_schema.SCHEMATA 
            WHERE SCHEMA_NAME = 'tecnoroute_db'
        """)
        db_info = cursor.fetchone()
        if db_info:
            print(f"🔤 Character Set: {db_info[0]}")
            print(f"🔤 Collation: {db_info[1]}")
        
        cursor.close()
        connection.close()
        
        print("\n🎉 ¡MySQL está configurado correctamente para TECNOROUTE!")
        print("📝 Configuración de Django en settings.py:")
        print("""
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
}
        """)
        
        return True
        
    except Error as e:
        print(f"❌ Error de conexión a MySQL: {e}")
        print("\n🔧 SOLUCIONES POSIBLES:")
        print("1. Verificar que XAMPP esté ejecutándose")
        print("2. Iniciar el servicio MySQL en XAMPP Control Panel")
        print("3. Verificar que el puerto 3306 no esté bloqueado")
        print("4. Revisar que no haya otro servicio MySQL ejecutándose")
        
        return False
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def check_xampp_status():
    """Verifica el estado de XAMPP"""
    print("\n🔍 Verificando estado de XAMPP...")
    print("📋 Para que funcione correctamente:")
    print("1. Abre XAMPP Control Panel")
    print("2. Verifica que Apache esté en estado 'Running' (verde)")
    print("3. Verifica que MySQL esté en estado 'Running' (verde)")
    print("4. Si no están ejecutándose, haz clic en 'Start' para cada servicio")
    print("\n🌐 Servicios necesarios:")
    print("   - Apache: Para phpMyAdmin (opcional)")
    print("   - MySQL: REQUERIDO para TECNOROUTE")

if __name__ == '__main__':
    print("🚀 VERIFICACIÓN DE CONEXIÓN MYSQL PARA TECNOROUTE")
    print("=" * 60)
    
    # Verificar estado de XAMPP
    check_xampp_status()
    
    # Probar conexión
    success = test_mysql_connection()
    
    if success:
        print("\n✅ ¡TODO LISTO! Puedes proceder con:")
        print("   python manage.py migrate")
        print("   python create_production_data.py")
    else:
        print("\n❌ Por favor, corrige los problemas antes de continuar")
        sys.exit(1)