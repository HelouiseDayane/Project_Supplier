
#gunicorn -w 4 -b 0.0.0.0:5000 app:app &

sleep 5

echo "Esperando o banco de dados estar pronto..."
until flask db upgrade; do
  echo "Esperando o banco de dados estar pronto..."
  sleep 5
done


python3 -m app.database.seeder


wait $!
