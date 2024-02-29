from django.http import JsonResponse
from server.models import UserAdmin, SuperAdmin
from django.core.exceptions import ObjectDoesNotExist
from server.serializers import UserAdminSerializer, SuperAdminSerializer
from django.shortcuts import render, redirect
from django.http import HttpResponse
from rest_framework.parsers import JSONParser
from jose import jwt  # Assurez-vous d'avoir installé le paquet python-jose
from decouple import config
from dotenv import load_dotenv
from django.views.decorators.csrf import csrf_exempt
from base64 import b64decode
import re


@csrf_exempt
def users(request):
    if request.method == 'GET':
        # recuperer les utilisateurs
        users = UserAdmin.objects.all()
        serializer = UserAdminSerializer(users, fields=(
            "Prenom", "Nom", "AdresseMail", "Telephone"), many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    elif request.method == "POST":
        # ajoute un utilisateur
        data = JSONParser().parse(request)
        # verifier que l'utilisateur connecté est admin ou superadmin
        print(data)
        new_AdresseMail = data['AdresseMail_new']
        new_Nom = data['Nom_new']
        new_Prenom = data['Prenom_new']
        new_Telephone = data['Telephone_new']
        new_Password = data['Password_new']

        # verifier qu'il y a pas déjà un utilisateur avec la même adresse mail
        try:
            user = UserAdmin.objects.get(AdresseMail=new_AdresseMail)
        except ObjectDoesNotExist:
            new_user = UserAdmin(
                AdresseMail=new_AdresseMail,
                Nom=new_Nom, Prenom=new_Prenom,
                Telephone=new_Telephone,
                # Password=new_Password
            )
            new_user.save()
            return JsonResponse(data={'success': 'User added'}, status=200)
        return JsonResponse(data={'error': 'E-mail already used'}, status=404)
    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def delete_user(request):
    if request.method == "POST":
        # supprimer l'utilisateur correspondant
        # récuperer l'utilisateur concerné
        # verifier que l'utilisateur connecté est admin ou superadmin
        data = JSONParser().parse(request)
        user_mail = data['AdresseMail_selected']
        try:
            user = UserAdmin.objects.get(AdresseMail=user_mail)
        except ObjectDoesNotExist:
            return JsonResponse(data={'error': 'User not found'}, status=404)
        user.delete()
        return JsonResponse(data={'success': 'User deleted'}, status=200)
    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def profil(request):
    # Récupérer le cookie JWT de la requête
    data = JSONParser().parse(request)
    jwt_cookie = data['token']
    if not jwt_cookie:
        return JsonResponse({'message': 'Cookie JWT non trouvé'}, status=401)

    # Spécifiez le chemin complet vers votre fichier .env
    dotenv_path = '../.env'
    # Chargez les variables d'environnement depuis le fichier .env

    with open(dotenv_path, 'r') as f:
        env_file = f.read()

    # On récupère la valeur de la clé KEY_SECRET en utilisant regex
    secret_key = re.search(r'KEY_SECRET=(.*)', env_file).group(1)

    decoded_payload = jwt.decode(jwt_cookie, secret_key, algorithms=["HS256"])
    # Le JWT est valide, vous pouvez accéder aux données du payload
    username = decoded_payload.get('username')
    print(username)
    if request.method == "POST":
        try:
            user = UserAdmin.objects.get(AdresseMail=username)
        except ObjectDoesNotExist:
            return JsonResponse(data={'error': 'User not found'}, status=404)
        serializer = UserAdminSerializer(user)
        return JsonResponse(serializer.data, safe=False, status=200)
    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def modify_profil(request):
    # Récupérer le cookie JWT de la requête
    data = JSONParser().parse(request)
    jwt_cookie = data['token']
    if not jwt_cookie:
        return JsonResponse({'message': 'Cookie JWT non trouvé'}, status=401)

    # Spécifiez le chemin complet vers votre fichier .env
    dotenv_path = '../.env'
    # Chargez les variables d'environnement depuis le fichier .env

    with open(dotenv_path, 'r') as f:
        env_file = f.read()

    # On récupère la valeur de la clé KEY_SECRET en utilisant regex
    secret_key = re.search(r'KEY_SECRET=(.*)', env_file).group(1)

    decoded_payload = jwt.decode(jwt_cookie, secret_key, algorithms=["HS256"])
    # Le JWT est valide, vous pouvez accéder aux données du payload
    username = decoded_payload.get('username')

    if request.method == "POST":
        try:
            user_2 = UserAdmin.objects.get(AdresseMail=data['AdresseMail_new'])
        except ObjectDoesNotExist:
            user = UserAdmin.objects.get(AdresseMail=username)
            user.AdresseMail = data['AdresseMail_new']
            user.Nom = data['Nom_new']
            user.Prenom = data['Prenom_new']
            user.Telephone = data['Telephone_new']
            # user.Password = data['Password_new']
            user.save()
            return JsonResponse(data={'success': 'Profil modified'}, status=200)
        return JsonResponse(data={'error': 'E-mail already used'}, status=404)
    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def modify_user(request, user):
    if request.method == 'GET':
        # recuperer les informations sur l'utilisateur concerné
        # verifier que l'utilisateur connecté est admin ou superadmin
        try:
            user = UserAdmin.objects.get(AdresseMail=user)
        except ObjectDoesNotExist:
            return JsonResponse(data={'error': 'User not found'}, status=404)

        serializer = UserAdminSerializer(user)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        # modifier l'utilisateur concerné
        # checker l'utilisateur connecté et son role
        data = JSONParser().parse(request)
        user_mail = data['AdresseMail_selected']
        new_AdresseMail = data['AdresseMail_new']
        new_Nom = data['Nom_new']
        new_Prenom = data['Prenom_new']
        new_Telephone = data['Telephone_new']
        new_Password = data['Password_new']
        new_ChangeRole = data['ChangeRole_new']

        try:
            if user_mail != new_AdresseMail:
                user = UserAdmin.objects.get(AdresseMail=new_AdresseMail)
            else:
                raise ObjectDoesNotExist
        except ObjectDoesNotExist:
            user = UserAdmin.objects.get(AdresseMail=user_mail)
            user.AdresseMail = new_AdresseMail
            user.Nom = new_Nom
            user.Prenom = new_Prenom
            user.Telephone = new_Telephone
            # user.Password = new_Password
            user.ChangeRole = new_ChangeRole
            user.save()
            return JsonResponse(data={'success': 'User modified'}, status=200)

        return JsonResponse(data={'error': 'E-mail already used'}, status=404)

    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def modify_admin(request, user):
    if request.method == 'GET':
        # recuperer les informations sur l'administrateur concerné
        # verifier que l'utilisateur connecté est admin ou superadmin
        try:
            user = UserAdmin.objects.get(AdresseMail=user)
        except ObjectDoesNotExist:
            return JsonResponse(data={'error': 'User not found'}, status=404)

        serializer = UserAdminSerializer(user)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        # modifier l'utilisateur concerné
        # checker l'utilisateur connecté et son role
        data = JSONParser().parse(request)
        user_mail = data['AdresseMail_selected']
        new_AdresseMail = data['AdresseMail_new']
        new_Nom = data['Nom_new']
        new_Prenom = data['Prenom_new']
        new_Telephone = data['Telephone_new']
        new_Password = data['Password_new']
        # a revoir
        new_Role = data['Role_new']

        try:
            if user_mail != new_AdresseMail:
                user = UserAdmin.objects.get(AdresseMail=new_AdresseMail)
            else:
                raise ObjectDoesNotExist
        except ObjectDoesNotExist:
            user = UserAdmin.objects.get(AdresseMail=user_mail)
            user.AdresseMail = new_AdresseMail
            user.Nom = new_Nom
            user.Prenom = new_Prenom
            user.Telephone = new_Telephone
            # user.Password = new_Password
            if new_Role != user.Role:
                user.ChangeRole = False

            user.Role = new_Role
            user.save()
            return JsonResponse(data={'success': 'User modified'}, status=200)

        return JsonResponse(data={'error': 'E-mail already used'}, status=404)

    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def get_user(request, user):
    if request.method == 'GET':
        # recuperer les informations sur l'utilisateur concerné
        # verifier que l'utilisateur connecté est admin ou superadmin
        try:
            user = UserAdmin.objects.get(AdresseMail=user)
        except ObjectDoesNotExist:
            return JsonResponse(data={'error': 'User not found'}, status=404)

        serializer = UserAdminSerializer(user)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse(data={'error': 'Method not supported'}, status=404)


@csrf_exempt
def handle_token(request):
    # Récupérer le cookie JWT de la requête
    jwt_cookie = request.COOKIES.get('jwt')

    if not jwt_cookie:
        return JsonResponse({'message': 'Cookie JWT non trouvé'}, status=401)
     # Spécifiez le chemin complet vers votre fichier .env
    dotenv_path = '../.env'
    # Chargez les variables d'environnement depuis le fichier .env

    with open(dotenv_path, 'r') as f:
        env_file = f.read()

    # On récupère la valeur de la clé KEY_SECRET en utilisant regex
    secret_key = re.search(r'KEY_SECRET=(.*)', env_file).group(1)

    decoded_payload = jwt.decode(
        jwt_cookie, secret_key, algorithms=["HS256"])
    # Le JWT est valide, vous pouvez accéder aux données du payload
    username = decoded_payload.get('username')
    # ... autres informations ...

    # enregister le token de session dans une variable de session
    request.session['token'] = jwt_cookie

    # Vérifier le rôle de l'utilisateur si il est dans la base UserAdmin ou SuperAdmin
    useradmin = UserAdmin.objects.filter(AdresseMail=username)
    if (useradmin.exists()):
        if (useradmin[0].Role == 'Utilisateur'):
            response = redirect("http://localhost:4200/home-user")
            response.set_cookie('token', jwt_cookie)
            return response
        elif (useradmin[0].Role == 'Administrateur'):
            return redirect("http://localhost:4200/home-admin").set_cookie('token', jwt_cookie)
        elif (useradmin[0].Role == 'SuperAdministrateur'):
            # a definir
            return redirect("http://localhost:4200/").set_cookie('token', jwt_cookie)
        return redirect("http://localhost:4200/").set_cookie('token', jwt_cookie)
        # return JsonResponse({'message': f'Vous êtes connecté en tant que {username}'}, status=200)
    elif (SuperAdmin.objects.filter(AdresseMail=username).exists()):
        return redirect("http://localhost:4200/home-user")
        return JsonResponse({'message': f'Vous êtes connecté en tant que {username}'}, status=200)
    else:
        return JsonResponse({'message': f'Vous êtes connecté en tant que {username} mais vous n\'avez pas les droits requis'}, status=401)


@csrf_exempt
def verify_token(request):
    # récupérer le token de session
    data = JSONParser().parse(request)
    jwt_cookie = data['token']
    print(data)

    # Spécifiez le chemin complet vers votre fichier .env
    dotenv_path = '../.env'
    # Chargez les variables d'environnement depuis le fichier .env

    with open(dotenv_path, 'r') as f:
        env_file = f.read()

    # On récupère la valeur de la clé KEY_SECRET en utilisant regex
    secret_key = re.search(r'KEY_SECRET=(.*)', env_file).group(1)

    if not jwt_cookie:
        return JsonResponse({'message': 'Cookie JWT non trouvé', 'role': 'undefined'}, status=401)
    decoded_payload = jwt.decode(
        jwt_cookie, secret_key, algorithms=["HS256"])
    # Le JWT est valide, vous pouvez accéder aux données du payload
    username = decoded_payload.get('username')
    # Vérifier le rôle de l'utilisateur si il est dans la base UserAdmin ou SuperAdmin
    useradmin = UserAdmin.objects.filter(AdresseMail=username)
    if (useradmin.exists()):
        return JsonResponse({'role': useradmin[0].Role}, status=200)
    elif (SuperAdmin.objects.filter(AdresseMail=username).exists()):
        return JsonResponse({'role': 'SuperAdmin'}, status=200)
    else:
        return JsonResponse({'message': f'Vous êtes connecté en tant que {username} mais vous n\'avez pas les droits requis'}, status=401)


def logout(request):

    # Spécifiez le chemin complet vers votre fichier .env
    dotenv_path = '../.env'
    # Chargez les variables d'environnement depuis le fichier .env
    with open(dotenv_path, 'w') as f:
        env_file = f.read()

    # a finir
