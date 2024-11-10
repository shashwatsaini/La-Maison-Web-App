from celery import Celery, Task
from celery.schedules import crontab
from flask import Flask, current_app as app

def create_celery_app(app):
    class ContextTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
            
    celery = Celery(
        app.import_name,
        task_cls=ContextTask,
        broker=app.config['CELERY_BROKER_URL'],
        backend=app.config['CELERY_RESULT_BACKEND']
    )
    celery.conf.update(
        broker_url=app.config['CELERY_BROKER_URL'],
        result_backend=app.config['CELERY_RESULT_BACKEND']
    )

    # Beat for scheduling tasks
    celery.conf.beat_schedule = {
        'send-service-professional-notifs-every-day-8am': {
            'task': 'tasks.sendServiceProfessionalNotifs',
            'schedule': crontab(hour=8, minute=0),
        },
    }

    celery.conf.timezone = 'Asia/Kolkata'
    
    celery.Task = ContextTask
    return celery
