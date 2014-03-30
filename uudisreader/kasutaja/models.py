from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
# Create your models here.

class Kasutaja(models.Model):
    user = models.OneToOneField(User)
    username= models.CharField(max_length=2000)
    password= models.CharField(max_length=2000)
    email= models.CharField(max_length=2000)
    
    def __str__(self):
        return self.username

#def create_kasutaja_user_callback(sender, instance, **kwargs):
#    kasutaja, new = Kasutaja.objects.get_or_create(user=instance)

#post_save.connect(create_kasutaja_user_callback, Kasutaja)