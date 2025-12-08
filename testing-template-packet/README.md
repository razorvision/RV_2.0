# Testing Template Packet

A comprehensive testing setup template for Django projects using Docker, pytest, and Claude Code slash commands.

## 📦 What's Included

### 1. **Claude Code Integration** (`.claude/commands/test.md`)
- Custom `/test` slash command for automated testing
- Intelligent test discovery based on context
- Automatically finds and runs relevant tests for modified files
- Windows/Docker-compatible command execution

### 2. **Testing Documentation** (`docs/TESTING.md`)
- Quick start guide for running tests
- Common test commands and patterns
- Docker container management
- Pytest markers and options
- Troubleshooting guide
- CI/CD integration examples

### 3. **Example Test File** (`tests/test_example.py`)
- Comprehensive unit test examples
- Mock and patch patterns
- Django TestCase usage
- Integration test examples
- Multiple test scenarios (success, failure, edge cases)

## 🚀 Quick Setup

### For a New Project

1. **Copy the testing structure:**
   ```bash
   cp -r testing-template-packet/.claude your-project/
   cp testing-template-packet/docs/TESTING.md your-project/
   ```

2. **Adapt the test command** (`.claude/commands/test.md`):
   - Update container name: `wiseloan-core-core-1` → `your-container-name`
   - Update test paths to match your project structure
   - Update Docker compose command if needed

3. **Customize TESTING.md**:
   - Update paths to match your project
   - Update container names
   - Add project-specific test commands

4. **Use the example test file as a template:**
   ```bash
   cp testing-template-packet/tests/test_example.py your-project/tests/test_your_feature.py
   ```

## 📝 Key Features

### Automated Test Discovery
The `/test` slash command automatically:
- Detects modified files from git status
- Finds corresponding test files
- Runs appropriate tests based on context
- Provides clear pass/fail reporting

### Docker Integration
All commands are designed to work with Docker:
- Windows PowerShell compatibility
- Container health checks
- Automatic container startup
- Path handling for containerized tests

### Best Practices
- **Pytest markers** for test categorization (`@pytest.mark.playwright`, etc.)
- **Short tracebacks** for faster debugging
- **Verbose output** for test visibility
- **Coverage reporting** integration
- **CI/CD ready** with JUnit XML output

## 🎯 Usage Examples

### Running Tests with Claude Code

Simply use the `/test` command:
```
/test
```

Claude will automatically:
1. Check what files you're working on
2. Find relevant test files
3. Run the appropriate tests
4. Report results with suggestions

### Manual Testing

See `docs/TESTING.md` for comprehensive manual commands:
- Run all tests
- Run specific test files
- Run specific test classes/methods
- Run with coverage
- Run with markers

## 🔧 Customization Guide

### 1. Update Container Names

**In `.claude/commands/test.md`:**
```bash
# Change:
docker exec wiseloan-core-core-1 pytest ...

# To:
docker exec your-container-name pytest ...
```

**In `docs/TESTING.md`:**
Update all references to container names and paths.

### 2. Update Test Paths

**In `.claude/commands/test.md`:**
```bash
# Change:
/srv/core/customer_site/tests/

# To:
/path/to/your/tests/
```

### 3. Update Test File Patterns

**In `.claude/commands/test.md`:**
Update the file path mapping logic:
```
For `your/app/views.py` → look for `your/app/tests/test_views.py`
```

### 4. Add Project-Specific Markers

**In `docs/TESTING.md` and test files:**
```python
@pytest.mark.slow
@pytest.mark.api
@pytest.mark.database
```

## 📚 Test File Structure

The example test file demonstrates:

### 1. **Unit Tests**
```python
class MyFeatureTestCase(TestCase):
    def setUp(self):
        # Setup code

    def test_basic_functionality(self):
        # Test implementation
```

### 2. **Mock Usage**
```python
with patch('module.function') as mock_func:
    mock_func.return_value = expected_value
    # Test with mocked function
```

### 3. **AJAX/JSON Testing**
```python
request.headers = {'X-Requested-With': 'XMLHttpRequest'}
response = view(request)
self.assertIsInstance(response, JsonResponse)
```

### 4. **Integration Tests**
```python
@pytest.mark.django_db
class IntegrationTestCase(TestCase):
    def test_complete_workflow(self):
        # Multi-step integration test
```

## 🛠️ Tech Stack

- **Testing Framework:** pytest + pytest-django
- **Mocking:** unittest.mock
- **Docker:** Container-based testing
- **CI/CD:** JUnit XML output support
- **IDE Integration:** Claude Code slash commands

## 📖 Documentation Files

### `.claude/commands/test.md`
Defines the `/test` slash command behavior:
- Automatic test discovery
- Context-aware test execution
- Result reporting
- Windows/Docker command formatting

### `docs/TESTING.md`
Complete testing guide:
- Quick start commands
- Common workflows
- Docker management
- Troubleshooting
- Best practices

### `tests/test_example.py`
Example test file showing:
- Test class structure
- Setup and teardown
- Various test patterns
- Mock/patch usage
- Assertions

## 🎓 Tips for Using This Template

1. **Start with the example test file** - Copy and modify for your features
2. **Use the `/test` command frequently** - Catch bugs early
3. **Add markers for slow tests** - Keep feedback loop fast
4. **Update docs as you go** - Keep TESTING.md current
5. **Customize for your workflow** - Adapt paths, commands, and markers

## 🔗 Resources

### General Testing (Any Framework)

- [Testing Guide](../docs/guides/development/TESTING_GUIDE.md) - Unit, integration, and E2E testing patterns
- [Code Quality Policy](../docs/guides/CODE_QUALITY_POLICY.md) - Test coverage requirements and standards

### Django/Pytest Specific

- [pytest documentation](https://docs.pytest.org/)
- [pytest-django documentation](https://pytest-django.readthedocs.io/)
- [Django testing documentation](https://docs.djangoproject.com/en/stable/topics/testing/)
- [unittest.mock documentation](https://docs.python.org/3/library/unittest.mock.html)

## 📝 License

This template is provided as-is for use in your projects. Adapt and modify as needed.

---

**Created from:** WiseLoan Core testing infrastructure (Nov 2025)
**Features:** Docker + pytest + Django + Claude Code integration
