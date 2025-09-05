from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet)
router.register(r'conductores', views.ConductorViewSet)
router.register(r'vehiculos', views.VehiculoViewSet)
router.register(r'rutas', views.RutaViewSet)
router.register(r'envios', views.EnvioViewSet)
router.register(r'seguimientos', views.SeguimientoEnvioViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
