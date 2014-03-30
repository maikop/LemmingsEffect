from celery.decorators import task
from rssreader import UpdateRSSFeeds

@task()
def updateRSS():
    UpdateRSSFeeds()
    return None
