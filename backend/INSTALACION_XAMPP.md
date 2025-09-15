# 🚀 INSTALACIÓN COMPLETA DE TECNOROUTE CON XAMPP

Esta guía te llevará paso a paso para configurar el sistema TECNOROUTE con XAMPP y MySQL.

## 📋 REQUISITOS PREVIOS

- ✅ Windows 10/11
- ✅ XAMPP instalado
- ✅ Python 3.8+ instalado
- ✅ Git instalado (opcional)

## 🔧 PASO 1: CONFIGURAR XAMPP

### 1.1 Iniciar servicios de XAMPP
1. Abrir **XAMPP Control Panel**
2. Iniciar **Apache** ✅
3. Iniciar **MySQL** ✅

### 1.2 Crear la base de datos
1. Abrir navegador web
2. Ir a: http://localhost/phpmyadmin
3. Hacer clic en **"Nueva"** en el panel izquierdo
4. Crear nueva base de datos:
   - **Nombre**: `tecnoroute_db`
   - **Cotejamiento**: `utf8mb4_unicode_ci`
5. Hacer clic en **"Crear"**

O simplemente ejecutar el archivo SQL proporcionado:
```sql
-- Ejecutar en phpMyAdmin -> SQL
CREATE DATABASE IF NOT EXISTS tecnoroute_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## 🐍 PASO 2: CONFIGURAR ENTORNO PYTHON

### 2.1 Activar entorno virtual
```bash
# Desde la carpeta TECNOROUTE
source backend_env/Scripts/activate

# O en Windows CMD
backend_env\Scripts\activate
```

### 2.2 Instalar dependencias
```bash
pip install -r backend/requirements.txt
```

Si hay problemas con mysqlclient, instalar dependencias:
```bash
pip install mysqlclient
# Si falla, probar:
pip install PyMySQL
```

## 🗄️ PASO 3: CONFIGURAR BASE DE DATOS

### 3.1 Verificar configuración en settings.py
El archivo `backend/backend/settings.py` debe tener:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tecnoroute_db',
        'USER': 'root',
        'PASSWORD': '',  # Dejar vacío para XAMPP por defecto
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        }
    }
}
```

### 3.2 Ejecutar migraciones
```bash
# Navegar al directorio backend
cd backend

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate
```

## 📊 PASO 4: CARGAR DATOS DE PRODUCCIÓN

### 4.1 Ejecutar script de datos
```bash
# Desde el directorio backend
python create_production_data.py
```

Este script creará:
- ✅ **5 usuarios del sistema** (incluyendo administradores y empleados)
- ✅ **5 conductores profesionales** con licencias válidas
- ✅ **7 clientes corporativos** (empresas reales colombianas)
- ✅ **6 vehículos de flota** (trailers, camiones, furgonetas)
- ✅ **6 rutas comerciales** principales de Colombia
- ✅ **3 pedidos de transporte** iniciales

## 🚀 PASO 5: INICIAR EL SERVIDOR

### 5.1 Ejecutar servidor Django
```bash
# Desde el directorio backend
python manage.py runserver 8000
```

### 5.2 Verificar instalación
- **API Base**: http://localhost:8000/api/
- **Panel Admin**: http://localhost:8000/admin/
- **Login API**: http://localhost:8000/api/auth/login/

## 🔑 CREDENCIALES DE ACCESO

### Administradores
| Usuario | Email | Contraseña | Rol |
|---------|--------|------------|-----|
| admin | admin@tecnoroute.com | admin123 | Administrador Principal |
| carlos_admin | carlos.admin@tecnoroute.com | tecno2024* | Administrador Secundario |

### Usuarios Cliente
| Usuario | Email | Contraseña | Rol |
|---------|--------|------------|-----|
| juan_perez | juan.perez@tecnoroute.com | tecno2024* | Cliente |
| maria_gonzalez | maria.gonzalez@tecnoroute.com | tecno2024* | Cliente |

### Conductores
| Usuario | Email | Contraseña | Cédula | Licencia |
|---------|--------|------------|--------|----------|
| pedro_martinez | pedro.martinez@tecnoroute.com | conductor2024* | 80123456 | C2-80123456 |
| ana_rodriguez | ana.rodriguez@tecnoroute.com | conductor2024* | 43987654 | C2-43987654 |
| luis_garcia | luis.garcia@tecnoroute.com | conductor2024* | 17555888 | C2-17555888 |

## 🧪 PASO 6: PROBAR EL SISTEMA

### 6.1 Login API
**Endpoint**: `POST http://localhost:8000/api/auth/login/`

