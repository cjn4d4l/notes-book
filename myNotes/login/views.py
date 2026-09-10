import json
from django.http import HttpResponse, JsonResponse
from django.template import loader
from .models import User
from .models import Notes
from django.views.decorators.csrf import csrf_exempt
from django.utils import formats

# Create your views here.
def login(request): #view for login page
    template = loader.get_template("index.html")
    return HttpResponse(template.render())

def signup(request): #view for signup page
    template = loader.get_template("signup.html")
    return HttpResponse(template.render())

def main(request): #view for the main page
    template = loader.get_template("main.html")
    context = {
        'username': request.session.get("username"),
        'user_id': request.session.get("user_id")
    }
    return HttpResponse(template.render(context, request))

def profile(request):
    template = loader.get_template("profile.html")
    context = {
        'username': request.session.get("username"),
        'user_id': request.session.get("user_id")
    }
    return HttpResponse(template.render(context, request))

@csrf_exempt
def logout(request): #logout, removes session variables
    try:
        request.session.pop("user_id", None)
        request.session.pop("username", None)
        return JsonResponse({"status": True})
    except Exception:
        return JsonResponse({"status": False})

@csrf_exempt
def signupUser(request): #inserts a user
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"status": False, "message": "invalid JSON"}, status=400)

        user_exist = User.objects.filter(
            username=data.get("username")
        ).exists()

        if user_exist:
            return JsonResponse({"status": False, "message": "This User already exist"})

        user = User.objects.create(
            username=data.get("username"),
            password=data.get("password"),
        )

        return JsonResponse({"status": True, "message": "user created"}, status=201)

    return JsonResponse({"status": False, "message": "method not allowed"}, status=405)

@csrf_exempt
def loginUser(request): #logs a user
    if request.method == "POST":
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"status": False, "message": "invalid JSON"}, status=400)
    
            user_exists = User.objects.filter(
                username=data.get("username"),
                password=data.get("password"),
            ).first()
    
            if user_exists:
                request.session["user_id"] = user_exists.pk
                request.session['username'] = user_exists.username
                User.objects.filter(
                    username=data.get("username"),
                    password=data.get("password"),
                ).update(isActive=True)
                return JsonResponse({"status": True, "message": "success"})
    
            return JsonResponse({"status": False, "message": "invalid credentials"})

@csrf_exempt
def addPost(request): #add a post/note
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = request.session.get("user_id")

            if not user_id:
                return JsonResponse({"status": False, "message": "user not logged in"}, status=401)

            Notes.objects.create(
                title=data.get("title"),
                content=data.get("content"),
                user_id=user_id,
            )

            return JsonResponse({"status": True, "message": "post created"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"status": False, "message": "invalid JSON"}, status=400)
        except Exception:
            return JsonResponse({"status": False, "message": "could not create post"}, status=500)

    return JsonResponse({"status": False, "message": "method not allowed"}, status=405)

def getPosts(request): #retrieves all posts/notes
    if request.method == "GET":
        try:
            posts = Notes.objects.select_related("user")

            data = []

            for i in posts:
                data.append({
                    "title": i.title,
                    "content": i.content,
                    "user": i.user.username,
                    "date": formats.date_format(i.date, "F d, Y")
                })

            return JsonResponse(data, safe=False)
        except Exception:
            return JsonResponse({"status": False, "message": "could not retrieve posts"}, status=500)

    return JsonResponse({"status": False, "message": "method not allowed"}, status=405)

def getUserPosts(request):
    if request.method == "GET":
        try:
            posts = Notes.objects.filter(user=request.session.get("user_id"))

            data = []

            for i in posts:
                data.append({
                    "id": i.pk,
                    "title": i.title,
                    "content": i.content,
                    "date": formats.date_format(i.date, "F d, Y")
                })

            return JsonResponse(data, safe=False)
        except Exception:
            return JsonResponse({"status": False, "message": "could not retrieve posts"})

@csrf_exempt
def deletePost(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)

            post = Notes.objects.filter(pk=data['id'])
            post.delete()

            return JsonResponse({"status": True, "message": "Post Deleted"})
        except Exception:
            return JsonResponse({"status": False, "message": "could not delete post"}, status=500)
    #create delete method and post