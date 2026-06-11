FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy ONLY the backend requirements first (this caches the installation)
COPY backend/requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend /app/backend

# Expose Hugging Face's mandatory internal port
EXPOSE 7860

# Run FastAPI app with uvicorn on port 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]