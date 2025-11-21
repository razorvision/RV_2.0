# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this template repository or any of its components, please report it responsibly.

### How to Report

**For security issues, please DO NOT open a public GitHub issue.**

Instead, please report security vulnerabilities via one of these methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the repository's Security tab
   - Click "Report a vulnerability"
   - Fill out the advisory form with details

2. **Email**
   - Send details to the repository maintainer
   - Include "SECURITY" in the subject line
   - Provide detailed description of the vulnerability

3. **Private Disclosure**
   - Contact repository maintainers directly
   - Request a secure communication channel if needed

### What to Include

Please provide as much information as possible:

- **Type of vulnerability** (e.g., XSS, SQL injection, credential exposure)
- **Location** (file path, line numbers, affected components)
- **Steps to reproduce** the vulnerability
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up questions

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Status updates**: Every 7 days until resolution
- **Fix timeline**: Depends on severity (see below)

### Severity Levels

| Severity | Description | Response Time |
|----------|-------------|---------------|
| **Critical** | Allows arbitrary code execution, data breach, or full system compromise | 24-48 hours |
| **High** | Significant security impact, but requires specific conditions | 3-7 days |
| **Medium** | Limited security impact or requires user interaction | 14-30 days |
| **Low** | Minimal security impact or theoretical vulnerability | 30-90 days |

## Supported Versions

This template repository is continuously updated. Security fixes are applied to:

| Version | Supported |
|---------|-----------|
| Latest (main branch) | ✅ Yes |
| Previous releases | ❌ No (update to latest) |

**Recommendation:** Always use the latest version of this template when creating new projects.

## Security Best Practices

When using this template for your projects, follow these security guidelines:

### 1. Environment Variables & Secrets

**❌ Never commit secrets to version control:**
```bash
# Bad - secrets in code
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "supersecret123";
```

**✅ Use environment variables:**
```bash
# Good - reference environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

**Verify `.env` is in `.gitignore`:**
```gitignore
# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### 2. Dependency Management

**Regular updates:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (when safe)
npm audit fix

# Review and update dependencies
npm outdated
npm update
```

**Use lock files:**
- Commit `package-lock.json` (npm)
- Commit `pnpm-lock.yaml` (pnpm)
- Commit `yarn.lock` (yarn)

**Pin critical dependencies:**
```json
{
  "dependencies": {
    "express": "4.18.2",
    "jsonwebtoken": "~9.0.0"
  }
}
```

### 3. Input Validation

**Always validate user input:**
```typescript
// Good - using Zod for validation
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/)
});

function createUser(data: unknown) {
  const validated = userSchema.parse(data); // Throws if invalid
  // Proceed with validated data
}
```

### 4. SQL Injection Prevention

**❌ Never concatenate user input into SQL:**
```typescript
// Bad - vulnerable to SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);
```

**✅ Use parameterized queries:**
```typescript
// Good - safe from SQL injection
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// Or with Drizzle ORM
const user = await db.select().from(users).where(eq(users.id, userId));
```

### 5. XSS Prevention

**Sanitize HTML output:**
```typescript
// Bad - vulnerable to XSS
element.innerHTML = userInput;

// Good - escaped by default
element.textContent = userInput;

// Good - using a library for HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

**React/JSX (safe by default):**
```jsx
// Safe - React escapes by default
<div>{userInput}</div>

// Dangerous - only use with trusted content
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

### 6. Authentication & Authorization

**Password hashing:**
```typescript
import bcrypt from 'bcrypt';

// Good - hash passwords with salt
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

**JWT best practices:**
```typescript
// Good - short expiration, secure secret
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET, // Strong secret from env
  { expiresIn: '15m' } // Short expiration
);

// Verify tokens
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  // Token invalid or expired
}
```

**Session management:**
```typescript
// Good - secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JavaScript access
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
}));
```

### 7. API Security

**Rate limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

**CORS configuration:**
```typescript
import cors from 'cors';

// Good - specific origin
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Bad - allows all origins
app.use(cors({ origin: '*' })); // Only for public APIs
```

**Security headers:**
```typescript
import helmet from 'helmet';

// Good - security headers
app.use(helmet());
```

### 8. File Upload Security

**Validate file types:**
```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxSize = 5 * 1024 * 1024; // 5MB

function validateFile(file: File) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
}
```

