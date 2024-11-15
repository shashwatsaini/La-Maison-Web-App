from flask import current_app as app
from flask import jsonify
from application.models import db, Admins, Services, ServiceRequests, ServiceProfessionals, Customers, CustomerRequests

import redis
import json

def createClient():
    return redis.Redis(host=app.config['REDIS_HOST'], port=app.config['REDIS_PORT'])

def clearCache():
    r = createClient()
    r.flushall()

def updateServicesCache():
    r = createClient()
    services = Services.query.all()
    for service in services:
        r.set(f"service:{service.id}", json.dumps(service.serialize()))

def updateServiceProfessionalsCache():
    r = createClient()
    service_professionals = ServiceProfessionals.query.all()
    for service_professional in service_professionals:
        service_professional_serialized = service_professional.serialize()
        service_professional_serialized['date_created'] = str(service_professional_serialized['date_created']) # JSON can't handle datetime
        r.set(f"service_professional:{service_professional.email}", json.dumps(service_professional_serialized))

def updateCustomersCache():
    r = createClient()
    customers = Customers.query.all()
    for customer in customers:
        customer_serialized = customer.serialize()
        customer_serialized['date_created'] = str(customer_serialized['date_created'])
        r.set(f"customer:{customer.email}", json.dumps(customer_serialized))
