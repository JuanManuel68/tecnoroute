# 🧪 Cómo Probar TecnoRoute

## 🚀 Guía Completa para Probar el Sistema

### **1. Ejecutar el Backend (Django)**

```bash
# Terminal 1 - Backend
cd C:\Users\juanc\tecnoroute\backend
source ../backend_env/Scripts/activate
python manage.py runserver
```

### **2. Ejecutar el Frontend (React)**

```bash
# Terminal 2 - Frontend  
cd C:\Users\juanc\tecnoroute\frontend
npm start
```

---

## 🔐 **Sistema de Autenticación**

### **Acceso al Sistema:**
1. Ve a: **http://localhost:3000**
2. Serás redirigido automáticamente a la página de login

### **Credenciales de Prueba:**
```
📧 Email: admin@tecnoroute.com
🔐 Contraseña: admin123

📧 Email: usuario@tecnoroute.com  
🔐 Contraseña: user123
```

**¡O cualquier email y contraseña que quieras!** (Es un sistema demo)

---

## 📊 **Datos de Prueba Incluidos**

El sistema incluye datos realistas para probar:

### **👥 Clientes (5)**
- Empresa ABC S.A. (Madrid)
- Logística del Norte SL (Oviedo)  
- Distribuciones Valencia (Valencia)
- Comercial Andaluza (Sevilla)
- Importex Cataluña (Barcelona)

### **🚗 Conductores (5)**
- Juan Pérez García (Disponible)
- María López Rodríguez (En Ruta)
- Carlos Martínez Sánchez (Disponible)
- Ana Fernández Torres (En Descanso)
- Roberto García Villa (Disponible)

### **🚛 Vehículos (5)**
- ABC-1234: Mercedes-Benz Sprinter
- DEF-5678: Iveco Daily  
- GHI-9012: Volvo FH16
- JKL-3456: MAN TGX (En mantenimiento)
- MNO-7890: Ford Transit

### **🛣️ Rutas (5)**
- Madrid - Barcelona Express (620 km)
- Valencia - Sevilla Sur (520 km)
- Bilbao - Madrid Norte (395 km)
- Barcelona - Valencia Costa (350 km)
- Sevilla - Granada Andalucía (250 km)

### **📦 Envíos (3)**
- TR001: Equipos electrónicos (Pendiente)
- TR002: Muebles de oficina (En tránsito)
- TR003: Material de construcción (Pendiente)

---

## 🧪 **Funcionalidades para Probar**

### **📊 Dashboard**
- ✅ Estadísticas en tiempo real
- ✅ Tarjetas informativas con totales
- ✅ Estado de envíos (pendientes, en tránsito, entregados)
- ✅ Lista de envíos recientes

### **👥 Gestión de Clientes**
- ✅ **Crear**: Botón "Nuevo Cliente"
- ✅ **Ver**: Tabla con todos los clientes
- ✅ **Buscar**: Por nombre, email o ciudad
- ✅ **Editar**: Clic en ícono de edición
- ✅ **Eliminar**: Con confirmación de seguridad

### **🚗 Gestión de Conductores**  
- ✅ **CRUD completo**: Crear, editar, eliminar
- ✅ **Estados dinámicos**: Cambiar entre Disponible/En Ruta/Descanso
- ✅ **Ícono especial**: Para cambio de estado
- ✅ **Validaciones**: Cédula, licencia, email

### **🚛 Gestión de Vehículos**
- ✅ **Tipos**: Camión, Furgoneta, Trailer, Motocicleta
- ✅ **Capacidades**: Peso y volumen
- ✅ **Estados**: Disponible/En Uso/Mantenimiento/Fuera de Servicio
- ✅ **Especificaciones**: Marca, modelo, año, kilometraje

### **🛣️ Gestión de Rutas**
- ✅ **Planificación completa**: Origen, destino, distancia
- ✅ **Cálculos automáticos**: Costo total = Combustible + Peajes
- ✅ **Información detallada**: Tiempo estimado, costos
- ✅ **Estados**: Planificada/En Progreso/Completada

---

## 🎮 **Casos de Prueba Recomendados**

### **1. Probar Autenticación** 
1. Intenta acceder sin login → Te redirige a /login
2. Haz login con cualquier credencial → Accedes al dashboard
3. Cierra sesión desde el menú de usuario → Vuelves al login

### **2. Probar CRUD de Clientes**
1. Ve a "Clientes"
2. Crea un nuevo cliente con todos los datos
3. Busca el cliente recién creado
4. Edita algún campo
5. Intenta eliminar (verás confirmación)

### **3. Probar Estados Dinámicos**
1. Ve a "Conductores"
2. Busca un conductor "Disponible"
3. Haz clic en el ícono de cambio de estado (↔️)
4. Cambia a "En Ruta"
5. Observa cómo cambia el chip de estado

### **4. Probar Vehículos con Capacidades**
1. Ve a "Vehículos"
2. Crea un vehículo con capacidades específicas
3. Verifica que se muestren correctamente en la tabla
4. Prueba cambiar el estado del vehículo

### **5. Probar Cálculos de Rutas**
1. Ve a "Rutas"
2. Crea una nueva ruta
3. Ingresa costos de combustible y peajes
4. Observa el cálculo automático del costo total
5. Verifica que se muestre correctamente en la tabla

---

## 🔧 **Herramientas Administrativas**

### **Django Admin** (Backend)
- **URL**: http://localhost:8000/admin/
- **Usuario**: admin
- **Contraseña**: admin123

### **API Directa** (Opcional)
- **Base URL**: http://localhost:8000/api/
- **Endpoints disponibles**:
  - `/api/clientes/`
  - `/api/conductores/` 
  - `/api/vehiculos/`
  - `/api/rutas/`
  - `/api/envios/`

---

## 🐛 **Solución de Problemas**

### **Error "ERR_CONNECTION_REFUSED"**
1. Verifica que ambos servidores estén corriendo
2. Backend en puerto 8000, Frontend en puerto 3000
3. Asegúrate de que XAMPP (MySQL) esté iniciado

### **Error de datos**
```bash
# Regenerar datos de prueba
cd backend
python create_test_data.py
```

### **Problemas de dependencias**
```bash
# Backend
pip install -r backend/requirements.txt

# Frontend  
cd frontend && npm install
```

---

## 🎯 **Funcionalidades Destacadas**

### **✨ Interfaz de Usuario**
- Material-UI profesional
- Responsive (mobile y desktop)
- Spinners de carga
- Mensajes de error informativos
- Confirmaciones de eliminación

### **🔄 Estados Dinámicos**
- Conductores: 4 estados diferentes
- Vehículos: 4 estados diferentes  
- Envíos: 5 estados diferentes
- Cambios en tiempo real

### **🔍 Búsquedas Inteligentes**
- Búsqueda por múltiples campos
- Filtros en tiempo real
- Sin recargas de página

### **📊 Dashboard Inteligente**
- Datos conectados a la API real
- Estadísticas actualizadas
- Indicadores visuales por estado

---

## 🎉 **¡Todo Listo!**

El sistema TecnoRoute está completamente funcional con:
- ✅ **Autenticación completa** (Login/Register/Logout)
- ✅ **CRUD completo** para todas las entidades
- ✅ **Datos de prueba realistas**
- ✅ **Estados dinámicos** para conductores y vehículos
- ✅ **Dashboard con estadísticas reales**
- ✅ **Interfaz profesional** y responsive

**¡Disfruta probando tu sistema de gestión logística!** 🚛✨
