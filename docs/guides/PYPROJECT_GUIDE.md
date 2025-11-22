# Python Project Configuration Guide

This guide explains how to use the [pyproject.toml.template](pyproject.toml.template) for your Python projects.

## Quick Start

1. **Copy the template:**
   ```bash
   cp pyproject.toml.template pyproject.toml
   ```

2. **Update project metadata:**
   - Replace `your-project-name` with your actual project name
   - Update `version`, `description`, `authors`
   - Add your dependencies

3. **Install in development mode:**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install with dev dependencies
   pip install -e ".[dev]"
   ```

## What is pyproject.toml?

`pyproject.toml` is the modern standard for Python project configuration (PEP 518, 621, 660). It replaces:
- `setup.py` - Package installation
- `setup.cfg` - Package metadata
- `requirements.txt` - Dependencies
- Tool-specific config files (`.flake8`, `.isort.cfg`, etc.)

## Project Metadata

### Basic Information

```toml
[project]
name = "my-awesome-project"
version = "0.1.0"
description = "A Python package that does amazing things"
readme = "README.md"
requires-python = ">=3.10"
license = {text = "MIT"}
```

**Semantic Versioning:**
- `0.1.0` - Initial development
- `1.0.0` - First stable release
- `1.1.0` - New features (backwards compatible)
- `1.0.1` - Bug fixes
- `2.0.0` - Breaking changes

### Authors and Maintainers

```toml
authors = [
    {name = "Jane Doe", email = "jane@example.com"},
    {name = "John Smith", email = "john@example.com"}
]
maintainers = [
    {name = "Jane Doe", email = "jane@example.com"}
]
```

### Classifiers

Classifiers help users find your package on PyPI:

```toml
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]
```

**Development Status:**
- `1 - Planning` - Project is in planning stage
- `2 - Pre-Alpha` - Very early development
- `3 - Alpha` - Feature incomplete, likely unstable
- `4 - Beta` - Feature complete, may have bugs
- `5 - Production/Stable` - Ready for production
- `6 - Mature` - Well-tested, stable
- `7 - Inactive` - No longer maintained

## Dependencies

### Core Dependencies

Required for your package to run:

```toml
dependencies = [
    "requests>=2.31.0",
    "pydantic>=2.0.0,<3.0.0",
    "click>=8.1.0",
]
```

**Version Specifiers:**
- `>=2.31.0` - Version 2.31.0 or higher
- `>=2.0.0,<3.0.0` - Version 2.x only (not 3.0)
- `~=2.31.0` - Compatible release (>=2.31.0, <2.32.0)
- `==2.31.0` - Exact version (avoid in libraries)

### Optional Dependencies

Group related optional dependencies:

```toml
[project.optional-dependencies]
# Development tools
dev = [
    "pytest>=7.4.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
    "mypy>=1.5.0",
]

# Database support
postgres = [
    "psycopg2-binary>=2.9.0",
    "sqlalchemy>=2.0.0",
]

# API support
api = [
    "fastapi>=0.100.0",
    "uvicorn[standard]>=0.23.0",
]

# All optional dependencies
all = ["my-project[dev,postgres,api]"]
```

**Installation:**
```bash
pip install my-project[dev]           # Install with dev dependencies
pip install my-project[postgres,api]  # Install multiple groups
pip install my-project[all]           # Install everything
```

## Entry Points

### Command-Line Scripts

Create executable commands:

```toml
[project.scripts]
my-cli = "my_package.cli:main"
process-data = "my_package.processing:process_command"
```

After installation, users can run:
```bash
my-cli --help
process-data input.csv
```

### GUI Scripts

For GUI applications:

```toml
[project.gui-scripts]
my-app = "my_package.gui:main"
```

## Package Discovery

### Source Layout

**Recommended: `src/` layout**
```
my-project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       └── module.py
├── tests/
├── pyproject.toml
└── README.md
```

Configuration:
```toml
[tool.setuptools.packages.find]
where = ["src"]
include = ["my_package*"]
exclude = ["tests*"]
```

**Alternative: Flat layout**
```
my-project/
├── my_package/
│   ├── __init__.py
│   └── module.py
├── tests/
├── pyproject.toml
└── README.md
```

Configuration:
```toml
[tool.setuptools.packages.find]
where = ["."]
include = ["my_package*"]
exclude = ["tests*"]
```

## Tool Configuration

### Black (Code Formatter)

```toml
[tool.black]
line-length = 100
target-version = ["py310", "py311", "py312"]
```

**Usage:**
```bash
black .                # Format all files
black --check .        # Check without modifying
black --diff .         # Show what would change
```

### Ruff (Fast Linter)

```toml
[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "UP", "B"]
ignore = ["E501"]  # Line too long
```

**Rule Sets:**
- `E` - pycodestyle errors
- `F` - pyflakes (undefined names, unused imports)
- `I` - isort (import sorting)
- `N` - pep8-naming
- `UP` - pyupgrade (modern Python syntax)
- `B` - bugbear (common bugs)

**Usage:**
```bash
ruff check .           # Check all files
ruff check --fix .     # Auto-fix issues
ruff check --watch .   # Watch mode
```

### mypy (Type Checker)

```toml
[tool.mypy]
python_version = "3.10"
strict = true
warn_return_any = true
disallow_untyped_defs = true
```

**Usage:**
```bash
mypy src/              # Type check source
mypy --strict src/     # Strictest checking
```

### pytest (Testing)

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = [
    "--cov=src",
    "--cov-report=term-missing",
    "-v",
]
markers = [
    "slow: marks tests as slow",
    "integration: marks integration tests",
]
```

