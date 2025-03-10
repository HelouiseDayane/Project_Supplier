FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

RUN chmod +x start.sh

CMD ["./start.sh"]
