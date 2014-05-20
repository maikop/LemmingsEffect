from django.shortcuts import render_to_response
from django.http import HttpResponse
from reader.models import Uudised, Lehed, Lehtuudis
from django.template import Context, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import csrf_exempt
import math

from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from kasutaja.forms import RegistrationForm, LoginForm
from kasutaja.models import Kasutaja
from django.contrib.auth import authenticate, login, logout
from django.utils import simplejson
from django.views.decorators.cache import cache_control

from django.contrib.staticfiles.views import serve


# Create your views here.

lehed=Lehed.objects.all().order_by("-name")
kategooriad = Uudised.objects.values_list('kategooria').distinct()


def index(request):
    paper = request.GET.get('tab', '')
    paper_order_list = ["All"] + [i[0] for i in (Lehed.objects.values_list('name'))]
    if paper not in paper_order_list:
        paper=paper_order_list[0]
       
    #Järjestuse valik
    page_order = request.GET.get('order', '')
    page_order_list = ["id", "-id", "published", "-published", "title", "-title"]
    if page_order not in page_order_list:
        page_order=page_order_list[3]  
    category = request.GET.get('kateg', '')
    category_list = [ "All"] + [i[0] for i in kategooriad]  #lae päris kategooriate list andmebaasist, pannes esimeseks tühjad jutumärgid
    if category not in category_list:
        category=category_list[0]        
              
    #Valib esimese jupi.
    page_num = int(request.GET.get('page', 1))
    #Jagub kolmega (praegune leht, uus leht ja vana leht)
    chunk_size = 30
    #Siis saab jätta next ja prev nupud
    per_page = chunk_size/3
    chunk_stop = (page_num * per_page) + per_page
    if page_num == 1:
        chunk_stop = chunk_size
    chunk_start = chunk_stop - chunk_size
    #Teeb query
    queryset=Lehtuudis.objects.all().order_by("-id")[chunk_start:chunk_stop]
     
    if paper == "All" and category=="All":
        queryset=Lehtuudis.objects.all().order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.count()
        sulud = True
    elif paper == "All":
        queryset=Lehtuudis.objects.all().filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.filter(kategooria=category).count()
        sulud = True
    elif category == "All":
        queryset=Lehtuudis.objects.all().filter(leht=paper).order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.filter(leht=paper).count()
        sulud = False
    else:
        queryset=Lehtuudis.objects.all().filter(leht=paper).filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.filter(leht=paper).filter(kategooria=category).count()
        sulud = False
    
    #Viimane lehekülg
    max_pages = math.ceil(chunk_max / per_page)
    fake_num = 1
    if page_num == 1:
        chunk_stop = chunk_size
        chunk_start = 0
    elif page_num > 1 and page_num <= max_pages:
        fake_num = 2
    elif page_num > max_pages:
        fake_num = 3  
    
    
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, per_page)
    paginator._num_pages = max_pages
    page=paginator.page(fake_num)
    page.number = page_num
    return render_to_response("reader.html", {'kategooriad':kategooriad, 'lehed':lehed, 'page':page, 'order':page_order, 'kategooria': category, 'sulud':sulud, 'tab': paper}, context_instance=RequestContext(request))


