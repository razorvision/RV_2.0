"""
Unit tests for browser session detection auto-logout feature
GitHub Issue: #733
"""
from unittest.mock import MagicMock, patch

import pytest
from django.http import JsonResponse
from django.shortcuts import reverse
from django.test import RequestFactory, TestCase


class BrowserSessionLogoutTestCase(TestCase):
    """Test cases for the browser session detection logout feature"""

    def setUp(self):
        self.factory = RequestFactory()

    def test_sign_out_default_reason_is_manual(self):
        """Test that sign_out defaults to 'manual' reason when not specified"""
        from customer_site.views import sign_out

        request = self.factory.get('/secure/sign-out/')
        request.session = MagicMock()
        request.session.get.return_value = 123

        with patch('customer_site.views.logger') as mock_logger:
            response = sign_out(request)

            # Verify logger was called with 'manual' reason
            mock_logger.info.assert_called_once_with("Customer 123 logged out (reason: manual)")

            # Verify redirect without session_expired parameter
            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.url, reverse("customer_site_sign_in"))

    def test_sign_out_with_browser_close_reason(self):
        """Test that sign_out handles 'browser_close' reason correctly"""
        from customer_site.views import sign_out

        request = self.factory.get('/secure/sign-out/?reason=browser_close')
        request.session = MagicMock()
        request.session.get.return_value = 456

        with patch('customer_site.views.logger') as mock_logger:
            response = sign_out(request)

            # Verify logger was called with 'browser_close' reason
            mock_logger.info.assert_called_once_with("Customer 456 logged out (reason: browser_close)")

            # Verify redirect includes session_expired parameter
            self.assertEqual(response.status_code, 302)
            self.assertIn('session_expired=1', response.url)

    def test_sign_out_ajax_request_returns_json(self):
        """Test that AJAX sign_out requests return JSON with reason"""
        from customer_site.views import sign_out

        request = self.factory.get('/secure/sign-out/?reason=browser_close')
        request.session = MagicMock()
        request.session.get.return_value = 789
        # Simulate AJAX request
        request.headers = {'X-Requested-With': 'XMLHttpRequest'}

        with patch('customer_site.views.logger'):
            response = sign_out(request)

            # Verify JSON response
            self.assertIsInstance(response, JsonResponse)
            import json
            data = json.loads(response.content.decode('utf-8'))
            self.assertTrue(data['success'])
            self.assertEqual(data['message'], 'Logged out successfully')
            self.assertEqual(data['reason'], 'browser_close')

    def test_sign_out_flushes_session(self):
        """Test that sign_out properly flushes the session"""
        from customer_site.views import sign_out

        request = self.factory.get('/secure/sign-out/')
        request.session = MagicMock()
        request.session.get.return_value = 123

        with patch('customer_site.views.logger'):
            sign_out(request)

            # Verify session.flush() was called
            request.session.flush.assert_called_once()

    def test_sign_out_without_customer_id(self):
        """Test that sign_out handles missing customer_id gracefully"""
        from customer_site.views import sign_out

        request = self.factory.get('/secure/sign-out/')
        request.session = MagicMock()
        request.session.get.return_value = None

        with patch('customer_site.views.logger') as mock_logger:
            response = sign_out(request)

            # Verify logger was NOT called (no customer_id)
            mock_logger.info.assert_not_called()

            # Verify redirect still works
            self.assertEqual(response.status_code, 302)


class SignInPageSessionExpiredTestCase(TestCase):
    """Test cases for session expired message on sign-in page"""

    def test_sign_in_page_shows_session_expired_message(self):
        """Test that sign_in page receives session_expired flag from query param"""
        from customer_site.dashboard.sign_in import show_page

        request = MagicMock()
        mock_get = MagicMock()
        mock_get.get.return_value = '1'
        mock_get.keys.return_value = ['session_expired']
        request.GET = mock_get

        with patch('customer_site.dashboard.sign_in.render') as mock_render:
            show_page(request)

            # Verify render was called
            mock_render.assert_called_once()

            # Get the context passed to render
            call_args = mock_render.call_args
            context = call_args.kwargs['context']

            # Verify session_expired is True
            self.assertTrue(context['session_expired'])

    def test_sign_in_page_session_expired_false_when_not_set(self):
        """Test that sign_in page sets session_expired to False when not in query params"""
        from customer_site.dashboard.sign_in import show_page

        request = MagicMock()
        mock_get = MagicMock()
        mock_get.get.return_value = None
        mock_get.keys.return_value = []
        request.GET = mock_get

        with patch('customer_site.dashboard.sign_in.render') as mock_render:
            show_page(request)

            # Get the context passed to render
            call_args = mock_render.call_args
            context = call_args.kwargs['context']

            # Verify session_expired is False
            self.assertFalse(context['session_expired'])

    def test_sign_in_page_session_expired_false_with_other_value(self):
        """Test that session_expired only triggers with value '1'"""
        from customer_site.dashboard.sign_in import show_page

        request = MagicMock()
        mock_get = MagicMock()
        mock_get.get.return_value = 'true'
        mock_get.keys.return_value = ['session_expired']
        request.GET = mock_get

        with patch('customer_site.dashboard.sign_in.render') as mock_render:
            show_page(request)

            # Get the context passed to render
            call_args = mock_render.call_args
            context = call_args.kwargs['context']

            # Verify session_expired is False (because value is not '1')
            self.assertFalse(context['session_expired'])


@pytest.mark.django_db
class BrowserSessionIntegrationTestCase(TestCase):
    """Integration tests for browser session detection workflow"""

    def test_browser_close_logout_workflow(self):
        """Test the complete workflow: browser close -> logout -> redirect with message"""
        from customer_site.views import sign_out

        # Step 1: Simulate browser close logout
        factory = RequestFactory()
        request = factory.get('/secure/sign-out/?reason=browser_close')
        request.session = MagicMock()
        request.session.get.return_value = 999

        with patch('customer_site.views.logger'):
            response = sign_out(request)

        # Verify redirect includes session_expired
        self.assertIn('session_expired=1', response.url)
        self.assertEqual(response.status_code, 302)

        # Step 2: Verify sign-in page receives the flag
        from customer_site.dashboard.sign_in import show_page

        signin_request = MagicMock()
        mock_get = MagicMock()
        mock_get.get.return_value = '1'
        mock_get.keys.return_value = ['session_expired']
        signin_request.GET = mock_get

        with patch('customer_site.dashboard.sign_in.render') as mock_render:
            show_page(signin_request)

            context = mock_render.call_args.kwargs['context']
            self.assertTrue(context['session_expired'])
