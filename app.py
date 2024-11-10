import logging
from flask import Flask
from celery_app_conf import create_celery_app
from application.config import DevelopmentConfig
from application.database import db
from application import redis_controllers

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ])

logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    with app.app_context():
        import application.controllers
        import application.customer_controllers
        import application.serviceProfessionals_controllers
        import application.util_controllers
        import application.admin_controllers

        # Print all registered routes
        for rule in app.url_map.iter_rules():
            logger.info(f'Registered route: {rule}')

        db.init_app(app)

        redis_controllers.updateServicesCache()
        redis_controllers.updateServiceProfessionalsCache()
        redis_controllers.updateCustomersCache()

    return app

app = create_app()
celery_app = create_celery_app(app)

if __name__ == '__main__':
    logger.info('----------------- Flask app is running! -----------------')

    app.run(port=app.config['PORT'])
