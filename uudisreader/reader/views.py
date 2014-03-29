from django.shortcuts import render_to_response
from django.http import HttpResponse
from reader.models import Uudised
from django.template import Context, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math

# Create your views here.

def index(request):
    #Järjestuse valik
    page_order = request.GET.get('order', '')
    page_order_list = ["id", "-id", "published", "-published", "title", "-title"]
    if page_order not in page_order_list:
        page_order=page_order_list[1]
    #Valib esimese jupi.
    page_num = int(request.GET.get('page', 1))
    chunk_max = Uudised.objects.count()
    #Jagub kolmega (praegune leht, uus leht ja vana leht)
    chunk_size = 30
    #Siis saab jätta next ja prev nupud
    per_page = chunk_size/3
    #Viimane lehekülg
    max_pages = math.floor(chunk_max / per_page)
    chunk_stop = (page_num * per_page) + per_page
    chunk_start = chunk_stop - chunk_size
    fake_num = 1
    if page_num == 1:
        chunk_stop = chunk_size
        chunk_start = 0
    elif page_num > 1 and page_num < max_pages:
        fake_num = 2
    elif page_num >= max_pages:
        fake_num = 3
    #Teeb query
    queryset=Uudised.objects.all().order_by(page_order)[chunk_start:chunk_stop]
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, per_page)
    paginator._num_pages = max_pages
    page=paginator.page(fake_num)
    page.number = page_num

    return render_to_response("reader.html", {'page':page, 'order':page_order})


def empty(request):
    #Järjestuse valik
    page_order = request.GET.get('order', '')
    page_order_list = ["id", "-id", "published", "-published", "title", "-title"]
    if page_order not in page_order_list:
        page_order=page_order_list[1]
    #Valib esimese jupi.
    page_num = int(request.GET.get('page', 1))
    chunk_max = Uudised.objects.count()
    #Jagub kolmega (praegune leht, uus leht ja vana leht)
    chunk_size = 30
    #Siis saab jätta next ja prev nupud
    per_page = chunk_size/3
    #Viimane lehekülg
    max_pages = math.floor(chunk_max / per_page)
    chunk_stop = (page_num * per_page) + per_page
    chunk_start = chunk_stop - chunk_size
    fake_num = 1
    if page_num == 1:
        chunk_stop = chunk_size
        chunk_start = 0
    elif page_num > 1 and page_num < max_pages:
        fake_num = 2
    elif page_num >= max_pages:
        fake_num = 3
    #Teeb query
    queryset=Uudised.objects.all().order_by(page_order)[chunk_start:chunk_stop]
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, per_page)
    paginator._num_pages = max_pages
    page=paginator.page(fake_num)
    page.number = page_num

    return render_to_response("empty.html", {'page':page})