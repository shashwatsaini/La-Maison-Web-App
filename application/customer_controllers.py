import os
from datetime import datetime
from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers, CustomerRequests
from application.security import generate_token, token_required, get_email_from_token

CustomerRequests_status = {
    0: 'Pending',
    1: 'Rejected',
    2: 'Accepted'
}

@app.get('/api/customer/')
@token_required
def getCustomer():
    token = request.headers['x-access-token']
    email = get_email_from_token(token)
    customer = Customers.query.filter_by(email=email).first()
    return jsonify(customer.serialize()), 200

@app.get('/api/customer/service-professionals/')
@token_required
def getServiceProfessionals():
    service_professionals = ServiceProfessionals.query.filter_by(admin_approved=1)
    return jsonify([service_professional.serialize() for service_professional in service_professionals]), 200

@app.get('/api/customer/service-professionals/requests')
@token_required
def getCustomerRequests():
    token = request.headers['x-access-token']
    customer_id = get_email_from_token(token)
    customer_requests = CustomerRequests.query.filter_by(customer_id=customer_id, status=0)
    return jsonify([customer_request.serialize() for customer_request in customer_requests]), 200

@app.post('/api/customer/service-professionals/requests')
@token_required
def requestServiceProfessional():
    token = request.headers['x-access-token']
    customer_id = get_email_from_token(token)
    serviceProfessional_id = request.json['serviceProfessional_id']
    service_type = request.json['service_type']
    price = request.json['price']
    for_date = request.json['for_date']
    for_date = datetime.strptime(for_date, '%Y-%m-%d')
    description = request.json['description']

    customer_request = CustomerRequests(customer_id=customer_id, serviceProfessional_id=serviceProfessional_id, service_type=service_type, price=price, for_date=for_date, description=description)
    db.session.add(customer_request)
    db.session.commit()

    return jsonify('Service requested successfully'), 200

@app.put('/api/customer/service-professionals/requests')
@token_required
def updateCustomerRequests():
    token = request.headers['x-access-token']
    customer_id = get_email_from_token(token)
    id = request.json['id']
    description = request.json['description']
    for_date = request.json['for_date']
    for_date = datetime.strptime(for_date, '%Y-%m-%d')

    customer_request = CustomerRequests.query.filter_by(id=id, customer_id=customer_id).first()
    customer_request.description = description
    customer_request.for_date = for_date
    db.session.commit()

    return jsonify('Service request updated successfully'), 200
