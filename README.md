# TecnoRoute - Sistema de Transporte y Logística

TecnoRoute es un sistema web completo para la gestión de transporte y logística, desarrollado con React para el frontend y Django con Django REST Framework para el backend. El sistema permite gestionar clientes, conductores, vehículos, rutas y envíos con funcionalidades CRUD completas.

## 🚛 Características Principales

- **Gestión de Clientes**: Registro y administración de clientes con información completa
- **Gestión de Conductores**: Control de conductores con estados y licencias
- **Gestión de Vehículos**: Administración de flota con capacidades y estados
- **Gestión de Rutas**: Planificación de rutas con costos y tiempos
- **Gestión de Envíos**: Control completo de envíos con seguimiento
- **Sistema de Seguimiento**: Rastreo en tiempo real de los envíos
- **Panel de Control**: Dashboard con estadísticas y métricas importantes

## 🛠️ Tecnologías Utilizadas

### Backend
- Python 3.x
- Django 5.2.6
- Django REST Framework
- MySQL (compatible con XAMPP)
- django-cors-headers
- django-filter
- python-decouple

### Frontend
- React 18
- Material-UI (MUI)
- React Router DOM
- Axios
- JavaScript ES6+

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- Python 3.8 o superior
- Node.js 16.x o superior
- npm o yarn
- XAMPP (para MySQL)
- Git

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd tecnoroute
```

### 2. Configuración del Backend (Django)

#### 2.1 Crear y Activar Entorno Virtual

```bash
# Crear entorno virtual
python -m venv backend_env

# Activar entorno virtual (Windows)
source backend_env/Scripts/activate

# En macOS/Linux
source backend_env/bin/activate
```

#### 2.2 Instalar Dependencias

```bash
pip install -r backend/requirements.txt
```

#### 2.3 Configurar Base de Datos

1. **Iniciar XAMPP y MySQL**
   - Abre XAMPP Control Panel
   - Inicia Apache y MySQL

2. **Crear Base de Datos**
   ```sql
   CREATE DATABASE tecnoroute_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Configurar Variables de Entorno**
   
   Crea o edita el archivo `backend/.env`:
   ```env
   DB_NAME=tecnoroute_db
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_PORT=3306
   ```

#### 2.4 Ejecutar Migraciones

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

#### 2.5 Crear Usuario Administrador (Opcional)

```bash
python manage.py createsuperuser
```

#### 2.6 Ejecutar Servidor de Desarrollo

```bash
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### 3. Configuración del Frontend (React)

#### 3.1 Instalar Dependencias

```bash
cd frontend
npm install
```

#### 3.2 Configurar Variables de Entorno

Crea el archivo `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000
```

#### 3.3 Ejecutar Servidor de Desarrollo

```bash
npm start
```

El frontend estará disponible en: `http://localhost:3000`

## 🗂️ Estructura del Proyecto

```
tecnoroute/
├── backend/                 # Proyecto Django
│   ├── backend/            # Configuración principal
│   │   ├── settings.py     # Configuraciones
│   │   ├── urls.py         # URLs principales
│   │   └── ...
│   ├── logistics/          # Aplicación de logística
│   │   ├── models.py       # Modelos de datos
│   │   ├── views.py        # Vistas de API
│   │   ├── serializers.py  # Serializadores
│   │   ├── urls.py         # URLs de la app
│   │   └── ...
│   ├── requirements.txt    # Dependencias Python
│   └── manage.py          # Script de Django
├── frontend/              # Aplicación React
│   ├── public/           # Archivos públicos
│   ├── src/              # Código fuente
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── services/     # Servicios de API
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Punto de entrada
│   ├── package.json      # Dependencias Node.js
│   └── ...
├── backend_env/          # Entorno virtual Python
└── README.md            # Este archivo
```

## 🔌 Endpoints de API

### Clientes
- `GET /api/clientes/` - Listar todos los clientes
- `POST /api/clientes/` - Crear nuevo cliente
- `GET /api/clientes/{id}/` - Obtener cliente específico
- `PUT /api/clientes/{id}/` - Actualizar cliente
- `DELETE /api/clientes/{id}/` - Eliminar cliente
- `GET /api/clientes/activos/` - Listar clientes activos

