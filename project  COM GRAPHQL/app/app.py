from flask import Flask
from flask_graphql import GraphQLView  
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.graphql.schema import schema
from app.extensions import db
from flask_cors import CORS 
import os

def create_app():
    app = Flask(__name__)

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/flask')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['UPLOAD_FOLDER'] = 'uploads'



    db.init_app(app)
    migrate = Migrate(app, db)

    app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

    @app.after_request
    def after_request(response):
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    return app
