# Testing Guide for WiseLoan Core

Quick reference for running tests in the WiseLoan Django application.

## Prerequisites

- Docker and docker-compose installed
- Containers built and running (`docker-compose up -d`)

## Quick Start

### Run All Tests (Excluding Playwright)
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ -v -m 'not playwright' --tb=short"
```

### Run Specific Test File
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/test_browser_session_detection.py -v"
```

### Run Specific Test Class
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/test_browser_session_detection.py::SignOutViewTestCase -v"
```

### Run Specific Test Method
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/test_browser_session_detection.py::SignOutViewTestCase::test_sign_out_with_browser_close_reason -v"
```

## Common Test Commands

### List All Tests Without Running
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ -v --co -q"
```

### Run Tests with Coverage Report
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ --cov=customer_site --cov-report=html"
```

### Run Tests with Verbose Output
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ -vv"
```

### Run Tests and Stop on First Failure
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ -x"
```

### Run Only Failed Tests from Last Run
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ --lf"
```

## Docker Container Management

### Check Container Status
```bash
docker ps --filter "name=wiseloan"
```

### Start Containers
```bash
docker-compose up -d
```

### Restart Core Container
```bash
docker-compose restart core
```

### View Container Logs
```bash
docker-compose logs -f core
```

### Access Container Shell
```bash
docker exec -it wiseloan-core-core-1 bash
```

## Django Management Commands

### Run Migrations
```bash
powershell -Command "docker exec wiseloan-core-core-1 python manage.py migrate"
```

### Create Test User
```bash
powershell -Command "docker exec wiseloan-core-core-1 python manage.py shell"
# Then in the shell:
from customer_site.models import Customer
Customer.objects.create(email='test@example.com', password='testpass123')
```

### Start Development Server
```bash
powershell -Command "docker exec wiseloan-core-core-1 bash -c 'cd /srv/core && python manage.py runserver 0.0.0.0:8000'"
```

### Stop Development Server
```bash
powershell -Command "docker exec wiseloan-core-core-1 bash -c 'pkill -f runserver || true'"
```

## Test File Locations

- **Test directory:** `code/core/customer_site/tests/`
- **Browser session detection tests:** `code/core/customer_site/tests/test_browser_session_detection.py`
- **Sign-in tests:** `code/core/customer_site/tests/test_signin_and_ibv.py`
- **Loan tests:** `code/core/customer_site/tests/test_loan_object.py`

## Common Issues & Solutions

### Issue: Port 8000 Already in Use
```bash
docker-compose restart core
```

### Issue: Database Tables Don't Exist
```bash
powershell -Command "docker exec wiseloan-core-core-1 python manage.py migrate"
```

### Issue: Test Dependencies Missing
```bash
# Rebuild the Docker image
docker-compose build core
docker-compose up -d
```

### Issue: Permission Denied
Make sure containers are running:
```bash
docker-compose up -d
```

## Pytest Markers

Tests can be marked with categories:
- `@pytest.mark.playwright` - Browser automation tests (slow)
- `@pytest.mark.unit` - Fast unit tests
- `@pytest.mark.integration` - Integration tests

Run tests by marker:
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ -m unit -v"
```

## Test Output Options

- `-v` - Verbose (show test names)
- `-vv` - Very verbose (show full diffs)
- `-s` - Show print statements
- `--tb=short` - Short traceback format
- `--tb=no` - No traceback
- `-q` - Quiet mode

## Browser Session Detection Tests

Our browser session detection feature has 9 comprehensive tests:

1. `test_sign_out_default_reason_is_manual` - Default logout reason
2. `test_sign_out_with_browser_close_reason` - Browser close logout
3. `test_sign_out_ajax_request_returns_json` - AJAX responses
4. `test_sign_out_flushes_session` - Session cleanup
5. `test_sign_out_without_customer_id` - Graceful handling
6. `test_sign_in_page_shows_session_expired_message` - Message display
7. `test_sign_in_page_session_expired_false_when_not_set` - Default behavior
8. `test_sign_in_page_session_expired_false_with_other_value` - Value validation
9. `test_browser_close_logout_workflow` - Complete integration

Run all browser session detection tests:
```bash
powershell -Command "docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/test_browser_session_detection.py -v"
```

## CI/CD Integration

For automated CI/CD pipelines, use:
```bash
docker exec wiseloan-core-core-1 pytest /srv/core/customer_site/tests/ -v -m 'not playwright' --junitxml=test-results.xml
```

This generates a JUnit XML report that most CI systems can parse.

## Tips

1. **Run tests frequently** - Catch bugs early
2. **Use markers** - Skip slow tests during development (`-m 'not playwright'`)
3. **Test in isolation** - Run specific test files while developing
4. **Check coverage** - Ensure new code has tests
5. **Keep containers running** - Faster test execution

## Resources

- [pytest documentation](https://docs.pytest.org/)
- [pytest-django documentation](https://pytest-django.readthedocs.io/)
- [Django testing documentation](https://docs.djangoproject.com/en/stable/topics/testing/)
