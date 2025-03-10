FROM python:3.9-slim

WORKDIR /app
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

COPY start.sh /start.sh
RUN chmod +x /start.sh

ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV SQLALCHEMY_DATABASE_URI=postgresql://root:your_password@postgres:5432/flask
ENV SQLALCHEMY_TRACK_MODIFICATIONS=False

EXPOSE 5000


CMD ["/start.sh"]