**Store files securely:**
```typescript
// Good - rename files, store outside web root
import { randomBytes } from 'crypto';
import path from 'path';

const filename = `${randomBytes(16).toString('hex')}${path.extname(originalName)}`;
const uploadPath = path.join(__dirname, '../../uploads', filename);
```

### 9. Error Handling

**Don't expose stack traces in production:**
```typescript
// Good - safe error responses
app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
```

### 10. HTTPS & Transport Security

**Enforce HTTPS in production:**
```typescript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

**Use HSTS header:**
```typescript
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}));
```

## MCP Server Security

When using Model Context Protocol (MCP) servers with Claude Code:

**See [MCP_SECURITY.md](MCP_SECURITY.md) for comprehensive guidelines:**
- Threat model and attack vectors
- Server evaluation checklist
- Configuration best practices
- Enterprise governance patterns
- Incident response procedures

**Quick checklist:**
- [ ] Only use MCP servers from trusted sources
- [ ] Review server source code before approval
- [ ] Pin server versions in `.mcp.json`
- [ ] Never commit credentials in MCP configuration
- [ ] Scope filesystem access to project directory only
- [ ] Review all `.mcp.json` changes in pull requests
- [ ] Monitor server behavior and logs
- [ ] Keep servers updated with security patches

## Git Workflow Security

### Pre-Commit Hooks

This template includes pre-commit hooks that:
- Block direct commits to `main` branch
- Enforce feature branch workflow
- Ensure code review process

**Security benefit:** Prevents accidental commits of sensitive data or broken code to production.

### Branch Protection Rules

Configure in GitHub Settings → Branches:
- [ ] Require pull request reviews before merging
- [ ] Require status checks to pass before merging
- [ ] Require conversation resolution before merging
- [ ] Include administrators (no one bypasses)
- [ ] Do not allow force pushes
- [ ] Do not allow deletions

### Commit Signing (Optional but Recommended)

**GPG signature verification:**
```bash
# Generate GPG key
gpg --gen-key

# List keys
gpg --list-secret-keys --keyid-format LONG

# Configure git to use GPG
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# Add to GitHub
gpg --armor --export YOUR_KEY_ID
# Paste into GitHub Settings → SSH and GPG keys
```

## GitHub Security Features

### Enable Security Alerts

In repository settings:
- [ ] **Dependabot alerts** - Notifies of vulnerable dependencies
- [ ] **Dependabot security updates** - Auto-creates PRs for security fixes
- [ ] **Code scanning** - Automated security analysis (if available)
- [ ] **Secret scanning** - Detects committed secrets

### Security Advisories

- Report vulnerabilities via Security tab → Advisories
- Maintain private fork for developing fixes
- Coordinate disclosure with security team

## Checklist for New Projects

When creating a new project from this template:

### Initial Setup
- [ ] Review and customize `.gitignore`
- [ ] Create `.env.example` with all required variables
- [ ] Verify `.env` is in `.gitignore`
- [ ] Set up environment variables in deployment platform
- [ ] Enable GitHub security features
- [ ] Configure branch protection rules
- [ ] Install pre-commit hooks

### Code Security
- [ ] Implement input validation (Zod, Joi, Yup)
- [ ] Use parameterized queries or ORM
- [ ] Hash passwords with bcrypt (10+ rounds)
- [ ] Implement rate limiting on APIs
- [ ] Add security headers (helmet)
- [ ] Configure CORS appropriately
- [ ] Sanitize HTML output
- [ ] Validate file uploads

### Authentication & Authorization
- [ ] Implement secure authentication (JWT, sessions, OAuth)
- [ ] Use HTTPS only in production
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection
- [ ] Add authorization checks for protected resources
- [ ] Log security events (login attempts, permission changes)

### Dependency Security
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Use lock files (commit to version control)
- [ ] Set up automated dependency updates (Dependabot)
- [ ] Review dependencies before adding
- [ ] Pin versions for critical packages

### MCP Security (if using Claude Code)
- [ ] Review all MCP servers in `.mcp.json`
- [ ] Pin MCP server versions
- [ ] Scope filesystem access to project only
- [ ] Never commit credentials in MCP config
- [ ] Set up PR review process for `.mcp.json` changes
- [ ] Read [MCP_SECURITY.md](MCP_SECURITY.md) thoroughly

### Deployment Security
- [ ] Use HTTPS/TLS certificates
- [ ] Set secure environment variables
- [ ] Configure firewall rules
- [ ] Enable logging and monitoring
- [ ] Set up automated backups
- [ ] Implement disaster recovery plan
- [ ] Document incident response procedures

### Documentation
- [ ] Document security architecture
- [ ] Create runbook for common security issues
- [ ] Maintain list of third-party services and credentials
- [ ] Document data handling and privacy policies
- [ ] Create security incident response plan

## Common Vulnerabilities

### OWASP Top 10 (2021)

1. **Broken Access Control** - Implement proper authorization checks
2. **Cryptographic Failures** - Use HTTPS, hash passwords, encrypt sensitive data
3. **Injection** - Validate input, use parameterized queries
4. **Insecure Design** - Security by design, threat modeling
5. **Security Misconfiguration** - Secure defaults, minimal attack surface
6. **Vulnerable Components** - Keep dependencies updated
7. **Identification and Authentication Failures** - Strong auth, MFA, secure sessions
8. **Software and Data Integrity Failures** - Code signing, SRI, secure CI/CD
9. **Security Logging and Monitoring Failures** - Log security events, monitor alerts
10. **Server-Side Request Forgery (SSRF)** - Validate URLs, allowlist domains

### Prevention Checklist

- [ ] Input validation on all user data
- [ ] Output encoding/escaping
- [ ] Parameterized database queries
- [ ] Authentication and authorization checks
- [ ] Session management security
- [ ] Cryptographic best practices
- [ ] Error handling without information disclosure
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting and DDoS protection
- [ ] Regular security updates

## Security Tools

### Scanning & Analysis

**Dependency scanning:**
```bash
# npm
npm audit
npm audit fix

