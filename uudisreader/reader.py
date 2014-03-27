# -*- coding: utf-8 -*-
import feedparser
import psycopg2

#loome ühenduse andmebaasiga
db = psycopg2.connect(
	host = 'localhost',
	database = 'uudised',
	user = 'postgres',
	password = 'Xtreme123'
)
cursor = db.cursor()

cursor.execute("SELECT * FROM reader_lehed;")
a=cursor.fetchall()

#võtame RSS info
for i in a:

    print("teen " + i[1])
    d = i[2]
    feed=feedparser.parse( d )
    print(feed)
    #käime kõik uudised läbi XML failis
    for d in range(len(feed)-1):
        print(feed)
        print(i)
        description = feed.entries[d].description
        link = feed.entries[d].link
        title = feed.entries[d].title
        published = feed.entries[d].published
        
        cursor2 = db.cursor()
        cursor2.execute("SELECT COUNT(id) FROM reader_uudised WHERE (title='%s' AND description='%s' AND link='%s' AND published='%s')" % (title, description, link, published))
        if (not ((cursor2.fetchall()[0][0]))):
        	cursor.execute("INSERT INTO reader_uudised (title, description, link, published) VALUES (%s, %s, %s, %s)", (title, description, link, published))
        db.commit()

