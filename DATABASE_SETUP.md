# Configuración de Base de Datos - TecnoRoute

## Instrucciones para configurar MySQL con XAMPP

### 1. Instalar y Configurar XAMPP

1. **Descargar XAMPP** desde https://www.apachefriends.org/
2. **Instalar XAMPP** siguiendo el asistente de instalación
3. **Abrir XAMPP Control Panel**

### 2. Iniciar Servicios

1. En XAMPP Control Panel, hacer clic en **"Start"** para:
   - **Apache** (servidor web)
   - **MySQL** (base de datos)

### 3. Crear Base de Datos

#### Opción 1: Usando phpMyAdmin (Interfaz Web)

1. Abrir navegador web y ir a: `http://localhost/phpmyadmin`
2. Hacer clic en **"Nueva"** en el panel izquierdo
3. Escribir el nombre de la base de datos: `tecnoroute_db`
4. Seleccionar cotejamiento: `utf8mb4_unicode_ci`
5. Hacer clic en **"Crear"**

#### Opción 2: Usando línea de comandos MySQL

1. Abrir terminal/cmd
2. Navegar a la carpeta MySQL de XAMPP:
   ```bash
   cd C:\xampp\mysql\bin
   ```
3. Conectar a MySQL:
   ```bash
   mysql -u root -p
   ```
   (Presionar Enter si no hay contraseña configurada)
4. Crear la base de datos:
   ```sql
   CREATE DATABASE tecnoroute_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES;
   EXIT;
   ```

### 4. Configurar Django

1. **Verificar archivo .env** en `backend/.env`:
   ```env
   DB_NAME=tecnoroute_db
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_PORT=3306
   ```

2. **Ejecutar migraciones** desde la carpeta `backend`:
   ```bash
   # Activar entorno virtual
   source ../backend_env/Scripts/activate
   
   # Crear migraciones
   python manage.py makemigrations
   
   # Aplicar migraciones
   python manage.py migrate
   ```

### 5. Verificar Conexión

1. **Crear superusuario** (opcional):
   ```bash
   python manage.py createsuperuser
   ```

2. **Ejecutar servidor Django**:
   ```bash
   python manage.py runserver
   ```

3. **Verificar en navegador**:
   - API: `http://localhost:8000/api/`
   - Admin: `http://localhost:8000/admin/`

### 6. Datos de Prueba (Opcional)

Para crear datos de prueba, puedes usar el shell de Django:

```bash
python manage.py shell
```

Luego ejecutar:

```python
from logistics.models import Cliente, Conductor, Vehiculo, Ruta

# Crear cliente de prueba
cliente = Cliente.objects.create(
    nombre="Empresa ABC",
    email="contacto@empresaabc.com",
    telefono="+34 912 345 678",
    direccion="Calle Principal 123",
    ciudad="Madrid",
    codigo_postal="28001"
)

# Crear conductor de prueba
conductor = Conductor.objects.create(
    nombre="Juan Pérez",
    cedula="12345678A",
    licencia="B123456789",
    telefono="+34 666 123 456",
    email="juan@tecnoroute.com",
    direccion="Av. Secundaria 456",
    fecha_contratacion="2024-01-15"
)

# Crear vehículo de prueba
vehiculo = Vehiculo.objects.create(
    placa="ABC-1234",
    marca="Mercedes-Benz",
    modelo="Sprinter",
    año=2022,
    tipo="furgoneta",
    capacidad_peso=3500.00,
    capacidad_volumen=15.50
)

# Crear ruta de prueba
ruta = Ruta.objects.create(
    nombre="Madrid - Barcelona",
    origen="Madrid",
    destino="Barcelona",
    distancia_km=620.50,
    tiempo_estimado_horas=6.5,
    costo_combustible=85.00,
    peajes=45.50
)

print("Datos de prueba creados exitosamente!")
```

### 7. Solución de Problemas

#### Error: "No module named 'MySQLdb'"
```bash
pip install mysqlclient
```

#### Error: "Access denied for user 'root'"
1. Verificar que MySQL esté ejecutándose en XAMPP
2. Comprobar credenciales en archivo `.env`
3. Resetear contraseña de MySQL si es necesario

#### Error: "Can't connect to MySQL server"
1. Verificar que MySQL esté iniciado en XAMPP
2. Comprobar puerto (por defecto 3306)
3. Verificar firewall/antivirus

#### Error de migraciones
```bash
# Resetear migraciones (¡CUIDADO: borra datos!)
python manage.py migrate logistics zero
python manage.py migrate
```

### 8. Backup y Restauración

#### Crear Backup
```bash
cd C:\xampp\mysql\bin
mysqldump -u root -p tecnoroute_db > tecnoroute_backup.sql
```

#### Restaurar Backup
```bash
mysql -u root -p tecnoroute_db < tecnoroute_backup.sql
```

### 9. Configuración de Producción

Para producción, considera:
- Cambiar credenciales por defecto
- Configurar contraseñas seguras
- Usar variables de entorno
- Configurar SSL/TLS
- Hacer backups regulares

---

¡Tu base de datos está lista para TecnoRoute! 🚛
