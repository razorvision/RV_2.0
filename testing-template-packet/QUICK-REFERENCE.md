# Testing Quick Reference Card

One-page reference for common testing commands and patterns.

## 🚀 Quick Commands

### Run Tests
```bash
# All tests (excluding slow browser tests)
docker exec CONTAINER pytest /tests/ -v -m 'not playwright'

# Specific file
docker exec CONTAINER pytest /tests/test_myfeature.py -v

# Specific test
docker exec CONTAINER pytest /tests/test_myfeature.py::TestClass::test_method -v
```

### Claude Code Slash Command
```
/test                    # Auto-discover and run relevant tests
```

### Common Options
```bash
-v                      # Verbose output
-vv                     # Very verbose (show diffs)
-s                      # Show print statements
-x                      # Stop on first failure
--lf                    # Run last failed tests
--tb=short              # Short traceback
-m "not playwright"     # Skip marked tests
```

## 📝 Test File Template

```python
"""Tests for my feature"""
from unittest.mock import MagicMock, patch
from django.test import TestCase, RequestFactory

class MyFeatureTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_basic_functionality(self):
        """Test description"""
        # Arrange
        expected = "value"

        # Act
        result = my_function()

        # Assert
        self.assertEqual(result, expected)
```

## 🎭 Common Patterns

### Mocking
```python
with patch('module.function') as mock:
    mock.return_value = value
    result = code_under_test()
    mock.assert_called_once()
```

### Request Factory
```python
request = self.factory.get('/path/')
request.session = MagicMock()
request.session.get.return_value = 123
```

### AJAX Testing
```python
request.headers = {'X-Requested-With': 'XMLHttpRequest'}
response = view(request)
self.assertIsInstance(response, JsonResponse)
```

### Assertions
```python
self.assertEqual(a, b)
self.assertNotEqual(a, b)
self.assertTrue(x)
self.assertFalse(x)
self.assertIsNone(x)
self.assertIn(item, list)
self.assertRaises(Exception, func)
```

## 🏷️ Pytest Markers

```python
@pytest.mark.django_db          # Requires database
@pytest.mark.playwright         # Browser automation (slow)
@pytest.mark.unit              # Fast unit test
@pytest.mark.integration       # Integration test
@pytest.mark.slow              # Slow test
```

Run by marker:
```bash
docker exec CONTAINER pytest -m unit -v        # Only unit tests
docker exec CONTAINER pytest -m "not slow" -v  # Skip slow tests
```

## 🐳 Docker Commands

### Container Status
```bash
docker ps                                    # List running containers
docker ps -a                                # List all containers
docker ps --filter "name=myapp"             # Filter by name
```

### Container Management
```bash
docker-compose up -d                        # Start containers
docker-compose restart core                 # Restart service
docker-compose logs -f core                 # View logs
docker exec -it CONTAINER bash              # Shell access
```

### Common Issues
```bash
# Port in use
docker-compose restart core

# Missing migrations
docker exec CONTAINER python manage.py migrate

# Rebuild image
docker-compose build core && docker-compose up -d
```

## 📊 Coverage

```bash
# Run with coverage
docker exec CONTAINER pytest /tests/ --cov=myapp --cov-report=html

# View report
open htmlcov/index.html
```

## 🔍 Test Discovery

```bash
# List all tests without running
docker exec CONTAINER pytest /tests/ --collect-only

# List tests matching pattern
docker exec CONTAINER pytest /tests/ --collect-only -k "browser"
```

## 📋 CI/CD Integration

```bash
# Generate JUnit XML
docker exec CONTAINER pytest /tests/ \
  -v \
  -m 'not playwright' \
  --junitxml=test-results.xml \
  --cov=myapp \
  --cov-report=xml
```

## 🎯 Workflow Tips

1. **TDD Workflow:**
   ```bash
   # Write failing test
   /test
   # Implement feature
   /test
   # Refactor
   /test
   ```

2. **Debug Failing Test:**
   ```bash
   # Run with full output
   docker exec CONTAINER pytest /tests/test_file.py::test_name -vv -s
   ```

3. **Quick Feedback Loop:**
   ```bash
   # Run only modified tests (use /test command)
   /test

   # Or run last failed
   docker exec CONTAINER pytest --lf -v
   ```

## 🔗 File Paths Checklist

**Update these in your project:**
- [ ] Container name: `CONTAINER`
- [ ] Test directory: `/tests/`
- [ ] App name: `myapp`
- [ ] Docker Compose file location

## 📚 Additional Resources

- Full docs: See `docs/TESTING.md`
- Setup guide: See `SETUP-CHECKLIST.md`
- Example tests: See `tests/test_example.py`

---

**Print this reference card and keep it handy!**
