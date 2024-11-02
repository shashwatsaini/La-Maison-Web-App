import os
from datetime import datetime, timedelta
import json

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False

    TOKEN_EXPIRATION = timedelta(hours=1)
    REDIS_PORT = 14844
    with open('keys.json') as f:
        keys = json.load(f)
        REDIS_HOST = keys['REDIS_HOST']
        REDIS_PASSWORD = keys['REDIS_PASSWORD']

    SERVICE_ICONS_UPLOAD_FOLDER = os.path.join('static', 'uploads', 'services')

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'development_key'
    SQLITE_DB_DIR = os.path.join(basedir, '../db')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR, 'database.sqlite3')