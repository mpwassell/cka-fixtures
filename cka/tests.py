"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.utils import unittest
from django.test.client import Client

class SimpleTest(TestCase):

    def setUp(self):
        # Every test needs a client.
        self.client = Client()

    def test_manage_players(self):
        # Issue a GET request.
        response = self.client.get('/cka/view/manage/players/PHO')

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        # Check that the active player table shows 5 columns
        self.assertEqual(len(response.context['active_players'].base_columns.keys()), 5)

    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
