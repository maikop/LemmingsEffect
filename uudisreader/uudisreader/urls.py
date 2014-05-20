# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url, static
from django.contrib import admin
import uudisreader.settings as settings
from reader.models import Uudised, Lehtuudis
from voting.views import vote_on_object

admin.autodiscover()

tip_dict = {
    'model': Lehtuudis,
    'template_object_name': 'lehtuudis',
    'allow_xmlhttprequest': True,
    'post_vote_redirect':'/',
    'template_name' : 'vote.html',
}

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'uudisreader.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    #Praegu ta viitab ainult vajalikule funktsioonile. 
    
    url(r'^empty/', 'reader.views.empty'),
    url(r'^register/', 'reader.views.KasutajaRegistration'),
    url(r'^login/', 'reader.views.LoginRequest'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^logout/', 'reader.views.LogoutRequest'),
    url(r'^a/', 'reader.views.push'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^staticurl/(?P<path>.*)$', 'reader.views.static'),
    url(r'^$', 'reader.views.index'),
    url(r'^profile/', 'reader.views.profile'),
    url(r'^uudis/(?P<object_id>\d+)', 'reader.views.uudisbox'),
    url(r'^(?P<object_id>\d+)/(?P<direction>up|down|clear)vote/?$', vote_on_object, tip_dict),
) + static.static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)