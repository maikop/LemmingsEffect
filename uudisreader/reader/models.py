from django.db import models
import feedparser

class Lehed(models.Model):
    Name = models.CharField(max_length=200)
    Address = models.CharField(max_length=200)
    Adddate = models.DateTimeField('date published')
    
    def __str__(self):
        return self.Name
        
class Uudised(models.Model):
    Title = models.CharField(max_length=200)
    Description = models.CharField(max_length=200)
    Link = models.CharField(max_length=200)
    Published = models.CharField(max_length=200)
    Adddate = models.DateTimeField('date published')
    
    def __str__(self):
        return self.Title
        