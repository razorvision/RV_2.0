# Templates

Standalone templates for common project configurations.

## 📦 Available Templates

### Python Project Configuration

**[pyproject.toml.template](pyproject.toml.template)**

Modern Python project configuration template following PEP 621, 518, and 660 standards.

**Features:**
- Build system configuration (setuptools, hatchling, poetry)
- Project metadata and dependencies
- Optional dependencies (dev, docs, test)
- Tool configuration (Black, Ruff, mypy, pytest, coverage)
- Entry points and scripts
- Comprehensive comments and examples

**Usage:**
```bash
# Copy to your Python project
cp templates/pyproject.toml.template pyproject.toml

# Customize for your project
nano pyproject.toml
```

**Documentation:** See [docs/guides/PYPROJECT_GUIDE.md](../docs/guides/PYPROJECT_GUIDE.md) for complete guide

## 🔧 Using Templates

### General Process

1. **Copy template to your project:**
   ```bash
   cp templates/[template-name] your-project/[target-name]
   ```

2. **Customize the template:**
   - Update project name and metadata
   - Adjust dependencies
   - Configure tool settings
   - Remove unused sections

3. **Validate configuration:**
   ```bash
   # For Python projects
   pip install --editable .

   # For other configs
   # Verify with appropriate tool
   ```

### Template Customization Guide

**pyproject.toml.template:**
- Replace `your-project-name` with actual project name
- Update `version`, `description`, `authors`
- Add/remove dependencies as needed
- Configure tool settings for your workflow
- Adjust Python version requirements

## 📚 Related Resources

### Python Configuration
- [PEP 621 - Project Metadata](https://peps.python.org/pep-0621/)
- [PEP 518 - Build System](https://peps.python.org/pep-0518/)
- [Setuptools Documentation](https://setuptools.pypa.io/)
- [Poetry Documentation](https://python-poetry.org/docs/)

### Additional Templates
- **MCP Servers:** See [.mcp-templates/](../.mcp-templates/) for Node.js and Python MCP server templates
- **Testing:** See [testing-template-packet/](../testing-template-packet/) for Django/Docker testing templates
- **Documentation:** See [.project-intake/templates/](../.project-intake/templates/) for documentation templates

## 🆕 Contributing Templates

Have a useful template to add?

1. Create the template file in this directory
2. Add comprehensive comments
3. Document in this README
4. Include usage examples
5. Submit a pull request

**Good templates include:**
- Clear purpose and use case
- Comprehensive comments
- Sensible defaults
- Customization instructions
- Validation steps

## 💡 Template Best Practices

1. **Include Comments:** Explain every section and option
2. **Use Placeholders:** Make it obvious what needs customization (e.g., `YOUR_PROJECT_NAME`)
3. **Provide Examples:** Show common configurations
4. **Stay Current:** Keep templates up to date with latest standards
5. **Document Well:** Link to official documentation and guides

---

**Need help?** Check the main [README.md](../README.md) or open an issue!
