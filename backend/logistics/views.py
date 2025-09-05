from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from datetime import datetime, timedelta

from .models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio
from .serializers import (
    ClienteSerializer, ConductorSerializer, VehiculoSerializer, 
    RutaSerializer, EnvioSerializer, EnvioCreateSerializer, 
    EnvioListSerializer, SeguimientoEnvioSerializer
)


class ClienteViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar clientes"""
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['activo', 'ciudad']
    search_fields = ['nombre', 'email', 'telefono']
    ordering_fields = ['nombre', 'fecha_registro']
    ordering = ['-fecha_registro']

    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener solo clientes activos"""
        clientes_activos = Cliente.objects.filter(activo=True)
        serializer = self.get_serializer(clientes_activos, many=True)
        return Response(serializer.data)


class ConductorViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar conductores"""
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'activo']
    search_fields = ['nombre', 'cedula', 'licencia']
    ordering_fields = ['nombre', 'fecha_contratacion']
    ordering = ['nombre']

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtener conductores disponibles"""
        conductores_disponibles = Conductor.objects.filter(estado='disponible', activo=True)
        serializer = self.get_serializer(conductores_disponibles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un conductor"""
        conductor = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado in dict(Conductor.ESTADO_CHOICES):
            conductor.estado = nuevo_estado
            conductor.save()
            serializer = self.get_serializer(conductor)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Estado no válido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class VehiculoViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar vehículos"""
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'estado', 'activo']
    search_fields = ['placa', 'marca', 'modelo']
    ordering_fields = ['placa', 'marca', 'año']
    ordering = ['placa']

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtener vehículos disponibles"""
        vehiculos_disponibles = Vehiculo.objects.filter(estado='disponible', activo=True)
        serializer = self.get_serializer(vehiculos_disponibles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un vehículo"""
        vehiculo = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado in dict(Vehiculo.ESTADO_CHOICES):
            vehiculo.estado = nuevo_estado
            vehiculo.save()
            serializer = self.get_serializer(vehiculo)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Estado no válido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class RutaViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar rutas"""
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'activa']
    search_fields = ['nombre', 'origen', 'destino']
    ordering_fields = ['nombre', 'distancia_km', 'fecha_creacion']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def activas(self, request):
        """Obtener rutas activas"""
        rutas_activas = Ruta.objects.filter(activa=True)
        serializer = self.get_serializer(rutas_activas, many=True)
        return Response(serializer.data)


class EnvioViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar envíos"""
    queryset = Envio.objects.select_related('cliente', 'ruta', 'vehiculo', 'conductor').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'prioridad', 'cliente', 'conductor', 'vehiculo']
    search_fields = ['numero_guia', 'cliente__nombre', 'descripcion_carga']
    ordering_fields = ['fecha_creacion', 'fecha_recogida_programada', 'fecha_entrega_programada']
    ordering = ['-fecha_creacion']

    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action == 'list':
            return EnvioListSerializer
        elif self.action == 'create':
            return EnvioCreateSerializer
        return EnvioSerializer

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Obtener envíos pendientes"""
        envios_pendientes = Envio.objects.filter(estado='pendiente')
        serializer = EnvioListSerializer(envios_pendientes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def en_transito(self, request):
        """Obtener envíos en tránsito"""
        envios_transito = Envio.objects.filter(estado='en_transito')
        serializer = EnvioListSerializer(envios_transito, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un envío y crear seguimiento"""
        envio = self.get_object()
        nuevo_estado = request.data.get('estado')
        descripcion = request.data.get('descripcion', '')
        ubicacion = request.data.get('ubicacion', '')
        
        if nuevo_estado in dict(Envio.ESTADO_CHOICES):
            envio.estado = nuevo_estado
            
            # Actualizar fechas según el estado
            if nuevo_estado == 'en_transito' and not envio.fecha_recogida_real:
                envio.fecha_recogida_real = datetime.now()
            elif nuevo_estado == 'entregado' and not envio.fecha_entrega_real:
                envio.fecha_entrega_real = datetime.now()
            
            envio.save()
            
            # Crear seguimiento
            SeguimientoEnvio.objects.create(
                envio=envio,
                estado=nuevo_estado,
                descripcion=descripcion or f"Estado cambiado a {nuevo_estado}",
                ubicacion=ubicacion,
                usuario=request.user if request.user.is_authenticated else None
            )
            
            serializer = self.get_serializer(envio)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Estado no válido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def seguimiento(self, request, pk=None):
        """Obtener el seguimiento completo de un envío"""
        envio = self.get_object()
        seguimientos = envio.seguimientos.all()
        serializer = SeguimientoEnvioSerializer(seguimientos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def buscar_por_guia(self, request):
        """Buscar envío por número de guía"""
        numero_guia = request.query_params.get('numero_guia')
        if not numero_guia:
            return Response(
                {'error': 'Debe proporcionar un número de guía'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            envio = Envio.objects.get(numero_guia=numero_guia)
            serializer = self.get_serializer(envio)
            return Response(serializer.data)
        except Envio.DoesNotExist:
            return Response(
                {'error': 'Envío no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def asignar_vehiculo_conductor(self, request, pk=None):
        """Asignar vehículo y conductor a un envío"""
        envio = self.get_object()
        vehiculo_id = request.data.get('vehiculo_id')
        conductor_id = request.data.get('conductor_id')
        
        try:
            if vehiculo_id:
                vehiculo = Vehiculo.objects.get(id=vehiculo_id, estado='disponible')
                envio.vehiculo = vehiculo
                vehiculo.estado = 'en_uso'
                vehiculo.save()
            
            if conductor_id:
                conductor = Conductor.objects.get(id=conductor_id, estado='disponible')
                envio.conductor = conductor
                conductor.estado = 'en_ruta'
                conductor.save()
            
            envio.save()
            
            # Crear seguimiento
            SeguimientoEnvio.objects.create(
                envio=envio,
                estado='asignado',
                descripcion=f"Vehículo y conductor asignados",
                usuario=request.user if request.user.is_authenticated else None
            )
            
            serializer = self.get_serializer(envio)
            return Response(serializer.data)
            
        except (Vehiculo.DoesNotExist, Conductor.DoesNotExist) as e:
            return Response(
                {'error': f'Recurso no encontrado: {str(e)}'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class SeguimientoEnvioViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar seguimientos de envío"""
    queryset = SeguimientoEnvio.objects.all()
    serializer_class = SeguimientoEnvioSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['envio', 'estado']
    ordering_fields = ['fecha_hora']
    ordering = ['-fecha_hora']
