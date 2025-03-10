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

COPY . .

ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV SQLALCHEMY_DATABASE_URI=postgresql://root:your_password@postgres:5432/flask
ENV SQLALCHEMY_TRACK_MODIFICATIONS=False


EXPOSE 5000

RUN python3 -m venv /app/venv

CMD /bin/bash -c "source /app/venv/bin/activate && flask run --host=0.0.0.0 --port=5000 --reload & \
                  sleep 5 && \
                  flask db upgrade && \
                  python3 -m app.database.seeder && \
                  wait $!"