**Usage:**
```bash
pytest                     # Run all tests
pytest -v                  # Verbose output
pytest -k test_function    # Run specific tests
pytest -m "not slow"       # Skip slow tests
pytest --cov               # With coverage
```

### Coverage

```toml
[tool.coverage.run]
source = ["src"]
branch = true

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "if TYPE_CHECKING:",
]
```

**Usage:**
```bash
pytest --cov=src --cov-report=html  # Generate HTML report
open htmlcov/index.html             # View report
```

## Project URLs

```toml
[project.urls]
Homepage = "https://github.com/username/project"
Documentation = "https://project.readthedocs.io"
Repository = "https://github.com/username/project"
"Bug Tracker" = "https://github.com/username/project/issues"
Changelog = "https://github.com/username/project/blob/main/CHANGELOG.md"
```

## Development Workflow

### Initial Setup

```bash
# 1. Copy template
cp pyproject.toml.template pyproject.toml

# 2. Update project metadata
# Edit pyproject.toml with your project details

# 3. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 4. Install in editable mode with dev dependencies
pip install -e ".[dev]"

# 5. Install pre-commit hooks
pre-commit install
```

### Daily Development

```bash
# Format code
black .

# Lint code
ruff check --fix .

# Type check
mypy src/

# Run tests
pytest

# Run all checks
black . && ruff check --fix . && mypy src/ && pytest
```

### Building and Publishing

```bash
# 1. Install build tools
pip install build twine

# 2. Build distribution
python -m build

# 3. Check distribution
twine check dist/*

# 4. Upload to TestPyPI (for testing)
twine upload --repository testpypi dist/*

# 5. Test installation from TestPyPI
pip install --index-url https://test.pypi.org/simple/ your-package

# 6. Upload to PyPI (production)
twine upload dist/*
```

## Complete Example

Here's a complete example for a CLI tool:

```toml
[build-system]
requires = ["setuptools>=68.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "data-processor"
version = "1.0.0"
description = "A fast data processing CLI tool"
readme = "README.md"
requires-python = ">=3.10"
license = {text = "MIT"}
authors = [
    {name = "Jane Doe", email = "jane@example.com"}
]
keywords = ["data", "processing", "cli"]
classifiers = [
    "Development Status :: 5 - Production/Stable",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]

dependencies = [
    "click>=8.1.0",
    "pandas>=2.0.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov>=4.1.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
    "mypy>=1.5.0",
]

[project.scripts]
data-processor = "data_processor.cli:main"

[project.urls]
Homepage = "https://github.com/janedoe/data-processor"
Documentation = "https://data-processor.readthedocs.io"
Repository = "https://github.com/janedoe/data-processor"

[tool.setuptools.packages.find]
where = ["src"]

[tool.black]
line-length = 100

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "UP", "B"]

[tool.mypy]
strict = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = ["--cov=src", "-v"]
```

## Best Practices

1. **Use semantic versioning** - `MAJOR.MINOR.PATCH`
2. **Pin versions in applications** - Use exact versions
3. **Use ranges in libraries** - Allow flexibility for users
4. **Include LICENSE file** - Match the license in pyproject.toml
5. **Keep README updated** - Include installation and usage
6. **Write tests** - Aim for >80% coverage
7. **Use type hints** - Enable mypy strict mode
8. **Document public APIs** - Use docstrings
9. **Maintain CHANGELOG** - Track all changes
10. **Use pre-commit hooks** - Automate quality checks

## Resources

- [PEP 621](https://peps.python.org/pep-0621/) - Project metadata
- [PEP 518](https://peps.python.org/pep-0518/) - Build system requirements
- [setuptools documentation](https://setuptools.pypa.io/)
- [PyPI classifiers](https://pypi.org/classifiers/)
- [Python Packaging Guide](https://packaging.python.org/)

## Troubleshooting

### Import Errors After Installation

```bash
# Ensure you're installing in editable mode
pip install -e .

# Or reinstall
pip uninstall your-package
pip install -e ".[dev]"
```

### Tool Not Finding Configuration

```bash
# Verify pyproject.toml is in project root
ls pyproject.toml

# Some tools need explicit config file
black --config pyproject.toml .
```

### Version Conflicts

```bash
# Check installed versions
pip list

# Upgrade specific package
pip install --upgrade package-name

# Reinstall all dependencies
pip install --force-reinstall -e ".[dev]"
```

---

**Last Updated:** 2025-11-21
**Python Version:** 3.10+
