from mongoengine import Document, EmbeddedDocument, fields
from datetime import datetime
from django.contrib.auth.models import User


class Cliente(Document):
    nombre = fields.StringField(max_length=200, required=True)
    email = fields.EmailField(unique=True, required=True)
    telefono = fields.StringField(max_length=20, required=True)
    direccion = fields.StringField(required=True)
    ciudad = fields.StringField(max_length=100, required=True)
    codigo_postal = fields.StringField(max_length=10, required=True)
    fecha_registro = fields.DateTimeField(default=datetime.utcnow)
    activo = fields.BooleanField(default=True)

    meta = {
        'collection': 'clientes',
        'ordering': ['-fecha_registro']
    }

    def __str__(self):
        return self.nombre


class Conductor(Document):
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('en_ruta', 'En Ruta'),
        ('descanso', 'En Descanso'),
        ('inactivo', 'Inactivo'),
    ]
    
    nombre = fields.StringField(max_length=200, required=True)
    cedula = fields.StringField(max_length=20, unique=True, required=True)
    licencia = fields.StringField(max_length=50, required=True)
    telefono = fields.StringField(max_length=20, required=True)
    email = fields.EmailField(unique=True, required=True)
    direccion = fields.StringField(required=True)
    fecha_contratacion = fields.DateTimeField(required=True)
    estado = fields.StringField(max_length=20, choices=[choice[0] for choice in ESTADO_CHOICES], default='disponible')
    activo = fields.BooleanField(default=True)

    meta = {
        'collection': 'conductores',
        'ordering': ['nombre']
    }

    def __str__(self):
        return f"{self.nombre} - {self.cedula}"


class Vehiculo(Document):
    TIPO_CHOICES = [
        ('camion', 'Camión'),
        ('furgoneta', 'Furgoneta'),
        ('trailer', 'Trailer'),
        ('motocicleta', 'Motocicleta'),
    ]
    
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('en_uso', 'En Uso'),
        ('mantenimiento', 'En Mantenimiento'),
        ('fuera_servicio', 'Fuera de Servicio'),
    ]
    
    placa = fields.StringField(max_length=20, unique=True, required=True)
    marca = fields.StringField(max_length=100, required=True)
    modelo = fields.StringField(max_length=100, required=True)
    año = fields.IntField(required=True)
    tipo = fields.StringField(max_length=20, choices=[choice[0] for choice in TIPO_CHOICES], required=True)
    capacidad_peso = fields.DecimalField(min_value=0, required=True)
    capacidad_volumen = fields.DecimalField(min_value=0, required=True)
    estado = fields.StringField(max_length=20, choices=[choice[0] for choice in ESTADO_CHOICES], default='disponible')
    kilometraje = fields.IntField(default=0)
    fecha_registro = fields.DateTimeField(default=datetime.utcnow)
    activo = fields.BooleanField(default=True)

    meta = {
        'collection': 'vehiculos',
        'ordering': ['placa']
    }

    def __str__(self):
        return f"{self.placa} - {self.marca} {self.modelo}"


