# Templates

Standalone templates for common project configurations.

## 📦 Available Templates

### Next.js Application Starter

**[next-app/](next-app/)** - Complete Next.js 14+ starter kit

Production-ready templates for full-stack Next.js applications:

| Template | Purpose |
|----------|---------|
| `package.json.template` | Dependencies and scripts |
| `tsconfig.json.template` | TypeScript strict configuration |
| `tailwind.config.ts.template` | Tailwind with custom theme |
| `next.config.js.template` | Security headers, images, standalone |
| `src/app/layout.tsx.template` | Root layout with SEO metadata |
| `src/app/providers.tsx.template` | Session + Theme providers |
| `src/app/globals.css.template` | Utility CSS classes |
| `src/app/page.tsx.template` | Homepage template |
| `src/lib/prisma.ts.template` | Prisma client singleton |
| `src/lib/auth.ts.template` | NextAuth.js configuration |

**Quick Start:**
```bash
cp -r templates/next-app/* your-project/
cd your-project && npm install
```

**Documentation:** See [next-app/README.md](next-app/README.md)

---

### API Route Template

**[api-route.ts.template](api-route.ts.template)**

Next.js API route with validation, authentication, and pagination:

- Zod schema validation
- NextAuth.js authentication
- Prisma database queries
- Error handling patterns
- GET, POST, PUT, DELETE examples

**Usage:**
```bash
cp templates/api-route.ts.template src/app/api/your-route/route.ts
```

---

### Prisma Schema Template

**[prisma-schema.prisma.template](prisma-schema.prisma.template)**

Complete database schema with common models:

- NextAuth.js compatible User/Account/Session models
- Post, Comment, Category example models
- Soft delete support
- Audit timestamps
- Optional subscription/billing models
- Index optimization

**Usage:**
```bash
cp templates/prisma-schema.prisma.template prisma/schema.prisma
npx prisma db push && npx prisma generate
```

---

### Docker Templates

**[docker-compose.yml.template](docker-compose.yml.template)**

Local development services:
- PostgreSQL 16
- Redis 7
- Optional: pgAdmin, Mailhog, MinIO

**[Dockerfile.template](Dockerfile.template)**

Multi-stage production build:
- Node.js 20 Alpine
- Standalone Next.js output
- Non-root user
- Health check

**Usage:**
```bash
cp templates/docker-compose.yml.template docker-compose.yml
cp templates/Dockerfile.template Dockerfile
docker compose up -d
```

---

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
