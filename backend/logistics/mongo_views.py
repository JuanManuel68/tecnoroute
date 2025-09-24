from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from bson import ObjectId
from bson.errors import InvalidId
import logging

from .mongo_models import Cliente, Conductor, Vehiculo, Ruta, Envio
from .new_serializers import ClienteSerializer, ConductorSerializer, VehiculoSerializer, RutaSerializer, EnvioSerializer

logger = logging.getLogger(__name__)


class ClienteListCreateView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get(self, request):
        try:
            clientes = Cliente.objects.all()
            serializer = ClienteSerializer(clientes, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al obtener clientes: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)
    
    def post(self, request):
        try:
            serializer = ClienteSerializer(data=request.data)
            if serializer.is_valid():
                cliente = serializer.save()
                return Response(ClienteSerializer(cliente).data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            logger.error(f"Error al crear cliente: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)


class ClienteDetailView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get_object(self, pk):
        try:
            return Cliente.objects.get(id=pk)
        except (Cliente.DoesNotExist, InvalidId):
            return None
    
    def get(self, request, pk):
        cliente = self.get_object(pk)
        if not cliente:
            return Response({'error': 'Cliente no encontrado'}, status=404)
        
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)
    
    def put(self, request, pk):
        cliente = self.get_object(pk)
        if not cliente:
            return Response({'error': 'Cliente no encontrado'}, status=404)
        
        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            cliente = serializer.save()
            return Response(ClienteSerializer(cliente).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        cliente = self.get_object(pk)
        if not cliente:
            return Response({'error': 'Cliente no encontrado'}, status=404)
        
        cliente.delete()
        return Response(status=204)


class ConductorListCreateView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get(self, request):
        try:
            conductores = Conductor.objects.all()
            serializer = ConductorSerializer(conductores, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al obtener conductores: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)
    
    def post(self, request):
        try:
            serializer = ConductorSerializer(data=request.data)
            if serializer.is_valid():
                conductor = serializer.save()
                return Response(ConductorSerializer(conductor).data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            logger.error(f"Error al crear conductor: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)


class ConductorDetailView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get_object(self, pk):
        try:
            return Conductor.objects.get(id=pk)
        except (Conductor.DoesNotExist, InvalidId):
            return None
    
    def get(self, request, pk):
        conductor = self.get_object(pk)
        if not conductor:
            return Response({'error': 'Conductor no encontrado'}, status=404)
        
        serializer = ConductorSerializer(conductor)
        return Response(serializer.data)
    
    def put(self, request, pk):
        conductor = self.get_object(pk)
        if not conductor:
            return Response({'error': 'Conductor no encontrado'}, status=404)
        
        serializer = ConductorSerializer(conductor, data=request.data)
        if serializer.is_valid():
            conductor = serializer.save()
            return Response(ConductorSerializer(conductor).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        conductor = self.get_object(pk)
        if not conductor:
            return Response({'error': 'Conductor no encontrado'}, status=404)
        
        conductor.delete()
        return Response(status=204)


class VehiculoListCreateView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get(self, request):
        try:
            vehiculos = Vehiculo.objects.all()
            serializer = VehiculoSerializer(vehiculos, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al obtener vehículos: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)
    
    def post(self, request):
        try:
            serializer = VehiculoSerializer(data=request.data)
            if serializer.is_valid():
                vehiculo = serializer.save()
                return Response(VehiculoSerializer(vehiculo).data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            logger.error(f"Error al crear vehículo: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)


class VehiculoDetailView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get_object(self, pk):
        try:
            return Vehiculo.objects.get(id=pk)
        except (Vehiculo.DoesNotExist, InvalidId):
            return None
    
    def get(self, request, pk):
        vehiculo = self.get_object(pk)
        if not vehiculo:
            return Response({'error': 'Vehículo no encontrado'}, status=404)
        
        serializer = VehiculoSerializer(vehiculo)
        return Response(serializer.data)
    
    def put(self, request, pk):
        vehiculo = self.get_object(pk)
        if not vehiculo:
            return Response({'error': 'Vehículo no encontrado'}, status=404)
        
        serializer = VehiculoSerializer(vehiculo, data=request.data)
        if serializer.is_valid():
            vehiculo = serializer.save()
            return Response(VehiculoSerializer(vehiculo).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        vehiculo = self.get_object(pk)
        if not vehiculo:
            return Response({'error': 'Vehículo no encontrado'}, status=404)
        
        vehiculo.delete()
        return Response(status=204)


class RutaListCreateView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get(self, request):
        try:
            rutas = Ruta.objects.all()
            serializer = RutaSerializer(rutas, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al obtener rutas: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)
    
    def post(self, request):
        try:
            serializer = RutaSerializer(data=request.data)
            if serializer.is_valid():
                ruta = serializer.save()
                return Response(RutaSerializer(ruta).data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            logger.error(f"Error al crear ruta: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)


class RutaDetailView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get_object(self, pk):
        try:
            return Ruta.objects.get(id=pk)
        except (Ruta.DoesNotExist, InvalidId):
            return None
    
    def get(self, request, pk):
        ruta = self.get_object(pk)
        if not ruta:
            return Response({'error': 'Ruta no encontrada'}, status=404)
        
        serializer = RutaSerializer(ruta)
        return Response(serializer.data)
    
    def put(self, request, pk):
        ruta = self.get_object(pk)
        if not ruta:
            return Response({'error': 'Ruta no encontrada'}, status=404)
        
        serializer = RutaSerializer(ruta, data=request.data)
        if serializer.is_valid():
            ruta = serializer.save()
            return Response(RutaSerializer(ruta).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        ruta = self.get_object(pk)
        if not ruta:
            return Response({'error': 'Ruta no encontrada'}, status=404)
        
        ruta.delete()
        return Response(status=204)


class EnvioListCreateView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get(self, request):
        try:
            envios = Envio.objects.all()
            serializer = EnvioSerializer(envios, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al obtener envíos: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)
    
    def post(self, request):
        try:
            serializer = EnvioSerializer(data=request.data)
            if serializer.is_valid():
                envio = serializer.save()
                return Response(EnvioSerializer(envio).data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            logger.error(f"Error al crear envío: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)


class EnvioDetailView(APIView):
    permission_classes = [AllowAny]  # Temporal para pruebas
    
    def get_object(self, pk):
        try:
            return Envio.objects.get(id=pk)
        except (Envio.DoesNotExist, InvalidId):
            return None
    
    def get(self, request, pk):
        envio = self.get_object(pk)
        if not envio:
            return Response({'error': 'Envío no encontrado'}, status=404)
        
        serializer = EnvioSerializer(envio)
        return Response(serializer.data)
    
    def put(self, request, pk):
        envio = self.get_object(pk)
        if not envio:
            return Response({'error': 'Envío no encontrado'}, status=404)
        
        serializer = EnvioSerializer(envio, data=request.data)
        if serializer.is_valid():
            envio = serializer.save()
            return Response(EnvioSerializer(envio).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        envio = self.get_object(pk)
        if not envio:
            return Response({'error': 'Envío no encontrado'}, status=404)
        
        envio.delete()
        return Response(status=204)


# Vista de login usando tabla Clientes
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email y contraseña requeridos'}, status=400)
    
    try:
        # Buscar cliente por email
        cliente = Cliente.objects.get(email=email)
        
        # Verificar que el cliente esté activo
        if not cliente.activo:
            return Response({'error': 'Cuenta desactivada'}, status=403)
        
        # Para simplificar, usamos el teléfono como contraseña
        # En producción deberías usar hash de contraseñas
        if cliente.telefono == password:
            # Crear o obtener usuario Django para el token
            user, created = User.objects.get_or_create(
                username=email.split('@')[0],
                defaults={
                    'email': email, 
                    'first_name': cliente.nombre.split()[0] if cliente.nombre else 'Usuario',
                    'last_name': cliente.nombre.split()[-1] if len(cliente.nombre.split()) > 1 else ''
                }
            )
            
            # Obtener o crear token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user': {
                    'id': str(cliente.id),
                    'username': user.username,
                    'email': cliente.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'nombre': cliente.nombre,
                    'telefono': cliente.telefono,
                    'ciudad': cliente.ciudad
                }
            })
        else:
            return Response({'error': 'Contraseña incorrecta'}, status=401)
            
    except Cliente.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=500)


# Vista de registro
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    nombre = request.data.get('nombre')
    email = request.data.get('email')
    telefono = request.data.get('telefono')  # Usará como contraseña
    direccion = request.data.get('direccion', '')
    ciudad = request.data.get('ciudad', '')
    codigo_postal = request.data.get('codigo_postal', '')
    
    if not nombre or not email or not telefono:
        return Response({
            'error': 'Nombre, email y teléfono son requeridos'
        }, status=400)
    
    try:
        # Verificar si el email ya existe
        if Cliente.objects.filter(email=email).first():
            return Response({'error': 'El email ya está registrado'}, status=400)
        
        # Crear nuevo cliente
        cliente_data = {
            'nombre': nombre,
            'email': email,
            'telefono': telefono,
            'direccion': direccion,
            'ciudad': ciudad,
            'codigo_postal': codigo_postal,
            'activo': True
        }
        
        cliente = Cliente.objects.create(**cliente_data)
        
        # Crear usuario Django para el token
        user = User.objects.create_user(
            username=email.split('@')[0],
            email=email,
            first_name=nombre.split()[0] if nombre else 'Usuario',
            last_name=nombre.split()[-1] if len(nombre.split()) > 1 else ''
        )
        
        # Crear token
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'token': token.key,
            'user': {
                'id': str(cliente.id),
                'username': user.username,
                'email': cliente.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'nombre': cliente.nombre,
                'telefono': cliente.telefono,
                'ciudad': cliente.ciudad
            }
        }, status=201)
        
    except Exception as e:
        logger.error(f"Error en registro: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=500)


@api_view(['GET'])
def dashboard_stats(request):
    """Vista para estadísticas del dashboard"""
    try:
        stats = {
            'total_clientes': Cliente.objects.count(),
            'total_conductores': Conductor.objects.count(),
            'total_vehiculos': Vehiculo.objects.count(),
            'total_rutas': Ruta.objects.count(),
            'total_envios': Envio.objects.count(),
            'envios_pendientes': Envio.objects.filter(estado='pendiente').count(),
            'envios_en_transito': Envio.objects.filter(estado='en_transito').count(),
            'envios_entregados': Envio.objects.filter(estado='entregado').count(),
            'conductores_disponibles': Conductor.objects.filter(estado='disponible').count(),
            'vehiculos_disponibles': Vehiculo.objects.filter(estado='disponible').count(),
        }
        return Response(stats)
    except Exception as e:
        logger.error(f"Error al obtener estadísticas: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=500)