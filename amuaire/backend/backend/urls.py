"""
URL configuration for annuaire project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from server.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/profil', profil),
    path('api/modify-profil', modify_profil),
    path('api/get-users', users),
    path('api/get-user/<str:user>/', get_user, name='get_user'),
    path('api/modify-user/<str:user>/', modify_user, name='modify_user'),
    path('api/modify-admin/<str:user>/', modify_admin, name="modify_admin"),
    path('api/delete-user', delete_user),
    path('api/token', handle_token),
    path('api/verify-token', verify_token),
    path('api/logout', logout)
]
