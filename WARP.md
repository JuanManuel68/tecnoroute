# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TecnoRoute is a comprehensive logistics and transportation management system built with Django REST Framework backend and React frontend. The system manages the complete logistics workflow from clients and fleet management to shipment tracking.

## Architecture

### Backend Architecture (Django)
- **Framework**: Django 5.2.6 with Django REST Framework
- **Database**: MySQL (via XAMPP for development)
- **Main App**: `logistics` - Contains all business logic
- **API Pattern**: RESTful API using ViewSets with custom actions

### Frontend Architecture (React)
- **Framework**: React 18 with Material-UI (MUI)
- **State Management**: Component state (no global state management)
- **API Integration**: Axios with centralized API service
- **Routing**: React Router DOM

### Domain Model
The system revolves around five core entities with relationships:

1. **Cliente** (Client) - Customer management
2. **Conductor** (Driver) - Driver management with states
3. **Vehiculo** (Vehicle) - Fleet management with capacity/status
4. **Ruta** (Route) - Route planning with cost calculations
5. **Envio** (Shipment) - Core business entity linking all others
6. **SeguimientoEnvio** (Shipment Tracking) - Audit trail for shipments

### Key Business Rules
- Drivers have states: disponible, en_ruta, descanso, inactivo
- Vehicles have states: disponible, en_uso, mantenimiento, fuera_servicio
- Shipments track the complete lifecycle: pendiente → en_transito → entregado
- Routes calculate total cost (fuel + tolls)
- Automatic timestamp tracking for shipment pickup/delivery

## Development Commands

### Backend Setup and Commands
```bash
# Environment setup
python -m venv backend_env
source backend_env/Scripts/activate  # Windows
source backend_env/bin/activate      # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Database operations
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Development server
python manage.py runserver

# Django utilities
python manage.py shell
python manage.py collectstatic
```

### Frontend Setup and Commands
```bash
# Setup
cd frontend
npm install

# Development
npm start          # Dev server at http://localhost:3000
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from create-react-app (irreversible)
```

### Database Commands (XAMPP/MySQL)
```bash
# Start XAMPP services (Windows)
# Open XAMPP Control Panel and start Apache + MySQL

# MySQL CLI access
cd C:\xampp\mysql\bin
mysql -u root -p

# Create database
CREATE DATABASE tecnoroute_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Backup/Restore
mysqldump -u root -p tecnoroute_db > backup.sql
mysql -u root -p tecnoroute_db < backup.sql
```

## API Architecture

### ViewSet Pattern
All APIs use Django REST Framework ViewSets with standard CRUD + custom actions:

```python
# Standard endpoints for each entity:
GET    /api/{entity}/           # List all
POST   /api/{entity}/           # Create new
GET    /api/{entity}/{id}/      # Get specific
PUT    /api/{entity}/{id}/      # Full update
PATCH  /api/{entity}/{id}/      # Partial update
DELETE /api/{entity}/{id}/      # Delete

# Custom actions (examples):
GET    /api/conductores/disponibles/           # Available drivers
POST   /api/conductores/{id}/cambiar_estado/   # Change driver state
GET    /api/envios/pendientes/                 # Pending shipments
POST   /api/envios/{id}/cambiar_estado/        # Update shipment status
```

### Frontend API Service Pattern
Centralized API service in `frontend/src/services/apiService.js`:
- Axios instance with interceptors
- Automatic token handling
- Error handling utilities
- Organized API functions by entity

## Key File Locations

### Backend Structure
```
backend/
├── backend/
│   ├── settings.py         # Django configuration
│   └── urls.py            # Main URL routing
├── logistics/
│   ├── models.py          # Core domain models
│   ├── views.py           # API ViewSets
│   ├── serializers.py     # DRF serializers
│   └── urls.py            # API endpoints
└── requirements.txt       # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── services/
│   │   └── apiService.js  # Centralized API calls
│   ├── pages/             # Main application pages
│   ├── components/        # Reusable UI components
│   └── App.js            # Main routing component
└── package.json          # Node.js dependencies
```

### Configuration Files
- `backend/.env` - Database and secret configurations
- `frontend/.env` - React app environment variables (REACT_APP_API_URL)

## Development Patterns

### Backend Patterns
- Use ViewSets for consistent API structure
- Custom actions for business logic (`@action` decorator)
- Related field optimization with `select_related()` for foreign keys
- Filter backends for search/filtering (DjangoFilterBackend, SearchFilter)
- State transitions create tracking records automatically

### Frontend Patterns
- Page-level components in `pages/` directory
- Reusable components in `components/` directory
- API calls through centralized service functions
- Material-UI components for consistent styling
- Error handling through API service utilities

### Database Patterns
- Consistent model naming with Spanish verbose names
- Automatic timestamping (`auto_now_add`, `auto_now`)
- Choice fields for constrained values (estados)
- Soft delete patterns with `activo` boolean fields
- Related name usage for reverse relationships

## Testing

### Backend Testing
```bash
cd backend
python manage.py test
python manage.py test logistics.tests.test_models
```

### Frontend Testing
```bash
cd frontend
npm test                    # Interactive test runner
npm test -- --coverage     # With coverage report
```

## Deployment Considerations

### Backend Production Setup
- Set DEBUG=False in settings
- Configure ALLOWED_HOSTS
- Use environment variables for secrets
- Set up proper database (not XAMPP)
- Configure static files serving
- Use Gunicorn + Nginx

### Frontend Production Setup
- Build with `npm run build`
- Serve static files through web server
- Configure production API URL
- Enable HTTPS

## Common Development Tasks

### Adding New Entity
1. Create model in `logistics/models.py`
2. Create serializer in `logistics/serializers.py`
3. Create ViewSet in `logistics/views.py`
4. Add to router in `logistics/urls.py`
5. Run migrations
6. Create frontend API functions in `apiService.js`
7. Create frontend page component

### State Changes
When adding new states to entities, update:
- Model CHOICES constants
- ViewSet custom actions
- Frontend state management
- API service functions

### Database Schema Changes
1. Modify models
2. `python manage.py makemigrations`
3. Review generated migration
4. `python manage.py migrate`
5. Update serializers if needed
6. Update frontend if API changes

## Environment Variables

### Backend (.env)
```
DB_NAME=tecnoroute_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```