### Conductores
- `GET /api/conductores/` - Listar todos los conductores
- `POST /api/conductores/` - Crear nuevo conductor
- `GET /api/conductores/{id}/` - Obtener conductor específico
- `PUT /api/conductores/{id}/` - Actualizar conductor
- `DELETE /api/conductores/{id}/` - Eliminar conductor
- `GET /api/conductores/disponibles/` - Listar conductores disponibles
- `POST /api/conductores/{id}/cambiar_estado/` - Cambiar estado del conductor

### Vehículos
- `GET /api/vehiculos/` - Listar todos los vehículos
- `POST /api/vehiculos/` - Crear nuevo vehículo
- `GET /api/vehiculos/{id}/` - Obtener vehículo específico
- `PUT /api/vehiculos/{id}/` - Actualizar vehículo
- `DELETE /api/vehiculos/{id}/` - Eliminar vehículo
- `GET /api/vehiculos/disponibles/` - Listar vehículos disponibles
- `POST /api/vehiculos/{id}/cambiar_estado/` - Cambiar estado del vehículo

### Rutas
- `GET /api/rutas/` - Listar todas las rutas
- `POST /api/rutas/` - Crear nueva ruta
- `GET /api/rutas/{id}/` - Obtener ruta específica
- `PUT /api/rutas/{id}/` - Actualizar ruta
- `DELETE /api/rutas/{id}/` - Eliminar ruta
- `GET /api/rutas/activas/` - Listar rutas activas

### Envíos
- `GET /api/envios/` - Listar todos los envíos
- `POST /api/envios/` - Crear nuevo envío
- `GET /api/envios/{id}/` - Obtener envío específico
- `PUT /api/envios/{id}/` - Actualizar envío
- `DELETE /api/envios/{id}/` - Eliminar envío
- `GET /api/envios/pendientes/` - Listar envíos pendientes
- `GET /api/envios/en_transito/` - Listar envíos en tránsito
- `GET /api/envios/buscar_por_guia/` - Buscar por número de guía
- `POST /api/envios/{id}/cambiar_estado/` - Cambiar estado del envío
- `POST /api/envios/{id}/asignar_vehiculo_conductor/` - Asignar recursos
- `GET /api/envios/{id}/seguimiento/` - Obtener seguimiento

### Seguimientos
- `GET /api/seguimientos/` - Listar todos los seguimientos
- `POST /api/seguimientos/` - Crear nuevo seguimiento

## 🎯 Funcionalidades por Implementar

### Funcionalidades CRUD Completas (Próximas actualizaciones)
- [ ] Formularios completos de creación y edición para todas las entidades
- [ ] Validación avanzada en frontend y backend
- [ ] Filtros y búsquedas avanzadas
- [ ] Paginación de resultados
- [ ] Exportación de datos (PDF, Excel)
- [ ] Sistema de notificaciones
- [ ] Autenticación y autorización
- [ ] Roles de usuario
- [ ] Reportes y estadísticas avanzadas

## 🔧 Comandos Útiles

### Backend (Django)
```bash
# Hacer migraciones
python manage.py makemigrations

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver

# Ejecutar shell de Django
python manage.py shell

# Recopilar archivos estáticos
python manage.py collectstatic
```

### Frontend (React)
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Analizar bundle
npm run build && npx serve -s build
```

## 🛡️ Configuración de Producción

### Backend
1. Configurar DEBUG=False en settings.py
2. Configurar ALLOWED_HOSTS
3. Configurar base de datos de producción
4. Usar variables de entorno para secretos
5. Configurar servidor web (Nginx + Gunicorn)

### Frontend
1. Configurar variables de entorno de producción
2. Optimizar build con `npm run build`
3. Servir archivos estáticos
4. Configurar CDN si es necesario

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte y consultas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 🎉 Estado del Proyecto

✅ Backend Django con API REST completa
✅ Frontend React con navegación y componentes base
✅ Modelos de datos completos
✅ Configuración de CORS
✅ Estructura de proyecto organizada

🔄 **En desarrollo:**
- Formularios CRUD completos en React
- Validaciones avanzadas
- Sistema de autenticación
- Funcionalidades de seguimiento en tiempo real

---

**TecnoRoute** - Sistema de Transporte y Logística
Desarrollado con ❤️ usando Django y React
