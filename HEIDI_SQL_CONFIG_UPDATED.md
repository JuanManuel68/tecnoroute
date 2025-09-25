# 🗄️ Configuración para HeidiSQL - TecnoRoute
## ARCHIVO SQLite CREADO EXITOSAMENTE ✅

## 📍 Ubicación de la Base de Datos
```
Archivo SQLite: C:\Users\Aprendiz\projects\tecnoroute\backend\tecnoroute.sqlite3
```

## 🔧 Configuración en HeidiSQL

### Paso 1: Abrir Nueva Sesión
1. Abrir HeidiSQL
2. Hacer clic en "New" para nueva sesión
3. En "Network type" seleccionar: **SQLite**

### Paso 2: Configurar Conexión
- **Database file**: `C:\Users\Aprendiz\projects\tecnoroute\backend\tecnoroute.sqlite3`
- **Session name**: `TecnoRoute SQLite`
- Dejar los demás campos vacíos

### Paso 3: Conectar
1. Hacer clic en "Save"
2. Hacer clic en "Open"

## 📊 Tablas Creadas en la Base de Datos

### 🔐 **Autenticación Django**
- `auth_user` - Usuarios del sistema Django
- `authtoken_token` - Tokens de autenticación JWT
- `user_management_userprofile` - Perfiles de usuario con datos adicionales

### 🚛 **Módulo de Logística**
- `logistics_cliente` - Datos de clientes empresariales
- `logistics_conductor` - Conductores registrados con licencias
- `logistics_vehiculo` - Flota de vehículos con capacidades
- `logistics_ruta` - Rutas de transporte configuradas
- `logistics_envio` - Envíos principales con tracking
- `logistics_seguimientoenvio` - Seguimiento detallado de envíos
- `logistics_pedidotransporte` - Pedidos de transporte

### 🛒 **E-commerce (Opcional)**
- `user_management_categoria` - Categorías de productos
- `user_management_producto` - Catálogo de productos
- `user_management_carrito` - Carritos de compras
- `user_management_pedido` - Pedidos de productos

## 🎯 Datos de Prueba Creados

### 👥 **Usuarios de Prueba Disponibles:**
- **Admin**: admin@tecnoroute.com / admin123
- **Cliente 1**: cliente1@tecnoroute.com / cliente123
- **Cliente 2**: cliente2@tecnoroute.com / cliente123
- **Conductor**: conductor1@tecnoroute.com / conductor123

### 📊 **Datos Insertados:**
- ✅ 3 Usuarios registrados
- ✅ 3 Clientes empresariales
- ✅ 2 Conductores activos
- ✅ 3 Vehículos en la flota
- ✅ 3 Rutas configuradas
- ✅ 2 Envíos de ejemplo

## 🔍 Consultas SQL Útiles

### Ver todos los usuarios con roles:
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

### Ver clientes de logística:
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
    e.costo_envio,
    e.descripcion
FROM logistics_envio e
LEFT JOIN logistics_cliente c ON e.cliente_id = c.id
LEFT JOIN logistics_ruta r ON e.ruta_id = r.id
ORDER BY e.fecha_creacion DESC;
```

### Ver vehículos disponibles:
```sql
SELECT 
    placa,
    marca,
    modelo,
    capacidad_peso,
    capacidad_volumen,
    estado,
    fecha_mantenimiento
FROM logistics_vehiculo
ORDER BY placa;
```

### Ver conductores y sus estados:
```sql
SELECT 
    nombre,
    apellido,
    cedula,
    telefono,
    licencia_numero,
    licencia_vencimiento,
    estado,
    fecha_registro
FROM logistics_conductor
ORDER BY fecha_registro DESC;
```

## 🌐 URLs del Sistema Funcionando

- **Frontend React**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **API Login**: http://localhost:8000/api/auth/login/
- **API Register**: http://localhost:8000/api/auth/register/

## 📱 Endpoints de API Disponibles

### **Autenticación**
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registro de usuarios
- `GET /api/auth/profile/` - Perfil de usuario

### **Gestión de Logística**
- `GET|POST /api/clientes/` - Gestión de clientes
- `GET|POST /api/conductores/` - Gestión de conductores
- `GET|POST /api/vehiculos/` - Gestión de vehículos
- `GET|POST /api/rutas/` - Gestión de rutas
- `GET|POST /api/envios/` - Gestión de envíos

## ⚠️ **Importante**
- **NO editar datos directamente** en producción
- **Hacer backup** antes de modificaciones importantes  
- **Usar las APIs REST** para operaciones CRUD seguras

## 🎉 **Estado Actual**
✅ Base de datos SQLite creada y configurada
✅ Migraciones aplicadas correctamente
✅ Datos de prueba insertados
✅ Listo para conectar con HeidiSQL
✅ APIs REST funcionando
✅ Frontend React preparado

---
**TecnoRoute Database** - SQLite configurado y listo para desarrollo! 🚀
**Ubicación**: `C:\Users\Aprendiz\projects\tecnoroute\backend\tecnoroute.sqlite3`