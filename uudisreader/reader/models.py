from django.db import models

class Lehed(models.Model):
    name = models.CharField(max_length=2000)
    address = models.CharField(max_length=2000)
    
    class Meta:
        verbose_name_plural = "Lehed"
    
    def __str__(self):
        return self.name
        
class Uudised(models.Model):
    title = models.CharField(max_length=2000)
    description = models.CharField(max_length=2000)
    link = models.CharField(max_length=2000)
    published = models.DateTimeField()
    kategooria = models.CharField(max_length=2000)
    leht = models.CharField(max_length=2000)
    nuditud = models.CharField(max_length=2000)
    
    class Meta:
        verbose_name_plural = "Uudised"
    
    def __str__(self):
        return self.title

class Lehtuudis(models.Model):
    title = models.CharField(max_length=2000)
    description = models.CharField(max_length=2000)
    link = models.CharField(max_length=2000)
    published = models.DateTimeField()
    kategooria = models.CharField(max_length=2000)
    leht = models.CharField(max_length=2000)
    nuditud = models.CharField(max_length=2000)
    name = models.CharField(max_length=2000)
    
    class Meta:
        verbose_name_plural = "Lehtuudis"
        managed = False
    
    def __str__(self):
        return self.title
