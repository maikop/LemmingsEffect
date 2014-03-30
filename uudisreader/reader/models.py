from django.db import models
import feedparser

class Lehed(models.Model):
    name = models.CharField(max_length=2000)
    address = models.CharField(max_length=2000)
    
    def __str__(self):
        return self.name
        
class Uudised(models.Model):
    title = models.CharField(max_length=2000)
    description = models.CharField(max_length=2000)
    link = models.CharField(max_length=2000)
    published = models.CharField(max_length=2000)
    kategooria = models.CharField(max_length=2000)
    leht = models.CharField(max_length=2000)
    nuditud = models.CharField(max_length=2000)

    
    
    def __str__(self):
        return self.title
        
