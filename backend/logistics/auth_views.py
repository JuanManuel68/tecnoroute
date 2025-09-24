from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q, Count, Sum
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import datetime, timedelta
import uuid

from user_management.models import UserProfile, Categoria, Producto, Carrito, CarritoItem, Pedido, PedidoItem
from .serializers import (
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    CategoriaSerializer, ProductoSerializer, CarritoSerializer, CarritoItemSerializer,
    PedidoSerializer, PedidoItemSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permiso personalizado para permitir solo lectura a usuarios normales"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'admin'


class AuthView(APIView):
    """Vista para autenticación de usuarios con roles diferenciados"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')  # Permitir login con email
        
        if not (username or email) or not password:
            return Response({
                'error': 'Username/email y password son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Intentar autenticación con username o email
        user = None
        if email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if not user and username:
            user = authenticate(username=username, password=password)
        
        if user and user.is_active:
            token, created = Token.objects.get_or_create(user=user)
            try:
                profile = user.userprofile
            except UserProfile.DoesNotExist:
                # Crear perfil si no existe (para usuarios existentes)
                role = 'admin' if user.is_superuser else 'customer'
                profile = UserProfile.objects.create(user=user, role=role)
            
            # Datos básicos del usuario
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': profile.role,
                'telefono': profile.telefono,
                'direccion': profile.direccion
            }
            
            # Datos específicos según el rol
            if profile.role == 'conductor':
                try:
                    from .models import Conductor
                    conductor = Conductor.objects.get(email=user.email)
                    user_data['conductor_info'] = {
                        'id': conductor.id,
                        'cedula': conductor.cedula,
                        'licencia': conductor.licencia,
                        'estado': conductor.estado
                    }
                except Conductor.DoesNotExist:
                    pass
            
            return Response({
                'token': token.key,
                'user': user_data,
                'message': f'Bienvenido {user.get_full_name() or user.username}'
            })
        else:
            return Response({
                'error': 'Credenciales inválidas o usuario inactivo'
            }, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    """Vista para registro de nuevos usuarios"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'message': 'Usuario registrado exitosamente',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': 'customer'
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Vista para cerrar sesión"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Sesión cerrada exitosamente'})
        except:
            return Response({'error': 'Error al cerrar sesión'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """Vista para obtener perfil del usuario actual"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.userprofile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(
                user=request.user, 
                role='admin' if request.user.is_superuser else 'customer'
            )
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class CategoriaViewSet(viewsets.ModelViewSet):
    """ViewSet para categorías de productos"""
    queryset = Categoria.objects.filter(activa=True)
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para testing


class ProductoViewSet(viewsets.ModelViewSet):
    """ViewSet para productos"""
    queryset = Producto.objects.filter(activo=True).select_related('categoria')
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para testing
    
    def get_queryset(self):
        queryset = super().get_queryset()
        categoria = self.request.query_params.get('categoria', None)
        search = self.request.query_params.get('search', None)
        
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        return queryset


class CarritoView(APIView):
    """Vista para manejar el carrito de compras"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Obtener el carrito del usuario actual"""
        carrito, created = Carrito.objects.get_or_create(usuario=request.user)
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

    def post(self, request):
        """Agregar producto al carrito"""
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad', 1)

        if not producto_id:
            return Response({'error': 'producto_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            producto = Producto.objects.get(id=producto_id, activo=True)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if cantidad > producto.stock:
            return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)

        carrito, created = Carrito.objects.get_or_create(usuario=request.user)
        
        carrito_item, created = CarritoItem.objects.get_or_create(
            carrito=carrito,
            producto=producto,
            defaults={'cantidad': cantidad}
        )

        if not created:
            nueva_cantidad = carrito_item.cantidad + cantidad
            if nueva_cantidad > producto.stock:
                return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)
            carrito_item.cantidad = nueva_cantidad
            carrito_item.save()

        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

    def patch(self, request):
        """Actualizar cantidad de un item en el carrito"""
        item_id = request.data.get('item_id')
        cantidad = request.data.get('cantidad')

        if not item_id or cantidad is None:
            return Response({'error': 'item_id y cantidad son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrito_item = CarritoItem.objects.get(
                id=item_id, 
                carrito__usuario=request.user
            )
        except CarritoItem.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if cantidad <= 0:
            carrito_item.delete()
        else:
            if cantidad > carrito_item.producto.stock:
                return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)
            carrito_item.cantidad = cantidad
            carrito_item.save()

        carrito = carrito_item.carrito
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

    def delete(self, request):
        """Eliminar item del carrito"""
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({'error': 'item_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrito_item = CarritoItem.objects.get(
                id=item_id, 
                carrito__usuario=request.user
            )
            carrito_item.delete()
            
            carrito = Carrito.objects.get(usuario=request.user)
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except CarritoItem.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class PedidoViewSet(viewsets.ModelViewSet):
    """ViewSet para pedidos"""
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny]  # Temporalmente para debugging

    def get_queryset(self):
        # Temporalmente mostrar todos los pedidos para debugging
        return Pedido.objects.all().select_related('usuario').prefetch_related('items')
        # if hasattr(self.request.user, 'userprofile') and self.request.user.userprofile.role == 'admin':
        #     return Pedido.objects.all().select_related('usuario').prefetch_related('items')
        # return Pedido.objects.filter(usuario=self.request.user).prefetch_related('items')

    @transaction.atomic
    def create(self, request):
        """Crear pedido desde el carrito"""
        direccion_envio = request.data.get('direccion_envio')
        telefono_contacto = request.data.get('telefono_contacto')
        notas = request.data.get('notas', '')

        if not direccion_envio or not telefono_contacto:
            return Response({
                'error': 'direccion_envio y telefono_contacto son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrito = Carrito.objects.get(usuario=request.user)
            if not carrito.items.exists():
                return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar stock
            for item in carrito.items.all():
                if item.cantidad > item.producto.stock:
                    return Response({
                        'error': f'Stock insuficiente para {item.producto.nombre}'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Crear pedido
            pedido = Pedido.objects.create(
                usuario=request.user,
                numero_pedido=f'PED-{uuid.uuid4().hex[:8].upper()}',
                total=carrito.total,
                direccion_envio=direccion_envio,
                telefono_contacto=telefono_contacto,
                notas=notas
            )

            # Crear items del pedido y actualizar stock
            for item in carrito.items.all():
                PedidoItem.objects.create(
                    pedido=pedido,
                    producto=item.producto,
                    cantidad=item.cantidad,
                    precio_unitario=item.producto.precio,
                    subtotal=item.subtotal
                )
                
                # Actualizar stock
                item.producto.stock -= item.cantidad
                item.producto.save()

            # Limpiar carrito
            carrito.items.all().delete()

            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar estado del pedido (solo admin)"""
        if not (hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'admin'):
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        pedido = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado not in [choice[0] for choice in Pedido.ESTADOS_PEDIDO]:
            return Response({'error': 'Estado no válido'}, status=status.HTTP_400_BAD_REQUEST)

        pedido.estado = nuevo_estado
        pedido.save()

        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas de pedidos"""
        try:
            # Estadísticas generales
            total_pedidos = Pedido.objects.count()
            total_ingresos = Pedido.objects.aggregate(total=Sum('total'))['total'] or 0
            
            # Pedidos por estado
            pedidos_por_estado = Pedido.objects.values('estado').annotate(count=Count('id'))
            estados_dict = dict(pedidos_por_estado.values_list('estado', 'count'))
            
            # Pedidos del día
            hoy = datetime.now().date()
            pedidos_hoy = Pedido.objects.filter(fecha_creacion__date=hoy).count()
            
            # Pedidos de la semana
            inicio_semana = hoy - timedelta(days=hoy.weekday())
            pedidos_semana = Pedido.objects.filter(fecha_creacion__date__gte=inicio_semana).count()
            
            # Pedidos del mes
            inicio_mes = hoy.replace(day=1)
            pedidos_mes = Pedido.objects.filter(fecha_creacion__date__gte=inicio_mes).count()
            
            return Response({
                'total_pedidos': total_pedidos,
                'total_ingresos': float(total_ingresos),
                'pedidos_hoy': pedidos_hoy,
                'pedidos_semana': pedidos_semana,
                'pedidos_mes': pedidos_mes,
                'pedidos_pendientes': estados_dict.get('pendiente', 0),
                'pedidos_confirmados': estados_dict.get('confirmado', 0),
                'pedidos_enviados': estados_dict.get('enviado', 0),
                'pedidos_entregados': estados_dict.get('entregado', 0),
                'pedidos_cancelados': estados_dict.get('cancelado', 0),
            })
        except Exception as e:
            return Response({
                'error': f'Error obteniendo estadísticas: {str(e)}',
                'total_pedidos': 0,
                'total_ingresos': 0,
                'pedidos_hoy': 0,
                'pedidos_semana': 0,
                'pedidos_mes': 0,
                'pedidos_pendientes': 0,
                'pedidos_confirmados': 0,
                'pedidos_enviados': 0,
                'pedidos_entregados': 0,
                'pedidos_cancelados': 0,
            })

    @action(detail=False, methods=['get'])
    def recientes(self, request):
        """Obtener pedidos recientes"""
        try:
            limit = request.query_params.get('limit', 10)
            try:
                limit = int(limit)
            except ValueError:
                limit = 10
                
            pedidos_recientes = Pedido.objects.select_related('usuario').prefetch_related('items').order_by('-fecha_creacion')[:limit]
            serializer = PedidoSerializer(pedidos_recientes, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': f'Error obteniendo pedidos recientes: {str(e)}',
                'data': []
            })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_connection(request):
    """Endpoint de prueba para verificar conexión"""
    from core.models import Pedido
    total_pedidos = Pedido.objects.count()
    return Response({
        'status': 'API funcionando correctamente',
        'total_pedidos': total_pedidos,
        'timestamp': '2025-09-05'
    })
