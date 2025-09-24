from rest_framework import serializers
from .mongo_models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio, PedidoTransporte
from bson import ObjectId
import json
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
    dias_transito = serializers.ReadOnlyField()
    
    # Campos para mostrar información de las relaciones
    cliente_info = serializers.SerializerMethodField()
    ruta_info = serializers.SerializerMethodField()
    vehiculo_info = serializers.SerializerMethodField()
    conductor_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Envio
        fields = '__all__'
    
    def get_cliente_info(self, obj):
        if obj.cliente_id:
            try:
                cliente = Cliente.objects.get(id=obj.cliente_id)
                return {'id': str(cliente.id), 'nombre': cliente.nombre}
            except Cliente.DoesNotExist:
                return None
        return None
    
    def get_ruta_info(self, obj):
        if obj.ruta_id:
            try:
                ruta = Ruta.objects.get(id=obj.ruta_id)
                return {
                    'id': str(ruta.id), 
                    'nombre': ruta.nombre,
                    'origen': ruta.origen,
                    'destino': ruta.destino
                }
            except Ruta.DoesNotExist:
                return None
        return None
    
    def get_vehiculo_info(self, obj):
        if obj.vehiculo_id:
            try:
                vehiculo = Vehiculo.objects.get(id=obj.vehiculo_id)
                return {
                    'id': str(vehiculo.id), 
                    'placa': vehiculo.placa,
                    'marca': vehiculo.marca,
                    'modelo': vehiculo.modelo
                }
            except Vehiculo.DoesNotExist:
                return None
        return None
    
    def get_conductor_info(self, obj):
        if obj.conductor_id:
            try:
                conductor = Conductor.objects.get(id=obj.conductor_id)
                return {
                    'id': str(conductor.id), 
                    'nombre': conductor.nombre,
                    'cedula': conductor.cedula
                }
            except Conductor.DoesNotExist:
                return None
        return None


class SeguimientoEnvioSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = SeguimientoEnvio
        fields = '__all__'


class PedidoTransporteSerializer(mongo_serializers.DocumentSerializer):
    # Campos para mostrar información de las relaciones
    cliente_info = serializers.SerializerMethodField()
    conductor_info = serializers.SerializerMethodField()
    ruta_info = serializers.SerializerMethodField()
    vehiculo_info = serializers.SerializerMethodField()
    
    class Meta:
        model = PedidoTransporte
        fields = '__all__'
    
    def get_cliente_info(self, obj):
        if obj.cliente_id:
            try:
                cliente = Cliente.objects.get(id=obj.cliente_id)
                return {'id': str(cliente.id), 'nombre': cliente.nombre}
            except Cliente.DoesNotExist:
                return None
        return None
    
    def get_conductor_info(self, obj):
        if obj.conductor_id:
            try:
                conductor = Conductor.objects.get(id=obj.conductor_id)
                return {
                    'id': str(conductor.id), 
                    'nombre': conductor.nombre,
                    'cedula': conductor.cedula
                }
            except Conductor.DoesNotExist:
                return None
        return None
    
    def get_ruta_info(self, obj):
        if obj.ruta_id:
            try:
                ruta = Ruta.objects.get(id=obj.ruta_id)
                return {
                    'id': str(ruta.id), 
                    'nombre': ruta.nombre,
                    'origen': ruta.origen,
                    'destino': ruta.destino
                }
            except Ruta.DoesNotExist:
                return None
        return None
    
    def get_vehiculo_info(self, obj):
        if obj.vehiculo_id:
            try:
                vehiculo = Vehiculo.objects.get(id=obj.vehiculo_id)
                return {
                    'id': str(vehiculo.id), 
                    'placa': vehiculo.placa,
                    'marca': vehiculo.marca,
                    'modelo': vehiculo.modelo
                }
            except Vehiculo.DoesNotExist:
                return None
        return None


# Serializers simplificados para selección en formularios
class ClienteSimpleSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'ciudad']


class ConductorSimpleSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = Conductor
        fields = ['id', 'nombre', 'cedula', 'estado']


class VehiculoSimpleSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = Vehiculo
        fields = ['id', 'placa', 'marca', 'modelo', 'tipo', 'estado']


class RutaSimpleSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = Ruta
        fields = ['id', 'nombre', 'origen', 'destino', 'distancia_km', 'estado']