from flask import Flask
from flask_cors import CORS
from .extensions import api, db, MAIL
from .routes import ns_app, ns_pat,ns_auth
from dotenv import load_dotenv
import os 


"""
This module initializes the Flask application and its extensions.
Functions:
    create_app(): Creates and configures the Flask application.
Dependencies:
    - Flask: The web framework used to create the application.
    - flask_cors: A Flask extension for handling Cross-Origin Resource Sharing (CORS).
    - .extensions: Module containing the initialized extensions (api, db, MAIL).
    - .routes: Module containing the API namespaces (ns_app, ns_pat, ns_auth).
    - dotenv: Module for loading environment variables from a .env file.
    - os: Standard library module for interacting with the operating system.
Environment Variables:
    - MAIL_USERNAME: The username for the mail server.
    - MAIL_PASSWORD: The password for the mail server.
    - MAIL_DEFAULT_SENDER: The default sender email address.
    - J_URI: The database URI for SQLAlchemy.
"""
def create_app(testing=False):
    app = Flask(__name__)
    CORS(app)

    load_dotenv()
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    
    if testing:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('J_URI')
        
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    api.init_app(app, version="1.1", title="BP Service", description="API for BP Service")
    api.add_namespace(ns_app)
    api.add_namespace(ns_pat)
    api.add_namespace(ns_auth)
    db.init_app(app)
    MAIL.init_app(app)

    return app

