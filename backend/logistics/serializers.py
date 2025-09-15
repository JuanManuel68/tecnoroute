from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio, PedidoTransporte
from user_management.models import UserProfile, Categoria, Producto, Carrito, CarritoItem, Pedido, PedidoItem


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


# Nuevos serializers para autenticación y productos
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    telefono = serializers.CharField(required=False, allow_blank=True)
    direccion = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'telefono', 'direccion']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        telefono = validated_data.pop('telefono', '')
        direccion = validated_data.pop('direccion', '')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        
        UserProfile.objects.create(
            user=user,
            role='customer',
            telefono=telefono,
            direccion=direccion
        )
        
        return user

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'

class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = CarritoItem
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'subtotal', 'fecha_agregado']

class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = Carrito
        fields = ['id', 'items', 'total', 'fecha_creacion', 'fecha_actualizacion']

class PedidoItemSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = PedidoItem
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    items = PedidoItemSerializer(many=True, read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'


class PedidoTransporteSerializer(serializers.ModelSerializer):
    """Serializer para pedidos de transporte"""
    cliente_info = serializers.SerializerMethodField()
    conductor_info = serializers.SerializerMethodField() 
    ruta_info = serializers.SerializerMethodField()
    vehiculo_info = serializers.SerializerMethodField()
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    
    class Meta:
        model = PedidoTransporte
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion', 'numero_pedido')
    
    def get_cliente_info(self, obj):
        if obj.cliente:
            return {
                'id': obj.cliente.id,
                'nombre': obj.cliente.nombre,
                'email': obj.cliente.email,
                'telefono': obj.cliente.telefono
            }
        return None
    
    def get_conductor_info(self, obj):
        if obj.conductor:
            return {
                'id': obj.conductor.id,
                'nombre': obj.conductor.nombre,
                'cedula': obj.conductor.cedula,
                'telefono': obj.conductor.telefono
            }
        return None
    
    def get_ruta_info(self, obj):
        if obj.ruta:
            return {
                'id': obj.ruta.id,
                'nombre': obj.ruta.nombre,
                'origen': obj.ruta.origen,
                'destino': obj.ruta.destino
            }
        return None
    
    def get_vehiculo_info(self, obj):
        if obj.vehiculo:
            return {
                'id': obj.vehiculo.id,
                'placa': obj.vehiculo.placa,
                'marca': obj.vehiculo.marca,
                'modelo': obj.vehiculo.modelo
            }
        return None


class PedidoTransporteCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear pedidos de transporte"""
    class Meta:
        model = PedidoTransporte
        fields = [
            'cliente', 'descripcion', 'direccion_recogida', 'direccion_entrega',
            'peso_estimado', 'valor_declarado', 'fecha_recogida_deseada',
            'observaciones'
        ]
    
    def create(self, validated_data):
        import uuid
        validated_data['usuario'] = self.context['request'].user
        validated_data['numero_pedido'] = f'PED-{uuid.uuid4().hex[:8].upper()}'
        return super().create(validated_data)
