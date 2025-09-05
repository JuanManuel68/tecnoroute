from rest_framework import serializers
from .models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ('fecha_registro',)


class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = '__all__'


class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'
        read_only_fields = ('fecha_registro',)


class RutaSerializer(serializers.ModelSerializer):
    costo_total = serializers.ReadOnlyField()
    
    class Meta:
        model = Ruta
        fields = '__all__'
        read_only_fields = ('fecha_creacion',)


class SeguimientoEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeguimientoEnvio
        fields = '__all__'
        read_only_fields = ('fecha_hora',)


class EnvioSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    ruta_nombre = serializers.CharField(source='ruta.nombre', read_only=True)
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    conductor_nombre = serializers.CharField(source='conductor.nombre', read_only=True)
    seguimientos = SeguimientoEnvioSerializer(many=True, read_only=True)
    dias_transito = serializers.ReadOnlyField()
    
    class Meta:
        model = Envio
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')


class EnvioCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para la creación de envíos sin campos relacionados expandidos"""
    class Meta:
        model = Envio
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')


class EnvioListSerializer(serializers.ModelSerializer):
    """Serializer para listar envíos con información básica"""
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    ruta_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Envio
        fields = [
            'id', 'numero_guia', 'cliente_nombre', 'ruta_info',
            'descripcion_carga', 'peso_kg', 'estado', 'prioridad',
            'fecha_recogida_programada', 'fecha_entrega_programada',
            'costo_envio', 'fecha_creacion'
        ]
    
    def get_ruta_info(self, obj):
        return f"{obj.ruta.origen} → {obj.ruta.destino}"
