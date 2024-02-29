from django.db import models


class UserAdmin(models.Model):
    AdresseMail = models.CharField(max_length=255, primary_key=True)
    Nom = models.CharField(max_length=255)
    Prenom = models.CharField(max_length=255)
    Telephone = models.CharField(max_length=10)
    ChangeRole = models.BooleanField(default=False)
    ROLE_CHOICES = [
        ('Administrateur', 'Administrateur'),
        ('Utilisateur', 'Utilisateur'),
    ]
    Role = models.CharField(choices=ROLE_CHOICES, default='Utilisateur', max_length=14)

    class Meta:
        db_table = 'UserAdmin'

class SuperAdmin(models.Model):
    AdresseMail = models.CharField(max_length=255, primary_key=True)
    Nom = models.CharField(max_length=255)
    Prenom = models.CharField(max_length=255)
    Telephone = models.CharField(max_length=10)

    class Meta:
        db_table = 'SuperAdmin'
