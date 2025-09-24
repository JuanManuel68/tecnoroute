from django.urls import path
from .mongo_views import (
    ClienteListCreateView, ClienteDetailView,
    ConductorListCreateView, ConductorDetailView,
    VehiculoListCreateView, VehiculoDetailView,
    RutaListCreateView, RutaDetailView,
    EnvioListCreateView, EnvioDetailView,
    login_view, register_view, dashboard_stats
)

urlpatterns = [
    # Autenticación
    path('auth/login/', login_view, name='login'),
    path('auth/register/', register_view, name='register'),
    
    # Dashboard
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    
    # Clientes
    path('clientes/', ClienteListCreateView.as_view(), name='cliente-list-create'),
    path('clientes/<str:pk>/', ClienteDetailView.as_view(), name='cliente-detail'),
    
    # Conductores
    path('conductores/', ConductorListCreateView.as_view(), name='conductor-list-create'),
    path('conductores/<str:pk>/', ConductorDetailView.as_view(), name='conductor-detail'),
    
    # Vehículos
    path('vehiculos/', VehiculoListCreateView.as_view(), name='vehiculo-list-create'),
    path('vehiculos/<str:pk>/', VehiculoDetailView.as_view(), name='vehiculo-detail'),
    
    # Rutas
    path('rutas/', RutaListCreateView.as_view(), name='ruta-list-create'),
    path('rutas/<str:pk>/', RutaDetailView.as_view(), name='ruta-detail'),
    
    # Envíos
    path('envios/', EnvioListCreateView.as_view(), name='envio-list-create'),
    path('envios/<str:pk>/', EnvioDetailView.as_view(), name='envio-detail'),
]