source /app/venv/bin/activate

export FLASK_APP=app/app.py

flask run --host=0.0.0.0 --port=5000 --reload &

sleep 5

flask db upgrade

python3 -m app.database.seeder

wait $!
