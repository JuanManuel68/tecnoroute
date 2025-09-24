from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from datetime import datetime
import uuid

from .mongo_models import Usuario, Cliente, Conductor, Administrador


@api_view(['POST'])
@permission_classes([AllowAny])
def registro_usuario(request):
    """
    Endpoint para registrar nuevos usuarios con roles específicos
    """
    try:
        data = request.data
        
        # Validar campos obligatorios
        required_fields = ['email', 'password', 'nombre', 'telefono', 'rol']
        for field in required_fields:
            if not data.get(field):
                return Response({
                    'error': f'El campo {field} es obligatorio'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el email no existe
        if Usuario.objects(email=data['email']).first():
            return Response({
                'error': 'Ya existe un usuario con este correo electrónico'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        rol = data['rol']
        if rol not in ['admin', 'cliente', 'conductor']:
            return Response({
                'error': 'Rol no válido. Debe ser: admin, cliente o conductor'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear usuario principal
        usuario = Usuario(
            email=data['email'],
            rol=rol,
            nombre=data['nombre'],
            telefono=data['telefono']
        )
        usuario.set_password(data['password'])
        usuario.save()
        
        # Crear registro específico según el rol
        if rol == 'cliente':
            # Validar campos específicos del cliente
            cliente_fields = ['direccion', 'ciudad', 'codigo_postal']
            for field in cliente_fields:
                if not data.get(field):
                    usuario.delete()
                    return Response({
                        'error': f'El campo {field} es obligatorio para clientes'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            cliente = Cliente(
                usuario_id=usuario.id,
                nombre=data['nombre'],
                email=data['email'],
                telefono=data['telefono'],
                direccion=data['direccion'],
                ciudad=data['ciudad'],
                codigo_postal=data['codigo_postal'],
                tipo_cliente=data.get('tipo_cliente', 'individual'),
                documento_identidad=data.get('documento_identidad', '')
            )
            cliente.save()
            
        elif rol == 'conductor':
            # Validar campos específicos del conductor
            conductor_fields = ['cedula', 'licencia', 'categoria_licencia', 
                              'fecha_vencimiento_licencia', 'direccion', 
                              'fecha_nacimiento', 'fecha_contratacion']
            for field in conductor_fields:
                if not data.get(field):
                    usuario.delete()
                    return Response({
                        'error': f'El campo {field} es obligatorio para conductores'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar que no exista la cédula
            if Conductor.objects(cedula=data['cedula']).first():
                usuario.delete()
                return Response({
                    'error': 'Ya existe un conductor con esta cédula'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            conductor = Conductor(
                usuario_id=usuario.id,
                nombre=data['nombre'],
                cedula=data['cedula'],
                licencia=data['licencia'],
                categoria_licencia=data['categoria_licencia'],
                fecha_vencimiento_licencia=datetime.fromisoformat(data['fecha_vencimiento_licencia'].replace('Z', '+00:00')),
                telefono=data['telefono'],
                email=data['email'],
                direccion=data['direccion'],
                fecha_nacimiento=datetime.fromisoformat(data['fecha_nacimiento'].replace('Z', '+00:00')),
                fecha_contratacion=datetime.fromisoformat(data['fecha_contratacion'].replace('Z', '+00:00')),
                experiencia_años=data.get('experiencia_años', 0)
            )
            conductor.save()
            
        elif rol == 'admin':
            # Crear administrador
            admin = Administrador(
                usuario_id=usuario.id,
                departamento=data.get('departamento', 'General'),
                fecha_contratacion=datetime.utcnow(),
                permisos_especiales=data.get('permisos_especiales', [])
            )
            admin.save()
        
        # Crear usuario Django para el token (sin contraseña)
        django_user = User.objects.create_user(
            username=f'user_{usuario.id}',
            email=data['email'],
            first_name=data['nombre'].split()[0] if data['nombre'] else '',
            last_name=' '.join(data['nombre'].split()[1:]) if len(data['nombre'].split()) > 1 else '',
            is_staff=(rol == 'admin'),
            is_superuser=(rol == 'admin')
        )
        django_user.set_unusable_password()  # No usar contraseña Django
        django_user.save()
        
        # Crear token para autenticación
        token, created = Token.objects.get_or_create(user=django_user)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'token': token.key,
            'usuario': {
                'id': str(usuario.id),
                'nombre': usuario.nombre,
                'email': usuario.email,
                'rol': usuario.rol,
                'telefono': usuario.telefono
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Error interno del servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_usuario(request):
    """
    Endpoint para iniciar sesión de usuarios
    """
    try:
        data = request.data
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email y contraseña son obligatorios'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar usuario en MongoDB
        usuario = Usuario.objects(email=email, activo=True).first()
        
        if not usuario or not usuario.check_password(password):
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Actualizar último acceso
        usuario.ultimo_acceso = datetime.utcnow()
        usuario.save()
        
        # Buscar o crear usuario Django para el token
        try:
            django_user = User.objects.get(username=f'user_{usuario.id}')
        except User.DoesNotExist:
            django_user = User.objects.create_user(
                username=f'user_{usuario.id}',
                email=usuario.email,
                first_name=usuario.nombre.split()[0] if usuario.nombre else '',
                last_name=' '.join(usuario.nombre.split()[1:]) if len(usuario.nombre.split()) > 1 else '',
                is_staff=(usuario.rol == 'admin'),
                is_superuser=(usuario.rol == 'admin')
            )
            django_user.set_unusable_password()
            django_user.save()
        
        # Crear o obtener token
        token, created = Token.objects.get_or_create(user=django_user)
        
        # Obtener información adicional según el rol
        info_adicional = {}
        if usuario.rol == 'cliente':
            cliente = Cliente.objects(usuario_id=usuario.id).first()
            if cliente:
                info_adicional = {
                    'direccion': cliente.direccion,
                    'ciudad': cliente.ciudad,
                    'tipo_cliente': cliente.tipo_cliente
                }
        elif usuario.rol == 'conductor':
            conductor = Conductor.objects(usuario_id=usuario.id).first()
            if conductor:
                info_adicional = {
                    'cedula': conductor.cedula,
                    'licencia': conductor.licencia,
                    'estado': conductor.estado,
                    'categoria_licencia': conductor.categoria_licencia
                }
        elif usuario.rol == 'admin':
            admin = Administrador.objects(usuario_id=usuario.id).first()
            if admin:
                info_adicional = {
                    'departamento': admin.departamento,
                    'permisos_especiales': admin.permisos_especiales
                }
        
        return Response({
            'message': f'Bienvenido {usuario.nombre}',
            'token': token.key,
            'usuario': {
                'id': str(usuario.id),
                'nombre': usuario.nombre,
                'email': usuario.email,
                'rol': usuario.rol,
                'telefono': usuario.telefono,
                'info_adicional': info_adicional
            }
        })
        
    except Exception as e:
        return Response({
            'error': f'Error interno del servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def logout_usuario(request):
    """
    Endpoint para cerrar sesión
    """
    try:
        if request.user and hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        return Response({'message': 'Sesión cerrada exitosamente'})
    except Exception as e:
        return Response({
            'error': f'Error cerrando sesión: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def perfil_usuario(request):
    """
    Obtener información del perfil del usuario actual
    """
    try:
        if not request.user.is_authenticated:
            return Response({
                'error': 'Usuario no autenticado'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Obtener ID de MongoDB desde el username de Django
        mongo_user_id = request.user.username.replace('user_', '')
        usuario = Usuario.objects(id=mongo_user_id).first()
        
        if not usuario:
            return Response({
                'error': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener información adicional según el rol
        info_adicional = {}
        if usuario.rol == 'cliente':
            cliente = Cliente.objects(usuario_id=usuario.id).first()
            if cliente:
                info_adicional = {
                    'direccion': cliente.direccion,
                    'ciudad': cliente.ciudad,
                    'codigo_postal': cliente.codigo_postal,
                    'tipo_cliente': cliente.tipo_cliente,
                    'documento_identidad': cliente.documento_identidad
                }
        elif usuario.rol == 'conductor':
            conductor = Conductor.objects(usuario_id=usuario.id).first()
            if conductor:
                info_adicional = {
                    'cedula': conductor.cedula,
                    'licencia': conductor.licencia,
                    'categoria_licencia': conductor.categoria_licencia,
                    'fecha_vencimiento_licencia': conductor.fecha_vencimiento_licencia,
                    'estado': conductor.estado,
                    'experiencia_años': conductor.experiencia_años
                }
        elif usuario.rol == 'admin':
            admin = Administrador.objects(usuario_id=usuario.id).first()
            if admin:
                info_adicional = {
                    'departamento': admin.departamento,
                    'permisos_especiales': admin.permisos_especiales,
                    'fecha_contratacion': admin.fecha_contratacion
                }
        
        return Response({
            'usuario': {
                'id': str(usuario.id),
                'nombre': usuario.nombre,
                'email': usuario.email,
                'rol': usuario.rol,
                'telefono': usuario.telefono,
                'fecha_registro': usuario.fecha_registro,
                'ultimo_acceso': usuario.ultimo_acceso,
                'info_adicional': info_adicional
            }
        })
        
    except Exception as e:
        return Response({
            'error': f'Error obteniendo perfil: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)