from flask import Flask
from application.config import DevelopmentConfig
from application.database import db
from application import redis_controllers

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    with app.app_context():
        import application.controllers
        import application.admin_controllers
        import application.customer_controllers
        import application.serviceProfessionals_controllers
        import application.redis_controllers
        import application.util_controllers

        db.init_app(app)

        redis_controllers.updateServicesCache()
        redis_controllers.updateServiceProfessionalsCache()

    return app

app = create_app()

if __name__ == '__main__':

    app.run(port=4000)
