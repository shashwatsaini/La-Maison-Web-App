import os
from datetime import datetime
from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers,ServiceRequests, CustomerRequests
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
    3: 'Paid'
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

@app.get('/api/customer/service-professionals/search')
@token_required
def searchServiceProfessionals():
    searchQuery = request.headers['searchQuery']
    service_professionals = ServiceProfessionals.query.filter(ServiceProfessionals.admin_approved==1, ServiceProfessionals.name.like(f"{searchQuery}%")).all()
    service_professionals += ServiceProfessionals.query.filter(ServiceProfessionals.admin_approved==1, ServiceProfessionals.location.like(f"%{searchQuery}%")).all()
    return jsonify([service_professional.serialize() for service_professional in service_professionals]), 200

# Accepted service requests
@app.get('/api/customer/requests')
@token_required
def getCustomerServiceRequests():
    token = request.headers['x-access-token']
    customer_id = get_email_from_token(token)
    service_requests = ServiceRequests.query.filter_by(customer_id=customer_id, status=0)
    return jsonify([service_request.serialize() for service_request in service_requests]), 200

@app.delete('/api/customer/requests')
@token_required
def deleteCustomerServiceRequests():
    id = request.json['id']

    service_request = ServiceRequests.query.filter_by(id=id).first()
    db.session.delete(service_request)
    db.session.commit()

    return jsonify('Service request deleted successfully'), 200

# Completed service requests
@app.get('/api/customer/requests/completed')
@token_required
def getCustomerCompletedServiceRequests():
    token = request.headers['x-access-token']
    customer_id = get_email_from_token(token)
    service_requests = ServiceRequests.query.filter_by(customer_id=customer_id, status=2)
    return jsonify([service_request.serialize() for service_request in service_requests]), 200

@app.patch('/api/customer/requests/completed')
@token_required
def rateServiceProfessional():
    id = request.json['id']
    remark = request.json['remark']
    rating = request.json['rating']

    service_request = ServiceRequests.query.filter_by(id=id).first()
    service_request.remark = remark
    service_request.rating = rating

    service_professional = ServiceProfessionals.query.filter_by(email=service_request.serviceProfessional_id).first()
    if service_professional.services_completed == 1:
        service_professional.rating = (service_professional.rating + rating) / (service_professional.services_completed + 1)
    else:
        service_professional.rating = ((service_professional.rating * (service_professional.services_completed)) + rating) / (service_professional.services_completed + 1)

    db.session.commit()

    return jsonify('Service request rated successfully'), 200

# Pending service requests
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

@app.patch('/api/customer/service-professionals/requests')
@token_required
def updateCustomerRequests():
    id = request.json['id']
    description = request.json['description']
    for_date = request.json['for_date']
    for_date = datetime.strptime(for_date, '%Y-%m-%d')

    customer_request = CustomerRequests.query.filter_by(id=id).first()
    customer_request.description = description
    customer_request.for_date = for_date
    db.session.commit()

    return jsonify('Service request updated successfully'), 200

@app.delete('/api/customer/service-professionals/requests')
@token_required
def deleteCustomerRequests():
    token = request.headers['x-access-token']
    customer_id = get_email_from_token(token)
    id = request.json['id']

    customer_request = CustomerRequests.query.filter_by(id=id, customer_id=customer_id).first()
    db.session.delete(customer_request)
    db.session.commit()

    return jsonify('Service request deleted successfully'), 200
