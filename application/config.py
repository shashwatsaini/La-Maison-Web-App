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
    
    REDIS_CACHE_FOLDER = os.path.join('redis_cache')

    if not os.path.exists(REDIS_CACHE_FOLDER):
        os.makedirs(REDIS_CACHE_FOLDER)

    CELERY_BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
    CELERY_RESULT_BACKEND = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

    SMTP_SENDER_EMAIL = keys['SMTP_SENDER_EMAIL']
    SMTP_SENDER_PASSWORD = keys['SMTP_SENDER_PASSWORD']
    SMTP_SERVER = keys['SMTP_SERVER']

    SERVICE_ICONS_UPLOAD_FOLDER = os.path.join('static', 'uploads', 'services')

    TASKS_DUMP_FOLDER = os.path.join('tasks_dump')

    if not os.path.exists(TASKS_DUMP_FOLDER):
        os.makedirs(TASKS_DUMP_FOLDER)
