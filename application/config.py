import os
from datetime import datetime, timedelta
import json

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True
    PORT = 4000

    SECRET_KEY = 'development_key'

    SQLITE_DB_DIR = os.path.join(basedir, '../db')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR, 'database.sqlite3')

    TOKEN_EXPIRATION = timedelta(hours=1)

    with open('keys.json') as f:
        keys = json.load(f)
        REDIS_HOST = keys['REDIS_LOCAL_HOST']
        REDIS_PORT = int(keys['REDIS_LOCAL_PORT'])

    CELERY_BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
    CELERY_RESULT_BACKEND = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

    SMTP_SENDER_EMAIL = keys['SMTP_SENDER_EMAIL']
    SMTP_SENDER_PASSWORD = keys['SMTP_SENDER_PASSWORD']
    SMTP_SERVER = keys['SMTP_SERVER']

    SERVICE_ICONS_UPLOAD_FOLDER = os.path.join('static', 'uploads', 'services')
