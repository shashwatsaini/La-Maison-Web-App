import os
from datetime import datetime
from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers, ServiceRequests, CustomerRequests
from application.security import generate_token, token_required, get_email_from_token

CustomerRequests_status = {
    0: 'Pending',
    1: 'Rejected',
    2: 'Accepted'
}

ServiceRequests_status = {
    0: 'Pending',
    1: 'Rejected',
    2: 'Completed',
}

@app.get('/api/service-professional')
@token_required
def getServiceProfessional():
    token = request.headers['x-access-token']
    email = get_email_from_token(token)
    customer = ServiceProfessionals.query.filter_by(email=email).first()
    return jsonify(customer.serialize()), 200

@app.get('/api/service-professionals/requests')
@token_required
def getServiceProfessionalRequests():
    token = request.headers['x-access-token']
    serviceProfessional_id = get_email_from_token(token)
    service_requests = ServiceRequests.query.filter_by(serviceProfessional_id=serviceProfessional_id, status=0)
    return jsonify([service_request.serialize() for service_request in service_requests]), 200

@app.patch('/api/service-professionals/requests')
@token_required
def completeServiceRequest():
    id = request.json['id']
    service_request = ServiceRequests.query.filter_by(id=id).first()
    service_request.status = 2
    db.session.commit()
    return jsonify('Service request completed successfully'), 200

@app.get('/api/service-professionals/customer/requests')
@token_required
def getCustomerRequestsForServiceProfessional():
    token = request.headers['x-access-token']
    serviceProfessional_id = get_email_from_token(token)
    customer_requests = CustomerRequests.query.filter_by(serviceProfessional_id=serviceProfessional_id, status=0)
    return jsonify([customer_request.serialize() for customer_request in customer_requests]), 200

@app.post('/api/service-professionals/customer/requests/accept')
@token_required
def acceptCustomerRequest():
    token = request.headers['x-access-token']
    serviceProfessional_id = get_email_from_token(token)
    id = request.json['id']

    customer_request = CustomerRequests.query.filter_by(id=id).first()
    customer_request.status = 2

    service_request = ServiceRequests(customer_id=customer_request.customer_id, serviceProfessional_id=serviceProfessional_id, service_type=customer_request.service_type, price=customer_request.price, for_date=customer_request.for_date, description=customer_request.description)
    db.session.add(service_request)

    db.session.commit()
    return jsonify('Request accepted successfully'), 200

@app.patch('/api/service-professionals/customer/requests/reject')
@token_required
def rejectCustomerRequest():
    token = request.headers['x-access-token']
    serviceProfessional_id = get_email_from_token(token)
    id = request.json['id']

    customer_request = CustomerRequests.query.filter_by(id=id).first()
    customer_request.status = 1

    db.session.commit()
    return jsonify('Request rejected successfully'), 200
