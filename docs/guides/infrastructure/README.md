# Infrastructure Guides

Setup, deployment, and operational procedures for managing project infrastructure.

## Guides

| Guide | Description |
|-------|-------------|
| **[Database Setup](DATABASE_SETUP.md)** | PostgreSQL, MySQL, SQLite, MongoDB - local & cloud |
| **[Docker Guide](DOCKER_GUIDE.md)** | Containerization, Compose, multi-stage builds |
| [Deployment Guide](DEPLOYMENT_GUIDE.md) | CI/CD pipelines and hosting setup |
| [Incident Response](INCIDENT_RESPONSE.md) | Production issue handling procedures |
| [Monitoring & Observability](MONITORING_OBSERVABILITY.md) | Sentry, logging, and error tracking |
| [Environment Management](ENVIRONMENT_MANAGEMENT.md) | Env vars, secrets, and dev containers |

## Getting Started

### Setting Up a Database?
1. Follow [Database Setup](DATABASE_SETUP.md) for your database choice
2. Configure `DATABASE_URL` in `.env.local`
3. Run `npx prisma db push` to sync schema

### Using Docker?
1. Follow [Docker Guide](DOCKER_GUIDE.md)
2. Use `docker-compose up` for development
3. Use multi-stage Dockerfile for production

### Production Issue?
1. **Immediately** go to [Incident Response](INCIDENT_RESPONSE.md)
2. Follow severity assessment and communication protocols

### Setting Up Deployment?
1. Follow [Deployment Guide](DEPLOYMENT_GUIDE.md)
2. Configure environment variables per [Environment Management](ENVIRONMENT_MANAGEMENT.md)
3. Set up monitoring per [Monitoring & Observability](MONITORING_OBSERVABILITY.md)

### Managing Secrets?
1. Review [Environment Management](ENVIRONMENT_MANAGEMENT.md)
2. Understand dev container limitations
3. Set up proper secret rotation
