# Configuración HeidiSQL para TecnoRoute - SQLite

## 📍 Ubicación de la Base de Datos

La base de datos SQLite se encuentra en:
```
C:\Users\Aprendiz\tecnoroute\backend\tecnoroute.sqlite3
```

## 🔗 Configuración en HeidiSQL

### Para conectar con HeidiSQL a la base de datos SQLite:

1. **Abrir HeidiSQL**

2. **Crear Nueva Conexión:**
   - Click en "Nueva"
   - Tipo de Red: **SQLite**
   - Nombre de sesión: `TecnoRoute SQLite`

3. **Configuración:**
   - **Archivo de base de datos**: `C:\Users\Aprendiz\tecnoroute\backend\tecnoroute.sqlite3`
   - **Biblioteca**: Dejar por defecto
   - **Contraseña**: (dejar vacía)

4. **Conectar:**
   - Click en "Abrir"

## 📊 Tablas Principales Creadas

Las siguientes tablas estarán disponibles en la base de datos:

### **Autenticación Django**
- `auth_user` - Usuarios del sistema
- `auth_group` - Grupos de usuarios
- `auth_permission` - Permisos
- `authtoken_token` - Tokens de autenticación

### **Logistics App**
- `logistics_cliente` - Información de clientes
- `logistics_conductor` - Datos de conductores
- `logistics_vehiculo` - Vehículos de la flota
- `logistics_ruta` - Rutas de transporte
- `logistics_envio` - Envíos y paquetes
- `logistics_seguimientoenvio` - Seguimiento de envíos

### **User Management**
- `user_management_pedido` - Pedidos de clientes

## 👥 Datos de Prueba Disponibles

### **Usuarios creados:**
- **Admin**: admin@tecnoroute.com / admin123
- **Cliente 1**: cliente1@tecnoroute.com / cliente123
- **Cliente 2**: cliente2@tecnoroute.com / cliente123
- **Conductor**: conductor1@tecnoroute.com / conductor123

### **Datos de ejemplo:**
- 3 Clientes de logística
- 2 Conductores
- 3 Vehículos
- 3 Rutas
- 2 Envíos con seguimiento

## 🔍 Consultas Útiles

### Ver todos los usuarios:
```sql
SELECT id, username, email, first_name, last_name, is_staff, is_active, date_joined 
FROM auth_user;
```

### Ver clientes:
```sql
SELECT * FROM logistics_cliente;
```

### Ver envíos con información del cliente:
```sql
SELECT e.numero_guia, e.descripcion_carga, e.peso_kg, e.estado_envio,
       c.nombre_empresa, c.contacto_nombre
FROM logistics_envio e
JOIN logistics_cliente c ON e.cliente_id = c.id;
```

### Ver conductores con vehículos:
```sql
SELECT co.nombre, co.apellido, co.licencia_numero, co.estado,
       v.placa, v.marca, v.modelo
FROM logistics_conductor co
LEFT JOIN logistics_vehiculo v ON co.vehiculo_id = v.id;
```

## ⚠️ Notas Importantes

1. **Archivo de base de datos**: Se regenera automáticamente al ejecutar migraciones
2. **Respaldo**: Para hacer backup, simplemente copia el archivo `.sqlite3`
3. **Desarrollo**: La base de datos se actualiza automáticamente al ejecutar el servidor Django
4. **Ubicación**: El archivo siempre estará en el directorio `backend/`

## 🚀 URLs del Sistema

Una vez iniciados los servidores:

- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **Frontend React**: http://localhost:3000/

---

**Archivo creado automáticamente por TecnoRoute Setup**