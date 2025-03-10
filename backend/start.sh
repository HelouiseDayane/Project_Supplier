#!/bin/bash

# Ativar o ambiente virtual
source /app/venv/bin/activate

# Rodar o servidor Flask
flask run --host=0.0.0.0 --port=5000 --reload &

# Aguardar para garantir que o servidor tenha iniciado
sleep 5

# Realizar o upgrade do banco de dados
flask db upgrade

# Rodar o seed do banco de dados
python3 -m app.database.seeder

# Aguardar até o fim da execução do Flask
wait $!