class Ruta(Document):
    ESTADO_CHOICES = [
        ('planificada', 'Planificada'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    
    nombre = fields.StringField(max_length=200, required=True)
    origen = fields.StringField(max_length=200, required=True)
    destino = fields.StringField(max_length=200, required=True)
    distancia_km = fields.DecimalField(min_value=0, required=True)
    tiempo_estimado_horas = fields.DecimalField(min_value=0, required=True)
    costo_combustible = fields.DecimalField(min_value=0, required=True)
    peajes = fields.DecimalField(min_value=0, default=0)
    estado = fields.StringField(max_length=20, choices=[choice[0] for choice in ESTADO_CHOICES], default='planificada')
    fecha_creacion = fields.DateTimeField(default=datetime.utcnow)
    activa = fields.BooleanField(default=True)

    meta = {
        'collection': 'rutas',
        'ordering': ['-fecha_creacion']
    }

    def __str__(self):
        return f"{self.nombre} ({self.origen} → {self.destino})"

    @property
    def costo_total(self):
        return float(self.costo_combustible) + float(self.peajes)


class Envio(Document):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_transito', 'En Tránsito'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
        ('devuelto', 'Devuelto'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    numero_guia = fields.StringField(max_length=50, unique=True, required=True)
    cliente_id = fields.ObjectIdField(required=True)  # Referencia a Cliente
    ruta_id = fields.ObjectIdField(required=True)     # Referencia a Ruta
    vehiculo_id = fields.ObjectIdField()              # Referencia a Vehiculo
    conductor_id = fields.ObjectIdField()             # Referencia a Conductor
    
    descripcion_carga = fields.StringField(required=True)
    peso_kg = fields.DecimalField(min_value=0, required=True)
    volumen_m3 = fields.DecimalField(min_value=0, required=True)
    
    direccion_recogida = fields.StringField(required=True)
    direccion_entrega = fields.StringField(required=True)
    contacto_recogida = fields.StringField(max_length=200, required=True)
    contacto_entrega = fields.StringField(max_length=200, required=True)
    telefono_recogida = fields.StringField(max_length=20, required=True)
    telefono_entrega = fields.StringField(max_length=20, required=True)
    
    fecha_recogida_programada = fields.DateTimeField(required=True)
    fecha_entrega_programada = fields.DateTimeField(required=True)
    fecha_recogida_real = fields.DateTimeField()
    fecha_entrega_real = fields.DateTimeField()
    
    costo_envio = fields.DecimalField(min_value=0, required=True)
    valor_declarado = fields.DecimalField(min_value=0, required=True)
    
    estado = fields.StringField(max_length=20, choices=[choice[0] for choice in ESTADO_CHOICES], default='pendiente')
    prioridad = fields.StringField(max_length=20, choices=[choice[0] for choice in PRIORIDAD_CHOICES], default='media')
    
    observaciones = fields.StringField()
    
    fecha_creacion = fields.DateTimeField(default=datetime.utcnow)
    fecha_actualizacion = fields.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'envios',
        'ordering': ['-fecha_creacion']
    }

    def __str__(self):
        return f"Envío {self.numero_guia}"

    def save(self, *args, **kwargs):
        self.fecha_actualizacion = datetime.utcnow()
        return super().save(*args, **kwargs)

    @property
    def dias_transito(self):
        if self.fecha_recogida_real and self.fecha_entrega_real:
            return (self.fecha_entrega_real - self.fecha_recogida_real).days
        return None


class SeguimientoEnvio(Document):
    envio_id = fields.ObjectIdField(required=True)  # Referencia a Envio
    estado = fields.StringField(max_length=100, required=True)
    descripcion = fields.StringField(required=True)
    ubicacion = fields.StringField(max_length=200)
    fecha_hora = fields.DateTimeField(default=datetime.utcnow)
    usuario_id = fields.IntField()  # ID del usuario Django

    meta = {
        'collection': 'seguimientos_envio',
        'ordering': ['-fecha_hora']
    }

    def __str__(self):
        return f"Seguimiento {self.envio_id} - {self.estado}"


class PedidoTransporte(Document):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('asignado', 'Asignado'),
        ('en_ruta', 'En Ruta'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    
    usuario_id = fields.IntField(required=True)  # ID del usuario Django
    cliente_id = fields.ObjectIdField(required=True)  # Referencia a Cliente
    conductor_id = fields.ObjectIdField()  # Referencia a Conductor
    ruta_id = fields.ObjectIdField()       # Referencia a Ruta
    vehiculo_id = fields.ObjectIdField()   # Referencia a Vehiculo
    
    numero_pedido = fields.StringField(max_length=50, unique=True, required=True)
    descripcion = fields.StringField(required=True)
    direccion_recogida = fields.StringField(required=True)
    direccion_entrega = fields.StringField(required=True)
    
    peso_estimado = fields.DecimalField(min_value=0)
    valor_declarado = fields.DecimalField(min_value=0)
    precio_estimado = fields.DecimalField(min_value=0)
    
    fecha_recogida_deseada = fields.DateTimeField(required=True)
    fecha_entrega_estimada = fields.DateTimeField()
    
    estado = fields.StringField(max_length=20, choices=[choice[0] for choice in ESTADO_CHOICES], default='pendiente')
    observaciones = fields.StringField()
    
    fecha_creacion = fields.DateTimeField(default=datetime.utcnow)
    fecha_actualizacion = fields.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'pedidos_transporte',
        'ordering': ['-fecha_creacion']
    }
    
    def __str__(self):
        return f"Pedido {self.numero_pedido}"

    def save(self, *args, **kwargs):
        self.fecha_actualizacion = datetime.utcnow()
        return super().save(*args, **kwargs)