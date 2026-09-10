from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('loginUser/', views.loginUser),
    path('signupUser/', views.signupUser),
    path('addPost/', views.addPost),
    path('getPosts/', views.getPosts),
    path('', views.main),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile),
    path('getUserPosts/', views.getUserPosts),
    path('deletePost/', views.deletePost),
]