def empty(request):
    paper = request.GET.get('tab', '')
    paper_order_list = ["All"] + [i[0] for i in (Lehed.objects.values_list('name'))]
    if paper not in paper_order_list:
        paper=paper_order_list[0]
       
    #Järjestuse valik
    page_order = request.GET.get('order', '')
    page_order_list = ["id", "-id", "published", "-published", "title", "-title"]
    if page_order not in page_order_list:
        page_order=page_order_list[3]  
    category = request.GET.get('kateg', '')
    category_list = [ "All"] + [i[0] for i in kategooriad]  #lae päris kategooriate list andmebaasist, pannes esimeseks tühjad jutumärgid
    if category not in category_list:
        category=category_list[0]        
              
    #Valib esimese jupi.
    page_num = int(request.GET.get('page', 1))
    #Jagub kolmega (praegune leht, uus leht ja vana leht)
    chunk_size = 30
    #Siis saab jätta next ja prev nupud
    per_page = chunk_size/3
    chunk_stop = (page_num * per_page) + per_page
    if page_num == 1:
        chunk_stop = chunk_size
    chunk_start = chunk_stop - chunk_size
    #Teeb query
    queryset=Lehtuudis.objects.all().order_by("-id")[chunk_start:chunk_stop]
     
    if paper == "All" and category=="All":
        queryset=Lehtuudis.objects.all().order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.count()
        sulud = True
    elif paper == "All":
        queryset=Lehtuudis.objects.all().filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.filter(kategooria=category).count()
        sulud = True
    elif category == "All":
        queryset=Uudised.objects.all().filter(leht=paper).order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.filter(leht=paper).count()
        sulud = False
    else:
        queryset=Uudised.objects.all().filter(leht=paper).filter(kategooria=category).order_by(page_order)[chunk_start:chunk_stop]
        chunk_max = Uudised.objects.filter(leht=paper).filter(kategooria=category).count()
        sulud = False
    
    #Viimane lehekülg
    max_pages = math.ceil(chunk_max / per_page)
    fake_num = 1
    if page_num == 1:
        chunk_stop = chunk_size
        chunk_start = 0
    elif page_num > 1 and page_num <= max_pages:
        fake_num = 2
    elif page_num > max_pages:
        fake_num = 3  
    
    
    #Teeb ta 5-objektisteks juppideks
    paginator = Paginator(queryset, per_page)
    paginator._num_pages = max_pages
    page=paginator.page(fake_num)
    page.number = page_num
    return render_to_response("empty2.html", {'kategooriad':kategooriad, 'lehed':lehed, 'page':page, 'order':page_order, 'kategooria': category, 'sulud':sulud, 'tab': paper}, context_instance=RequestContext(request), mimetype='application/xml')



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
                        return render_to_response('register.html', {'kategooriad':kategooriad, 'lehed':lehed, 'form': form}, context_instance=RequestContext(request))
        else:
                ''' user is not submitting the form, show them a blank registration form '''
                form = RegistrationForm()
                context = {'form': form, 'kategooriad':kategooriad, 'lehed':lehed}
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
                                return render_to_response('login.html', {'kategooriad':kategooriad, 'lehed':lehed, 'form': form}, context_instance=RequestContext(request))
                else:
                        return render_to_response('login.html', {'kategooriad':kategooriad, 'lehed':lehed, 'form': form}, context_instance=RequestContext(request))
        else:
                ''' user is not submitting the form, show the login form '''
                tagasi = request.META.get('HTTP_REFERER', '/')
                form = LoginForm()
                context = {'form': form, 'kategooriad':kategooriad, 'lehed':lehed}
                return render_to_response('login.html', context, context_instance=RequestContext(request))

def LogoutRequest(request):
        logout(request)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


def profile(request):
	return HttpResponseRedirect('/')
    
  
@cache_control(must_revalidate=True, max_age=1)
def push(request):
        response = 'data: ' + str(Uudised.objects.count()) + '\n\n'
        return HttpResponse(response,content_type='text/event-stream')



@cache_control(max_age=604801)
def static(request, path):
        return serve(request, path[6:])

@csrf_exempt
def uudisbox(request, object_id):
	paper=Lehtuudis.objects.filter(id=object_id).values("link")[0].get('link')
	isurl = False
	if paper[:7] == 'http://' or paper[:8] == 'https://':
		isurl = True
	if ((paper[:22] == 'http://uudised.err.ee/') or (paper[:19] == 'http://menu.err.ee/')):
		paper = 'http://www.gmodules.com/ig/proxy?url='+str(paper)
	if isurl == False:
		return HttpResponseRedirect('/')
	else:
		return render_to_response("uudisbox.html", {'paper':paper}, context_instance=RequestContext(request))
