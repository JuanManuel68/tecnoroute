# TecnoRoute - Sistema de Transporte y Logística

Sistema web completo para la gestión de transporte y logística desarrollado con **Django REST Framework** (backend) y **React + Material-UI** (frontend).

## 🚛 Características Principales

- **Gestión de Clientes**: Registro y administración completa
- **Gestión de Conductores**: Control con estados dinámicos y licencias
- **Gestión de Vehículos**: Administración de flota con capacidades
- **Gestión de Rutas**: Planificación con costos y tiempos
- **Gestión de Envíos**: Control completo con seguimiento
- **Sistema de Seguimiento**: Rastreo en tiempo real
- **Panel de Control**: Dashboard con estadísticas
- **Autenticación por Roles**: Admin, Cliente, Conductor

## 🛠️ Tecnologías

### Backend
- Python 3.x + Django 5.x
- Django REST Framework
- MySQL (XAMPP)
- Autenticación JWT

### Frontend
- React 18 + Material-UI
- React Router DOM
- Axios para API
- Responsive Design

## 🚀 Instalación Rápida

### 1. Configurar Backend

```bash
# Activar entorno virtual
source backend_env/Scripts/activate

# Instalar dependencias
pip install -r backend/requirements.txt

# Configurar base de datos (MySQL/XAMPP)
cd backend
python manage.py migrate

# Ejecutar servidor
python manage.py runserver
```

### 2. Configurar Frontend

```bash
# Instalar dependencias
cd frontend
npm install

# Ejecutar servidor de desarrollo
npm start
```

## 🔗 URLs del Sistema

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 👥 Credenciales de Prueba

```
Admin: admin@tecnoroute.com / admin123
Usuario: usuario@tecnoroute.com / user123
```

## 📁 Estructura del Proyecto

```
tecnoroute/
├── backend/                 # Django API
│   ├── backend/            # Configuración
│   ├── logistics/          # App principal
│   ├── user_management/    # Gestión usuarios
│   └── requirements.txt    # Dependencias Python
├── frontend/               # React App
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes UI
│   │   ├── pages/         # Páginas principales
│   │   └── services/      # API services
│   └── package.json       # Dependencias Node
└── backend_env/           # Entorno virtual Python
```

## 🔌 API Endpoints Principales

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión

### Gestión Principal
- `GET/POST /api/clientes/` - Clientes
- `GET/POST /api/conductores/` - Conductores  
- `GET/POST /api/vehiculos/` - Vehículos
- `GET/POST /api/rutas/` - Rutas
- `GET/POST /api/envios/` - Envíos

### Funciones Especiales
- `GET /api/envios/pendientes/` - Envíos pendientes
- `POST /api/conductores/{id}/cambiar_estado/` - Cambiar estado
- `GET /api/envios/{id}/seguimiento/` - Seguimiento

## 🎯 Funcionalidades por Rol

### 👨‍💼 Administrador
- ✅ Gestión completa del sistema
- ✅ Dashboard con estadísticas
- ✅ Asignación de recursos
- ✅ Panel de administración Django

### 👤 Cliente
- ✅ Sus propios envíos
- ✅ Crear nuevos pedidos
- ✅ Seguimiento en tiempo real

### 🚛 Conductor  
- ✅ Envíos asignados
- ✅ Actualizar estados
- ✅ Información de rutas

## 🔧 Comandos Útiles

```bash
# Backend - Migraciones
python manage.py makemigrations
python manage.py migrate

# Frontend - Desarrollo
npm start              # Servidor desarrollo
npm run build          # Build producción

# Base de Datos
python manage.py createsuperuser    # Crear admin
python manage.py shell             # Shell Django
```

## 📊 Base de Datos

Configuración MySQL (XAMPP):
```env
DB_NAME=tecnoroute_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

## 🎉 Estado del Proyecto

✅ **Completado:**
- Backend Django con API REST completa
- Frontend React con Material-UI
- Autenticación por roles
- CRUD completo para todas las entidades
- Dashboard funcional
- Sistema de seguimiento

🔄 **En desarrollo:**
- Reportes avanzados
- Notificaciones push
- Integración con GPS

---

**TecnoRoute** - Sistema Profesional de Gestión Logística  
Desarrollado con Django REST Framework + React