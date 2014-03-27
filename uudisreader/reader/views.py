from django.shortcuts import render_to_response
from django.http import HttpResponse
from reader.models import Uudised
from django.template import Context, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# Create your views here.

def index(request):
    #Teeb query
    queryset=Uudised.objects.all().order_by("-id")[:200]                      
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, 5)
    #Valib esimese jupi.
    page_num = request.GET.get('page', 1)
    page=paginator.page(page_num)

    return render_to_response("reader.html", {'page':page})
