# 🗄️ Configuración para HeidiSQL - TecnoRoute

## 📍 Ubicación de la Base de Datos
```
Archivo SQLite: C:\Users\Aprendiz\tecnoroute\backend\tecnoroute.sqlite3
```

## 🔧 Configuración en HeidiSQL

### Paso 1: Abrir Nueva Sesión
1. Abrir HeidiSQL
2. Hacer clic en "New" para nueva sesión
3. En "Network type" seleccionar: **SQLite**

### Paso 2: Configurar Conexión
- **Database file**: `C:\Users\Aprendiz\tecnoroute\backend\tecnoroute.sqlite3`
- **Session name**: `TecnoRoute SQLite`
- Dejar los demás campos vacíos

### Paso 3: Conectar
1. Hacer clic en "Save"
2. Hacer clic en "Open"

## 📊 Tablas Principales Creadas

### 🔐 **Autenticación**
- `auth_user` - Usuarios del sistema Django
- `authtoken_token` - Tokens de autenticación
- `user_management_userprofile` - Perfiles de usuario con datos adicionales

### 🚛 **Logística**
- `logistics_cliente` - Datos de clientes
- `logistics_conductor` - Conductores registrados
- `logistics_vehiculo` - Flota de vehículos
- `logistics_ruta` - Rutas de transporte
- `logistics_envio` - Envíos principales
- `logistics_seguimientoenvio` - Seguimiento de envíos
- `logistics_pedidotransporte` - Pedidos de transporte

### 🛒 **E-commerce (Opcional)**
- `user_management_categoria` - Categorías de productos
- `user_management_producto` - Productos
- `user_management_carrito` - Carritos de compras
- `user_management_pedido` - Pedidos de productos

## 🔍 Consultas SQL Útiles

### Ver todos los usuarios registrados:
```sql
SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    up.role,
    up.telefono,
    up.ciudad,
    up.fecha_creacion
FROM auth_user u
LEFT JOIN user_management_userprofile up ON u.id = up.user_id
ORDER BY u.date_joined DESC;
```

### Ver datos de clientes de logística:
```sql
SELECT 
    id,
    nombre,
    email,
    telefono,
    ciudad,
    activo,
    fecha_registro
FROM logistics_cliente
ORDER BY fecha_registro DESC;
```

### Ver envíos con información relacionada:
```sql
SELECT 
    e.numero_guia,
    c.nombre as cliente,
    r.nombre as ruta,
    e.estado,
    e.fecha_creacion,
    e.costo_envio
FROM logistics_envio e
LEFT JOIN logistics_cliente c ON e.cliente_id = c.id
LEFT JOIN logistics_ruta r ON e.ruta_id = r.id
ORDER BY e.fecha_creacion DESC;
```

### Ver seguimiento de envíos:
```sql
SELECT 
    e.numero_guia,
    s.estado,
    s.descripcion,
    s.ubicacion,
    s.fecha_hora
FROM logistics_seguimientoenvio s
LEFT JOIN logistics_envio e ON s.envio_id = e.id
ORDER BY s.fecha_hora DESC;
```

## ⚠️ **Importante**
- **NO editar datos directamente** en producción
- **Hacer backup** antes de modificaciones importantes  
- **Usar las APIs REST** para operaciones CRUD seguras

## 🔄 Restaurar Base de Datos
Si necesitas resetear la base de datos:

```bash
# Desde la carpeta backend
cd /c/Users/Aprendiz/tecnoroute/backend

# Eliminar base de datos actual
rm tecnoroute.sqlite3

# Recrear migraciones
python manage.py migrate

# Crear nuevo superusuario
python manage.py createsuperuser
```

## 📱 URLs de la API
Una vez conectado a la BD, estas son las URLs disponibles:

- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Login**: http://localhost:8000/api/auth/login/
- **Register**: http://localhost:8000/api/auth/register/
- **Profile**: http://localhost:8000/api/auth/profile/

---
**TecnoRoute Database** - SQLite configurado y listo para desarrollo! 🚀