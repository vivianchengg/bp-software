from flask_mail import Mail
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy

api = Api()
db = SQLAlchemy()
MAIL = Mail()