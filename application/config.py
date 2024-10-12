import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False
    SERVICE_ICONS_UPLOAD_FOLDER = os.path.join('static', 'uploads', 'services')

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'development_key'
    SQLITE_DB_DIR = os.path.join(basedir, '../db')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR, 'database.sqlite3')
    