# -*- coding: utf-8 -*-
import feedparser
import psycopg2
import re #regular expressions, lubab korralikult teksti töödelda
import uudisreader.settings
from datetime import datetime, timedelta
from time import mktime, localtime
import os


database=uudisreader.settings.DATABASES

#Teeme funktsiooniks, et saaks teisest failist jooksutada
def UpdateRSSFeeds():
	#loome ühenduse andmebaasiga
	db = psycopg2.connect(
		host = database['default']['HOST'],
		database = database['default']['NAME'],
		user = database['default']['USER'],
		password = database['default']['PASSWORD']
	)
	cursor = db.cursor()
	cursor.execute("SELECT * FROM reader_lehed;")
	a=cursor.fetchall()
	#Eemaldab < ja >, turvaauk, eemaldab delfi jaoks <img > vahelise
	def ltgtrem(word):
		word = re.sub('<img[^<]+?>', '', word)
		return word.replace('<', '').replace('>', '')
	#Eemaldab SQL-i jaoks " ja '
	def qrem(word):
		return ltgtrem(word.replace('"','&quot;').replace("'","&#39;"))
	def dateconvert(word):
		dt = datetime.fromtimestamp(mktime(feedparser._parse_date(word)))
		os.environ['TZ'] = 'Europe/Tallinn'
		add=timedelta(0,0,0,0,0,2)
		return datetime.strftime(dt+add, "%Y-%m-%d %H:%M:%S")
	#võtame RSS info
	for i in a:
		print("teen " + i[1])
		d = i[2]
		feed=feedparser.parse( d )
		#käime kõik uudised läbi XML failis. len(feed) annab väiksed numbrid. panin 30 praegu.
		for d in range(len(feed.entries)):
			#Alljärgnevad kaks loopi käivad läbi uudiste TAGid. Panin praegu arvamused Eesti alla ja krimi eraldi.
			#Hiljem saab seda täiendada, kuidas vaja. Postimehe TAGindus on õudus :P
			#NB! Aeg-ajalt vaadake andmebaasist, et kas on vigase kategooriaga sisendeid, sest preagu paneb ta need,
			#mis ma praegusel kellajal ära nägin. Neid on muidugi veel, kui leidlik olla.
			kategooria= "vale"
			#Käime Delfi täägid läbi 
			if i[1]=="Delfi":
					tagid=feed.entries[d]['tags']
					bb=len(tagid)
					for m in range(bb):
							if "Eesti" == tagid[m]['term'] or "Arvamus" == tagid[m]['term']:
									kategooria="eesti"
							elif "Maailm" == tagid[m]['term'] or "Välismaa" == tagid[m]['term']:
									kategooria="välis"
							elif "Postimees Sport: Värsked spordiuudised Eestist ja välismaalt" == tagid[m]['term']:
									kategooria="sport"        
							elif 'Krimi' == tagid[m]['term']:
									kategooria="krimi"
			#Käime Postimehe täägiformaadi läbi.
			if i[1]=="Postimees":
					tagid=feed.entries[d]['tags']
					bb=len(tagid)
					for m in range(bb):
							if "Eesti uudised - Postimees.ee" == tagid[m]['term']:
									kategooria="eesti"
							elif "Välisuudised - Postimees.ee" == tagid[m]['term']:
									kategooria="välis"
							elif "Postimees Sport: Värsked spordiuudised Eestist ja välismaalt" == tagid[m]['term']:
									kategooria="sport" 
							elif 'Krimi - Postimees.ee' == tagid[m]['term']:
									kategooria="krimi"
			description = feed.entries[d].description
			link = feed.entries[d].link
			title = feed.entries[d].title
			if hasattr(feed.entries[d], 'published'):
					published = feed.entries[d].published
			elif hasattr(feed.entries[d], 'date'):
					published = feed.entries[d].date
			else:
					published = str(datetime.now())
					print ("error: Date not specified")
			leht=i[1]
			#Pealkirjadehuumor
			#Teeb nii, et võtab selle sõnade faili, siis otsib pealkirja sõnu sealt.
			#Kui ei leia, võtab tähe maha ja otsib uuesti. Kui on üks täht alles, siis
			#enam ei otsi. Sidesõnad ja sõnakordused võtsin välja praegu.
			pealkiri=feed.entries[d].title
			puhas = re.sub('[.!,;?:*«»]', '', pealkiri)
			farts=puhas.split()#listiks
			f=open('sonad.txt', encoding='UTF-8')
			lines = f.read()
			keelatud=["jah", "ei", "ja", "ning", "ega", "ehk", "et", "sest", "aga", "kuid", "vaid", "siis"]
			nuditud=[]
			#See versioon lammutab lõppe
			for bullets in farts:
				if bullets not in keelatud:
						a=round(len(bullets)/1.5)
						bullets=bullets[:a]
						nuditud.append(bullets)
			print(nuditud)
			nuditud = ' '.join(nuditud)
			cursor2 = db.cursor()
			cursor2.execute("""SELECT COUNT(id) FROM reader_uudised WHERE (title='%s' AND description='%s' AND link='%s')""" % (qrem(title), qrem(description), qrem(link)))
			if (not ((cursor2.fetchall()[0][0]))):
				cursor.execute("INSERT INTO reader_uudised (title, description, link, published, kategooria, leht, nuditud) VALUES (%s, %s, %s, %s,  %s, %s, %s)", (qrem(title), qrem(description), qrem(link), dateconvert(published), qrem(kategooria), qrem(leht), qrem(nuditud)))
			db.commit()
	
UpdateRSSFeeds()
