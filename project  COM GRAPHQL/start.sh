
flask run --host=0.0.0.0 --port=5000 --reload &

flask db upgrade 

python3 -m app.database.seeder

wait $!
