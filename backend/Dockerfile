FROM python:3.11-slim

# Prevent Python from buffering stdout/stderr (critical for SSE & logging)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (overridden by $PORT on Render/Railway)
EXPOSE 8000

# Run migrations then start uvicorn
# $PORT is injected by Render/Railway at runtime
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