**Ejemplo de request**:
```json
{
  "email": "admin@tecnoroute.com",
  "password": "admin123"
}
```

**Respuesta esperada**:
```json
{
  "token": "abc123...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@tecnoroute.com",
    "role": "admin",
    "first_name": "Administrador",
    "last_name": "Sistema"
  },
  "message": "Bienvenido Administrador Sistema"
}
```

### 6.2 Obtener pedidos (con token)
**Endpoint**: `GET http://localhost:8000/api/pedidos-transporte/`

**Headers**:
```
Authorization: Token abc123...
Content-Type: application/json
```

### 6.3 Panel de Administración Django
1. Ir a: http://localhost:8000/admin/
2. Login con: admin@tecnoroute.com / admin123
3. Explorar todos los modelos del sistema

## 📱 ENDPOINTS PRINCIPALES DE LA API

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login/` | Iniciar sesión | No |
| POST | `/api/auth/logout/` | Cerrar sesión | Sí |
| GET | `/api/auth/profile/` | Perfil de usuario | Sí |
| GET | `/api/pedidos-transporte/` | Listar pedidos | Sí |
| POST | `/api/pedidos-transporte/` | Crear pedido | Sí |
| GET | `/api/pedidos-transporte/{id}/` | Ver pedido específico | Sí |
| GET | `/api/pedidos-transporte/mis_pedidos/` | Mis pedidos (usuario) | Sí |
| GET | `/api/pedidos-transporte/estadisticas/` | Estadísticas (admin) | Admin |
| POST | `/api/pedidos-transporte/{id}/asignar_conductor/` | Asignar conductor (admin) | Admin |
| POST | `/api/pedidos-transporte/{id}/cambiar_estado/` | Cambiar estado | Conductor/Admin |
| GET | `/api/clientes/` | Listar clientes | Sí |
| GET | `/api/conductores/` | Listar conductores | Sí |
| GET | `/api/vehiculos/` | Listar vehículos | Sí |
| GET | `/api/rutas/` | Listar rutas | Sí |

## 🎯 FUNCIONALIDADES POR ROL

### 👨‍💼 ADMINISTRADOR
- ✅ Ver todos los pedidos del sistema
- ✅ Asignar conductores y vehículos a pedidos
- ✅ Gestionar clientes, conductores, vehículos y rutas
- ✅ Ver estadísticas completas
- ✅ Cambiar estados de pedidos
- ✅ Acceso completo al panel de administración

### 👤 USUARIO CLIENTE
- ✅ Ver solo sus propios pedidos
- ✅ Crear nuevos pedidos de transporte
- ✅ Ver estado y seguimiento de sus pedidos
- ✅ Editar pedidos en estado 'pendiente'
- ❌ No puede ver datos de otros usuarios

### 🚛 CONDUCTOR
- ✅ Ver pedidos asignados a él
- ✅ Cambiar estado de sus pedidos asignados
- ✅ Ver información de rutas y clientes
- ❌ No puede asignar recursos
- ❌ No puede ver pedidos de otros conductores

## 🔧 TROUBLESHOOTING

### Error de conexión MySQL
1. Verificar que XAMPP MySQL esté ejecutándose
2. Verificar credenciales en `settings.py`
3. Crear la base de datos `tecnoroute_db` manualmente

### Error mysqlclient
```bash
pip install mysqlclient
# Si falla en Windows:
conda install mysqlclient
```

### Error de migraciones
```bash
# Resetear migraciones
python manage.py migrate --fake-initial
python manage.py migrate
```

### Puerto ocupado
```bash
# Usar puerto diferente
python manage.py runserver 8080
```

## 🎉 ¡SISTEMA LISTO!

Una vez completados todos los pasos, tendrás:

✅ **Base de datos MySQL** configurada en XAMPP
✅ **Sistema TECNOROUTE** funcionando completamente  
✅ **Datos de producción** cargados con empresas reales
✅ **API REST** completa con autenticación por roles
✅ **Panel de administración** Django funcional
✅ **Restricciones de email únicos** implementadas
✅ **Dashboards diferenciados** según tipo de usuario

## 📞 SOPORTE

Si tienes problemas durante la instalación:

1. Revisa que XAMPP esté ejecutándose correctamente
2. Verifica que Python y las dependencias estén instaladas
3. Confirma que la base de datos `tecnoroute_db` existe
4. Revisa los logs del servidor Django para errores específicos

¡El sistema TECNOROUTE está listo para gestionar tu empresa de logística! 🚚📦