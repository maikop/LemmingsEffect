from django.shortcuts import render_to_response
from django.http import HttpResponse
from reader.models import Uudised
from django.template import Context, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math

from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from kasutaja.forms import RegistrationForm, LoginForm
from kasutaja.models import Kasutaja
from django.contrib.auth import authenticate, login, logout
from django.utils import simplejson


# Create your views here.

def index(request):
   
    paper = request.GET.get('tab', '')
    paper_order_list = ["Postimees", "Delfi", "All"]
    if paper not in paper_order_list:
        paper_order=paper_order_list[1]      
       
    #Järjestuse valik
    page_order = request.GET.get('order', '')
    page_order_list = ["id", "-id", "published", "-published", "title", "-title"]
    if page_order not in page_order_list:
        page_order=page_order_list[1]  
    category = request.GET.get('kateg', '')
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
    queryset=Uudised.objects.all().order_by("-id")[chunk_start:chunk_stop]
     
    if paper == "All":
        queryset=Uudised.objects.all().filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
    if paper =="Postimees" or paper =="Delfi":
        queryset=Uudised.objects.all().filter(leht=paper).filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
    
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, per_page)
    paginator._num_pages = max_pages
    page=paginator.page(fake_num)
    page.number = page_num

    return render_to_response("reader.html", {'page':page, 'order':page_order}, context_instance=RequestContext(request))


def empty(request):
    paper = request.GET.get('tab', '')
    paper_order_list = ["Postimees", "Delfi", "All"]
    if paper not in paper_order_list:
        paper_order=paper_order_list[1]      
       
    #Järjestuse valik
    page_order = request.GET.get('order', '')
    page_order_list = ["id", "-id", "published", "-published", "title", "-title"]
    if page_order not in page_order_list:
        page_order=page_order_list[1]  
    category = request.GET.get('kateg', '')
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
    queryset=Uudised.objects.all().order_by("-id")[chunk_start:chunk_stop]
     
    if paper == "All":
        queryset=Uudised.objects.all().filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
    if paper =="Postimees" or paper =="Delfi":
        queryset=Uudised.objects.all().filter(leht=paper).filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
    
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, per_page)
    paginator._num_pages = max_pages
    page=paginator.page(fake_num)
    page.number = page_num

    return render_to_response("empty.html", {'page':page}, context_instance=RequestContext(request))



def KasutajaRegistration(request):
        if request.user.is_authenticated():
                return HttpResponseRedirect('/')
        if request.method == 'POST':
                form = RegistrationForm(request.POST)
                if form.is_valid():
                        user = User.objects.create_user(username=form.cleaned_data['username'], email = form.cleaned_data['email'], password = form.cleaned_data['password'])
                        user.save()
                        kasutaja = Kasutaja(user=user)
                        kasutaja.save()
                        return HttpResponseRedirect('/profile/')
                else:
                        return render_to_response('register.html', {'form': form}, context_instance=RequestContext(request))
        else:
                ''' user is not submitting the form, show them a blank registration form '''
                form = RegistrationForm()
                context = {'form': form}
                return render_to_response('register.html', context, context_instance=RequestContext(request))


tagasi = '/'

def LoginRequest(request):
        global tagasi
        if request.user.is_authenticated():
                return HttpResponseRedirect(tagasi) #see peaks olema see elmine aadress
        if request.method == 'POST':
                form = LoginForm(request.POST)
                if form.is_valid():
                        username = form.cleaned_data['username']
                        password = form.cleaned_data['password']
                        kasutaja = authenticate(username=username, password=password)
                        if kasutaja is not None:
                                login(request, kasutaja)
                                return HttpResponseRedirect(tagasi)
                        else:
                                return render_to_response('login.html', {'form': form}, context_instance=RequestContext(request))
                else:
                        return render_to_response('login.html', {'form': form}, context_instance=RequestContext(request))
        else:
                ''' user is not submitting the form, show the login form '''
                tagasi = request.META.get('HTTP_REFERER', '/')
                form = LoginForm()
                context = {'form': form}
                return render_to_response('login.html', context, context_instance=RequestContext(request))

def LogoutRequest(request):
        logout(request)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
    
    
def push(request):
        response = 'data: ' + str(Uudised.objects.count()) + '\n\n'
        return HttpResponse(response,content_type='text/event-stream')