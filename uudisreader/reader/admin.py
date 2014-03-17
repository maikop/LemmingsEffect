from django.contrib import admin
from reader.models import Lehed
from reader.models import Uudised

# Register your models here.
admin.site.register(Uudised)
admin.site.register(Lehed)