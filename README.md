LemmingsEffect
==============


Testkeskkond:
http://uudisreader2.herokuapp.com/




ANDMEBAAS:

Join-lause: view reader_lehtuudis

"CREATE OR REPLACE VIEW reader_lehtuudis AS 
SELECT reader_uudis.id, title, description, link, published, kategooria, leht, nuditud, name 
FROM reader_uudised JOIN reader_lehed 
ON reader_lehed.name=reader_uudised.leht;"


Herokus käsurealt andmebaasi loomine:

"$ heroku addons:add heroku-postgresql:dev"

Tulemus oli:

"Adding heroku-postgresql:dev to uudisreader2... done, v69 (free)
Attached as HEROKU_POSTGRESQL_BLACK
Database has been created and is available"


Tabelite mudelid:

uudisreader -> reader -> models

ja

uudisreader -> kasutaja -> models
