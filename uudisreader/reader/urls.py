from django.conf.urls import patterns, include, url
from django.views.generic import ListView, DetailView
from reader.models import Uudised

# Create your views here.

urlpatterns = patterns('',
                       url(r'^$', ListView.as_view(
                           queryset=Uudised.objects.all().order_by("-Adddate"),
                           template_name="reader.html")),
                           
                         url(r'^(?P<pk>\d+)$', DetailView.as_view(
                           model=Uudised,
                           template_name="uudised.html")), 
                           
                       url(r'^latestnews/$', ListView.as_view(
                           queryset=Uudised.objects.all().order_by("Adddate")[:2],
                           template_name="archives.html")),

                       url(r'^archives/$', ListView.as_view(
                           queryset=Uudised.objects.all().order_by("-Adddate"),
                           template_name="archives.html")),                           
                         
)
