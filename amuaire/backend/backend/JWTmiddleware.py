# middlewares.py
import jwt
from django.http import HttpResponseForbidden
from django.conf import settings
import re

from server.models import UserAdmin
from server.models import SuperAdmin


class JWTMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Vérifier si le cookie contenant le token JWT est présent dans la requête
        jwt_cookie = request.COOKIES.get('token')

        if jwt_cookie:
            try:
                # récupérer le secrey du dotenv
                # Spécifiez le chemin complet vers votre fichier .env
                dotenv_path = '../.env'
                # Chargez les variables d'environnement depuis le fichier .env

                with open(dotenv_path, 'r') as f:
                    env_file = f.read()

                # On récupère la valeur de la clé KEY_SECRET en utilisant regex
                secret_key = re.search(r'KEY_SECRET=(.*)', env_file).group(1)
                # Vérifier et décoder le token JWT
                decoded_payload = jwt.decode(
                    jwt_cookie, secret_key, algorithms=['HS256'])
                # Vous pouvez maintenant utiliser les informations du token pour vérifier les permissions, par exemple, ajouter un attribut 'user' à la requête
                request.user = decoded_payload.get('username')
                if UserAdmin.objects.filter(AdresseMail=request.user).exists():
                    request.user = UserAdmin.objects.get(
                        AdresseMail=request.user).Role
                else:
                    request.user = 'SuperAdmin'

            except jwt.ExpiredSignatureError:
                # Le token a expiré
                return HttpResponseForbidden('Token has expired')
            except jwt.InvalidTokenError:
                # Le token est invalide
                return HttpResponseForbidden('Invalid token')

        return self.get_response(request)
