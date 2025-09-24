from rest_framework import serializers
from .mongo_models import Cliente, Conductor, Vehiculo, Ruta, Envio
from bson import ObjectId
from datetime import datetime


class ClienteSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    telefono = serializers.CharField(max_length=20)
    direccion = serializers.CharField()
    ciudad = serializers.CharField(max_length=100)
    codigo_postal = serializers.CharField(max_length=10)
    fecha_registro = serializers.DateTimeField(read_only=True)
    activo = serializers.BooleanField(default=True)
    
    def create(self, validated_data):
        return Cliente.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'nombre': instance.nombre,
            'email': instance.email,
            'telefono': instance.telefono,
            'direccion': instance.direccion,
            'ciudad': instance.ciudad,
            'codigo_postal': instance.codigo_postal,
            'fecha_registro': instance.fecha_registro.isoformat() if instance.fecha_registro else None,
            'activo': instance.activo,
        }


class ConductorSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField(max_length=200)
    cedula = serializers.CharField(max_length=20)
    licencia = serializers.CharField(max_length=50)
    telefono = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    direccion = serializers.CharField()
    fecha_contratacion = serializers.DateTimeField()
    estado = serializers.ChoiceField(choices=['disponible', 'en_ruta', 'descanso', 'inactivo'])
    activo = serializers.BooleanField(default=True)
    
    def create(self, validated_data):
        return Conductor.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'nombre': instance.nombre,
            'cedula': instance.cedula,
            'licencia': instance.licencia,
            'telefono': instance.telefono,
            'email': instance.email,
            'direccion': instance.direccion,
            'fecha_contratacion': instance.fecha_contratacion.isoformat() if instance.fecha_contratacion else None,
            'estado': instance.estado,
            'activo': instance.activo,
        }


class VehiculoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    placa = serializers.CharField(max_length=20)
    marca = serializers.CharField(max_length=100)
    modelo = serializers.CharField(max_length=100)
    año = serializers.IntegerField()
    tipo = serializers.ChoiceField(choices=['camion', 'furgoneta', 'trailer', 'motocicleta'])
    capacidad_peso = serializers.DecimalField(max_digits=8, decimal_places=2)
    capacidad_volumen = serializers.DecimalField(max_digits=8, decimal_places=2)
    estado = serializers.ChoiceField(choices=['disponible', 'en_uso', 'mantenimiento', 'fuera_servicio'])
    kilometraje = serializers.IntegerField(default=0)
    fecha_registro = serializers.DateTimeField(read_only=True)
    activo = serializers.BooleanField(default=True)
    
    def create(self, validated_data):
        return Vehiculo.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'placa': instance.placa,
            'marca': instance.marca,
            'modelo': instance.modelo,
            'año': instance.año,
            'tipo': instance.tipo,
            'capacidad_peso': float(instance.capacidad_peso),
            'capacidad_volumen': float(instance.capacidad_volumen),
            'estado': instance.estado,
            'kilometraje': instance.kilometraje,
            'fecha_registro': instance.fecha_registro.isoformat() if instance.fecha_registro else None,
            'activo': instance.activo,
        }


class RutaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField(max_length=200)
    origen = serializers.CharField(max_length=200)
    destino = serializers.CharField(max_length=200)
    distancia_km = serializers.DecimalField(max_digits=8, decimal_places=2)
    tiempo_estimado_horas = serializers.DecimalField(max_digits=6, decimal_places=2)
    costo_combustible = serializers.DecimalField(max_digits=10, decimal_places=2)
    peajes = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = serializers.ChoiceField(choices=['planificada', 'en_progreso', 'completada', 'cancelada'])
    fecha_creacion = serializers.DateTimeField(read_only=True)
    activa = serializers.BooleanField(default=True)
    costo_total = serializers.ReadOnlyField()
    
    def create(self, validated_data):
        return Ruta.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'nombre': instance.nombre,
            'origen': instance.origen,
            'destino': instance.destino,
            'distancia_km': float(instance.distancia_km),
            'tiempo_estimado_horas': float(instance.tiempo_estimado_horas),
            'costo_combustible': float(instance.costo_combustible),
            'peajes': float(instance.peajes),
            'estado': instance.estado,
            'fecha_creacion': instance.fecha_creacion.isoformat() if instance.fecha_creacion else None,
            'activa': instance.activa,
            'costo_total': instance.costo_total,
        }


class EnvioSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    numero_guia = serializers.CharField(max_length=50)
    cliente_id = serializers.CharField()
    ruta_id = serializers.CharField()
    vehiculo_id = serializers.CharField(required=False, allow_null=True)
    conductor_id = serializers.CharField(required=False, allow_null=True)
    descripcion_carga = serializers.CharField()
    peso_kg = serializers.DecimalField(max_digits=8, decimal_places=2)
    volumen_m3 = serializers.DecimalField(max_digits=8, decimal_places=2)
    direccion_recogida = serializers.CharField()
    direccion_entrega = serializers.CharField()
    contacto_recogida = serializers.CharField(max_length=200)
    contacto_entrega = serializers.CharField(max_length=200)
    telefono_recogida = serializers.CharField(max_length=20)
    telefono_entrega = serializers.CharField(max_length=20)
    fecha_recogida_programada = serializers.DateTimeField()
    fecha_entrega_programada = serializers.DateTimeField()
    fecha_recogida_real = serializers.DateTimeField(required=False, allow_null=True)
    fecha_entrega_real = serializers.DateTimeField(required=False, allow_null=True)
    costo_envio = serializers.DecimalField(max_digits=10, decimal_places=2)
    valor_declarado = serializers.DecimalField(max_digits=12, decimal_places=2)
    estado = serializers.ChoiceField(choices=['pendiente', 'en_transito', 'entregado', 'cancelado', 'devuelto'])
    prioridad = serializers.ChoiceField(choices=['baja', 'media', 'alta', 'urgente'])
    observaciones = serializers.CharField(required=False, allow_blank=True)
    fecha_creacion = serializers.DateTimeField(read_only=True)
    fecha_actualizacion = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        # Convertir string IDs a ObjectId
        if 'cliente_id' in validated_data:
            validated_data['cliente_id'] = ObjectId(validated_data['cliente_id'])
        if 'ruta_id' in validated_data:
            validated_data['ruta_id'] = ObjectId(validated_data['ruta_id'])
        if validated_data.get('vehiculo_id'):
            validated_data['vehiculo_id'] = ObjectId(validated_data['vehiculo_id'])
        if validated_data.get('conductor_id'):
            validated_data['conductor_id'] = ObjectId(validated_data['conductor_id'])
        
        return Envio.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Convertir string IDs a ObjectId si están presentes
        if 'cliente_id' in validated_data:
            validated_data['cliente_id'] = ObjectId(validated_data['cliente_id'])
        if 'ruta_id' in validated_data:
            validated_data['ruta_id'] = ObjectId(validated_data['ruta_id'])
        if validated_data.get('vehiculo_id'):
            validated_data['vehiculo_id'] = ObjectId(validated_data['vehiculo_id'])
        if validated_data.get('conductor_id'):
            validated_data['conductor_id'] = ObjectId(validated_data['conductor_id'])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        data = {
            'id': str(instance.id),
            'numero_guia': instance.numero_guia,
            'cliente_id': str(instance.cliente_id) if instance.cliente_id else None,
            'ruta_id': str(instance.ruta_id) if instance.ruta_id else None,
            'vehiculo_id': str(instance.vehiculo_id) if instance.vehiculo_id else None,
            'conductor_id': str(instance.conductor_id) if instance.conductor_id else None,
            'descripcion_carga': instance.descripcion_carga,
            'peso_kg': float(instance.peso_kg),
            'volumen_m3': float(instance.volumen_m3),
            'direccion_recogida': instance.direccion_recogida,
            'direccion_entrega': instance.direccion_entrega,
            'contacto_recogida': instance.contacto_recogida,
            'contacto_entrega': instance.contacto_entrega,
            'telefono_recogida': instance.telefono_recogida,
            'telefono_entrega': instance.telefono_entrega,
            'fecha_recogida_programada': instance.fecha_recogida_programada.isoformat() if instance.fecha_recogida_programada else None,
            'fecha_entrega_programada': instance.fecha_entrega_programada.isoformat() if instance.fecha_entrega_programada else None,
            'fecha_recogida_real': instance.fecha_recogida_real.isoformat() if instance.fecha_recogida_real else None,
            'fecha_entrega_real': instance.fecha_entrega_real.isoformat() if instance.fecha_entrega_real else None,
            'costo_envio': float(instance.costo_envio),
            'valor_declarado': float(instance.valor_declarado),
            'estado': instance.estado,
            'prioridad': instance.prioridad,
            'observaciones': instance.observaciones,
            'fecha_creacion': instance.fecha_creacion.isoformat() if instance.fecha_creacion else None,
            'fecha_actualizacion': instance.fecha_actualizacion.isoformat() if instance.fecha_actualizacion else None,
            'dias_transito': instance.dias_transito,
        }
        
        # Agregar información de relaciones si están disponibles
        try:
            if instance.cliente_id:
                cliente = Cliente.objects.get(id=instance.cliente_id)
                data['cliente_info'] = {'id': str(cliente.id), 'nombre': cliente.nombre}
        except:
            data['cliente_info'] = None
            
        try:
            if instance.ruta_id:
                ruta = Ruta.objects.get(id=instance.ruta_id)
                data['ruta_info'] = {
                    'id': str(ruta.id), 
                    'nombre': ruta.nombre,
                    'origen': ruta.origen,
                    'destino': ruta.destino
                }
        except:
            data['ruta_info'] = None
        
        return data