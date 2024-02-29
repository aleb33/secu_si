from server.models import UserAdmin, SuperAdmin
from rest_framework import serializers

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class UserAdminSerializer(DynamicFieldsModelSerializer):
    AdresseMail = serializers.CharField(max_length=255)
    Nom = serializers.CharField(max_length=255)
    Prenom = serializers.CharField(max_length=255)
    Telephone = serializers.CharField(max_length=10)
    ChangeRole = serializers.BooleanField(default=False)
    Role = serializers.ChoiceField(choices=['Administrateur', 'Utilisateur'], default='Utilisateur')

    class Meta:
        model = UserAdmin
        fields = ['AdresseMail', 'Nom', 'Prenom', 'Telephone', 'ChangeRole', 'Role']

    def create(self, validated_data):
        return UserAdmin.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.AdresseMail = validated_data.get('AdresseMail', instance.AdresseMail)
        instance.Nom = validated_data.get('Nom', instance.Nom)
        instance.Prenom = validated_data.get('Prenom', instance.Prenom)
        instance.Telephone = validated_data.get('Telephone', instance.Telephone)
        instance.ChangeRole = validated_data.get('ChangeRole', instance.ChangeRole)
        instance.Role = validated_data.get('Role', instance.Role)
        instance.save()
        return instance
    
class SuperAdminSerializer(serializers.ModelSerializer):
    AdresseMail = serializers.CharField(max_length=255)
    Nom = serializers.CharField(max_length=255)
    Prenom = serializers.CharField(max_length=255)
    Telephone = serializers.CharField(max_length=10)

    class Meta:
        model = SuperAdmin
        fields = ['AdresseMail', 'Nom', 'Prenom', 'Telephone']

    def create(self, validated_data):
        return SuperAdmin.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.AdresseMail = validated_data.get('AdresseMail', instance.AdresseMail)
        instance.Nom = validated_data.get('Nom', instance.Nom)
        instance.Prenom = validated_data.get('Prenom', instance.Prenom)
        instance.Telephone = validated_data.get('Telephone', instance.Telephone)
        instance.save()
        return instance