# Snyk (install globally)
npx snyk test
npx snyk monitor

# Socket Security
npx socket-npm audit
```

**Code scanning:**
```bash
# ESLint security plugin
npm install --save-dev eslint-plugin-security
```

**Secret scanning:**
```bash
# git-secrets (prevent committing secrets)
brew install git-secrets
git secrets --install
git secrets --register-aws

# truffleHog (find committed secrets)
docker run --rm -v "$(pwd):/pwd" trufflesecurity/trufflehog:latest github --repo https://github.com/your/repo
```

### Testing

**Security testing tools:**
- **OWASP ZAP** - Web application security scanner
- **Burp Suite** - Web security testing
- **npm audit** - Dependency vulnerabilities
- **Snyk** - Continuous security monitoring
- **SonarQube** - Code quality and security

## Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Template-Specific Guides
- [MCP_SECURITY.md](MCP_SECURITY.md) - MCP server security
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - Code quality and security patterns
- [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) - Git workflow and protection

### Security Training
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/) - Security learning platform
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) - Free security training
- [HackerOne CTF](https://www.hackerone.com/hackers/hacker101) - Capture the flag challenges

### Stay Updated
- [GitHub Security Lab](https://securitylab.github.com/)
- [NIST National Vulnerability Database](https://nvd.nist.gov/)
- [CVE Details](https://www.cvedetails.com/)
- [Snyk Vulnerability Database](https://security.snyk.io/)

## Disclosure Policy

### Coordinated Disclosure

We follow coordinated (responsible) disclosure:

1. **Report** - Security researcher reports vulnerability privately
2. **Acknowledge** - We acknowledge receipt within 48 hours
3. **Investigate** - We assess severity and develop fix
4. **Fix** - We implement and test the fix
5. **Release** - We release patched version
6. **Disclose** - Public disclosure after fix is available (typically 90 days)

### Public Disclosure

After the fix is released:
- Security advisory published on GitHub
- CVE assigned (if applicable)
- Credit given to researcher (if desired)
- Details shared with community

## Contact

For security concerns:
- **GitHub Security Advisories**: Repository Security tab
- **Email**: [Maintainer email from README]
- **Response Time**: Within 48 hours for acknowledgment

For general questions about security features of this template:
- Open a GitHub Discussion (not an issue)
- Reference relevant security documentation

---

**Last Updated:** 2025-11-21
**Version:** 1.0.0
**Maintained By:** Development Team

**Thank you for helping keep our projects secure!** 🔒
