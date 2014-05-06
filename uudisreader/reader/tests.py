#from django.test import TestCase, Client
from django.test.utils import setup_test_environment
from reader.models import Uudised, Lehed, Lehtuudis
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

##class Tests(TestCase):
##    def test_index(self):
##        #resp = self.client.get('/login/')
##        self.assertEqual(200, 200)
##
##    def test_lehed(self):
##        Lehed.objects.create(name = 'Maaleht', address = 'www.maaleht.com')
##        leht = Lehed.objects.get(address = 'www.maaleht.com')
##        self.assertEqual(Lehed.objects.get(name = 'Maaleht'), leht)
##
##    def test_a(self):
##        client = Client()
##        response = client.get('/')
                



### heroku run python manage.py test

class SiseneJaVLju(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://uudisreader2.herokuapp.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_sisene_ja_v_lju(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_link_text("Sisene").click()
        driver.find_element_by_id("id_username").clear()
        driver.find_element_by_id("id_username").send_keys("maiko")
        driver.find_element_by_id("id_password").clear()
        driver.find_element_by_id("id_password").send_keys("q")
        driver.find_element_by_css_selector("input[type=\"submit\"]").click()
        self.assertTrue(self.is_element_present(By.LINK_TEXT, "Välju"))
        driver.find_element_by_link_text("Välju").click()
        self.assertTrue(self.is_element_present(By.LINK_TEXT, "Sisene"))
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
