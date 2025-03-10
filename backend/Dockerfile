FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN python3 -m venv venv

RUN /bin/bash -c "source /app/venv/bin/activate && pip install -r requirements.txt"

RUN chmod +x start.sh

CMD ["./start.sh"]
