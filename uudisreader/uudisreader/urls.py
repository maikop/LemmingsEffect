# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url, static

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'uudisreader.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    #Praegu ta viitab ainult vajalikule funktsioonile. 
    
    url(r'^empty/', 'reader.views.empty'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'reader.views.index'),
)