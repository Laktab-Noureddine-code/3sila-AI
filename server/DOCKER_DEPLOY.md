# Docker Deployment Guide

## Building the Image

```bash
# Navigate to server directory
cd server

# Build the image (replace 'yourusername' with your Docker Hub username)
docker build -t yourusername/3sila-ai:latest .
```

## Running Locally

```bash
# Run with environment file
docker run -p 8000:8000 --env-file .env yourusername/3sila-ai:latest

# Or with inline environment variables
docker run -p 8000:8000 \
  -e GEMINI_API_KEY=your_key \
  -e SECRET_KEY=your_secret \
  -e DATABASE_URL=sqlite:///database.db \
  -e ENV=production \
  -e ALLOWED_ORIGINS=* \
  yourusername/3sila-ai:latest
```

## Pushing to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push the image
docker push yourusername/3sila-ai:latest
```

## Deploying to Production

### Option 1: Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  api:
    image: yourusername/3sila-ai:latest
    ports:
      - "8000:8000"
    env_file:
      - .env
    restart: unless-stopped
```

Run with: `docker-compose up -d`

### Option 2: Cloud Platforms

**Render / Railway / Fly.io:**

- Connect your GitHub repo
- Set environment variables in dashboard
- Deploy automatically

**AWS ECS / Google Cloud Run:**

- Push image to Docker Hub
- Create service using your image
- Configure environment variables

## Environment Variables

Required variables (see `.env.example`):

- `GEMINI_API_KEY` - Your Google Gemini API key
- `SECRET_KEY` - JWT secret (generate with `openssl rand -hex 32`)
- `DATABASE_URL` - Database connection string
- `ENV` - Environment mode (`development` or `production`)
- `ALLOWED_ORIGINS` - CORS allowed origins

## Health Check

Test the deployment:

```bash
curl http://localhost:8000/docs
```
