# Testing Template Setup Checklist

Use this checklist when setting up testing in a new project using this template.

## ✅ Pre-Setup Requirements

- [ ] Docker and docker-compose installed
- [ ] Project has a Django application
- [ ] pytest and pytest-django installed in project
- [ ] Claude Code installed (for slash command integration)

## 📋 Setup Steps

### 1. Copy Template Files

- [ ] Copy `.claude/commands/test.md` to your project's `.claude/commands/` directory
- [ ] Copy `docs/TESTING.md` to your project's documentation folder
- [ ] Copy `tests/test_example.py` to your project's test directory (rename as needed)

### 2. Update Container References

#### In `.claude/commands/test.md`:
- [ ] Replace `wiseloan-core-core-1` with your container name
- [ ] Update test directory path: `/srv/core/customer_site/tests/` → your path
- [ ] Update Docker Compose command if using different filename
- [ ] Update working directory path: `/srv/core/` → your path

#### In `docs/TESTING.md`:
- [ ] Replace all instances of `wiseloan-core-core-1` with your container name
- [ ] Update test directory paths throughout document
- [ ] Update project-specific paths (e.g., `/srv/core/`)
- [ ] Update example test file references

### 3. Update Test File Patterns

#### In `.claude/commands/test.md`:
- [ ] Update file-to-test mapping patterns for your project structure
  ```
  For `your/app/views.py` → look for `your/app/tests/test_views.py`
  ```
- [ ] Add any additional file patterns specific to your project

### 4. Configure Test Settings

#### In your project:
- [ ] Ensure `pytest.ini` or `setup.cfg` is configured
- [ ] Add pytest markers if using custom ones
- [ ] Configure test database settings
- [ ] Set up any required test fixtures

Example `pytest.ini`:
```ini
[pytest]
DJANGO_SETTINGS_MODULE = your_project.settings.test
python_files = tests.py test_*.py *_tests.py
markers =
    slow: marks tests as slow
    playwright: marks tests requiring browser automation
    unit: marks tests as unit tests
    integration: marks tests as integration tests
```

### 5. Verify Docker Setup

- [ ] Confirm container name: `docker ps --filter "name=your-container"`
- [ ] Test Docker exec: `docker exec your-container-name python --version`
- [ ] Verify pytest is installed: `docker exec your-container-name pytest --version`
- [ ] Check test path exists: `docker exec your-container-name ls /path/to/tests`

### 6. Test the Setup

#### Test the slash command:
- [ ] Open Claude Code
- [ ] Type `/test` and verify it works
- [ ] Check that it discovers your test files
- [ ] Verify it runs tests successfully

#### Test manual commands:
- [ ] Run all tests: `docker exec your-container pytest /path/to/tests/ -v`
- [ ] Run specific test file
- [ ] Run with markers: `pytest -m unit`
- [ ] Verify test output is readable

### 7. Update Documentation

- [ ] Add project-specific test commands to TESTING.md
- [ ] Document any custom pytest markers
- [ ] Add troubleshooting for project-specific issues
- [ ] Update CI/CD integration section if applicable

### 8. Add Example Tests

- [ ] Copy and customize `test_example.py` for your first feature
- [ ] Add tests for critical functionality
- [ ] Ensure tests pass before committing
- [ ] Update test file references in documentation

### 9. Configure CI/CD (Optional)

- [ ] Add test command to CI/CD pipeline
- [ ] Configure JUnit XML output for CI system
- [ ] Set up coverage reporting
- [ ] Add test status badges to README

Example CI command:
```bash
docker exec your-container pytest /path/to/tests/ -v --junitxml=test-results.xml --cov=your_app
```

### 10. Final Verification

- [ ] All tests run successfully
- [ ] `/test` slash command works
- [ ] Documentation is accurate for your project
- [ ] Team members can run tests following the docs
- [ ] CI/CD integration works (if applicable)

## 🎯 Post-Setup Tasks

- [ ] Add testing to your development workflow
- [ ] Set up pre-commit hooks to run tests
- [ ] Schedule regular test reviews
- [ ] Document any additional testing patterns

## 📝 Common Customizations

### Container Name Patterns

**Docker Compose default:**
```bash
{directory-name}_{service-name}_1
# Example: myproject_core_1
```

**Custom docker-compose.yml:**
```yaml
services:
  app:
    container_name: my-custom-name
```

### Path Patterns

**Django typical structure:**
```
project/
├── app_name/
│   └── tests/
│       ├── test_models.py
│       ├── test_views.py
│       └── test_forms.py
```

**Docker internal paths:**
- Usually: `/srv/app/` or `/app/` or `/code/`
- Check: `docker exec your-container pwd`

### Test Discovery Patterns

Common patterns to add to `.claude/commands/test.md`:
```
For `app/models.py` → look for `app/tests/test_models.py`
For `app/views.py` → look for `app/tests/test_views.py`
For `app/forms.py` → look for `app/tests/test_forms.py`
For `app/api/endpoints.py` → look for `app/tests/api/test_endpoints.py`
```

## 🐛 Troubleshooting During Setup

### Issue: Container not found
```bash
# Solution: Check actual container name
docker ps
# Update name in all config files
```

### Issue: pytest not found
```bash
# Solution: Install in container
docker exec your-container pip install pytest pytest-django
# Or rebuild Docker image with pytest in requirements
```

### Issue: Tests not discovered
```bash
# Solution: Check pytest configuration
docker exec your-container pytest --collect-only /path/to/tests/
# Verify __init__.py exists in test directories
```

### Issue: Import errors in tests
```bash
# Solution: Check PYTHONPATH in container
docker exec your-container python -c "import sys; print(sys.path)"
# Add paths to pytest.ini or conftest.py
```

### Issue: Database errors
```bash
# Solution: Run migrations in test database
docker exec your-container python manage.py migrate --settings=your_project.settings.test
```

## 📞 Need Help?

Common issues and solutions are documented in `docs/TESTING.md` under "Common Issues & Solutions".

---

**Template Version:** 1.0 (Nov 2025)
**Last Updated:** Based on WiseLoan Core testing setup
