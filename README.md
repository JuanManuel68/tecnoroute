# TecnoRoute - Sistema de Gestión de Transporte y Logística

<<<<<<< HEAD
Sistema web completo para la gestión de transporte y logística desarrollado con **Django REST Framework** (backend) y **React + Material-UI** (frontend).
=======
## 🚛 Descripción General
>>>>>>> 99601d35a5a92bce74fa1a89d72b601021916213

TecnoRoute es un sistema integral de gestión de transporte y logística que permite administrar de manera eficiente operaciones de envío y distribución. El sistema cuenta con autenticación por roles (Administrador, Cliente, Conductor) y utiliza tecnologías modernas para ofrecer una experiencia robusta y escalable.

<<<<<<< HEAD
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
=======
## 🏗️ Arquitectura del Sistema

### **Backend**
- **Framework**: Django 5.2.6 + Django REST Framework
- **Base de Datos**: MongoDB con MongoEngine
- **Autenticación**: Sistema de tokens con roles diferenciados
- **API**: RESTful endpoints para todas las operaciones

### **Frontend** 
- **Framework**: React 18
- **UI Library**: Material-UI (MUI) con tema gris personalizado
- **Enrutamiento**: React Router DOM
- **Estado**: Context API para autenticación
- **Build Tool**: Create React App

## 👥 Roles de Usuario

### 🔐 **Administrador**
- Gestión completa del sistema
- Administrar usuarios, vehículos y rutas
- Reportes y estadísticas
- Configuración del sistema

### 🏢 **Cliente**
- Solicitar servicios de transporte
- Seguimiento de envíos
- Gestión de perfil personal
- Historial de servicios

### 🚛 **Conductor**
- Recibir y gestionar asignaciones
- Actualizar estado de envíos
- Gestión de disponibilidad
- Información de licencias y vehículos

## 📁 Estructura del Proyecto

```
tecnoroute/
├── backend/                    # Servidor Django
│   ├── backend/               # Configuración principal
│   │   ├── settings.py        # Configuraciones
│   │   └── urls.py           # URLs principales
│   ├── logistics/            # App principal
│   │   ├── mongo_models.py   # Modelos MongoDB
│   │   ├── mongo_auth_views.py # Vistas de autenticación
│   │   └── mongo_auth_urls.py # URLs de autenticación
│   └── manage.py             # Script de Django
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Context API
│   │   └── App.js           # Componente principal
│   └── package.json         # Dependencias Node.js
├── requirements.txt         # Dependencias Python
└── README.md               # Este archivo
```

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Python 3.8+
- Node.js 16+
- MongoDB Community Edition
- Git

### **1. Clonar Repositorio**
```bash
git clone <url-repositorio>
cd tecnoroute
```

### **2. Configurar Backend**
```bash
# Instalar dependencias Python
pip install -r requirements.txt

# Navegar al directorio backend
cd backend

# Ejecutar migraciones Django
python manage.py migrate

# Crear usuarios de prueba (opcional)
python create_test_users.py
>>>>>>> 99601d35a5a92bce74fa1a89d72b601021916213

# Iniciar servidor Django
python manage.py runserver
```

<<<<<<< HEAD
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
=======
### **3. Configurar Frontend**
```bash
# En nueva terminal, navegar al frontend
cd frontend

# Instalar dependencias Node.js
npm install

# Iniciar servidor de desarrollo
npm start
```

## 🔧 Configuración de Base de Datos

El sistema utiliza **MongoDB** como base de datos principal. Consultar el archivo `.env` para configuración específica.

### **Colecciones Principales:**
- `usuarios` - Información base de todos los usuarios
- `administradores` - Datos específicos de administradores
- `clientes` - Información de clientes
- `conductores` - Datos de conductores con licencias
- `vehiculos` - Flota de vehículos
- `rutas` - Rutas de transporte
- `envios` - Gestión de envíos
- `seguimientos_envio` - Tracking de envíos

## 🌐 Endpoints de API

### **Autenticación**
- `POST /api/auth/registro/` - Registro de usuarios
- `POST /api/auth/login/` - Inicio de sesión
- `POST /api/auth/logout/` - Cerrar sesión
- `GET /api/auth/perfil/` - Obtener perfil de usuario

### **Gestión (MongoDB)**
- `GET|POST /api/clientes/` - Gestión de clientes
- `GET|POST /api/conductores/` - Gestión de conductores
- `GET|POST /api/vehiculos/` - Gestión de vehículos
- `GET|POST /api/rutas/` - Gestión de rutas
- `GET|POST /api/envios/` - Gestión de envíos

## 🎨 Personalización Visual

El sistema utiliza un **tema gris personalizado** en lugar de los colores azules tradicionales de Material-UI:

- **Color Principal**: `#616161` (Gris medio)
- **Color Oscuro**: `#424242` (Gris oscuro)
- **Color Claro**: `#9e9e9e` (Gris claro)
- **Color Secundario**: `#757575` (Gris secundario)

## 🧪 Usuarios de Prueba

### **Administrador**
- **Email**: admin@tecnoroute.com
- **Contraseña**: admin123

### **Cliente**
- **Email**: cliente@tecnoroute.com
- **Contraseña**: cliente123

### **Conductor**
- **Email**: conductor@tecnoroute.com
- **Contraseña**: conductor123

## 🔐 Seguridad

- Autenticación por tokens JWT
- Contraseñas hasheadas con Werkzeug
- Validación de roles para endpoints
- CORS configurado para desarrollo

## 🚧 Estado del Desarrollo

✅ **Completado:**
- Sistema de autenticación por roles
- Modelos de datos MongoDB
- API REST funcional
- Interfaz de usuario con React
- Formularios dinámicos por rol

🔄 **En desarrollo:**
- Dashboard administrativo completo
- Funcionalidades avanzadas de seguimiento
- Reportes y estadísticas
- Notificaciones en tiempo real
>>>>>>> 99601d35a5a92bce74fa1a89d72b601021916213

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión

<<<<<<< HEAD
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
=======
Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**TecnoRoute** - Sistema de Transporte y Logística  
Desarrollado con ❤️ usando Django, React y MongoDB
>>>>>>> 99601d35a5a92bce74fa1a89d72b601021916213
