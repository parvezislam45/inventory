from django.urls import path
from .views import RegisterView,LoginView,LogoutView,UserListView,UserRoleView,UserRoleDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path("users/", UserListView.as_view(), name="user-list"),
    path('users/<str:username>/', UserRoleDetailView.as_view(), name='user-detail'),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("users/<str:username>/", UserRoleView.as_view(), name="user-role"),
]