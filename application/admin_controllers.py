import os
from celery_app_conf import create_celery_app
from flask import current_app as app
from flask import jsonify, request, send_file
from celery.result import AsyncResult
from tasks import sendServiceProfessionalNotifs, sendServiceProfessionalReports, sendCustomerReports, exportServiceProfessionalAsCSV
from sqlalchemy import event
from application.models import db, Services, ServiceProfessionals, Customers, ServiceRequests, CustomerRequests
from application.security import token_required, log_api_call
from application.redis_controllers import createClient, clearCache,updateServicesCache, updateServiceProfessionalsCache, updateCustomersCache
import json

# Event listeners to update Redis cache

@event.listens_for(Services, 'after_update')
@event.listens_for(Services, 'after_delete')
def update_services_cache(mapper, connection, target):
    updateServicesCache()

@event.listens_for(Services, 'before_insert')
def update_services_cache(mapper, connection, target):
    # Set the id to the id of the last row + 1
    last_service = Services.query.order_by(Services.id.desc()).first()
    target.id = (last_service.id + 1) if last_service else 1

    updateServicesCache()

@event.listens_for(ServiceProfessionals, 'after_insert')
@event.listens_for(ServiceProfessionals, 'after_update')
@event.listens_for(ServiceProfessionals, 'after_delete')
def update_services_cache(mapper, connection, target):
    updateServiceProfessionalsCache()

@event.listens_for(Customers, 'after_insert')
@event.listens_for(Customers, 'after_update')
@event.listens_for(Customers, 'after_delete')
def update_services_cache(mapper, connection, target):
    updateCustomersCache()

ServiceProfessional_admin_approved = {
    0: 'Pending',
    1: 'Approved',
    2: 'Under Review',
    3: 'Deleted'
}

Customers_admin_action = {
    0: 'Default',
    1: 'Blocked',
    2: 'Deleted'
}

# Celery tasks
celery_app = create_celery_app(app)

@app.post('/api/admin/tasks/send-service-professional-notifs')
@token_required
@log_api_call
def startSendServiceProfessionalNotifs():
    task = sendServiceProfessionalNotifs.delay()
    return jsonify({'task_id': task.id}), 200

@app.get('/api/admin/tasks/send-service-professional-notifs/<task_id>')
@token_required 
@log_api_call
def getSendServiceProfessionalNotifs(task_id):
    task = celery_app.AsyncResult(task_id)
    return jsonify({'status': task.status, 'result': task.result}), 200

@app.post('/api/admin/tasks/send-service-professional-reports')
@token_required
@log_api_call
def startSendServiceProfessionalReports():
    task = sendServiceProfessionalReports.delay()
    return jsonify({'task_id': task.id}), 200

@app.get('/api/admin/tasks/send-service-professional-reports/<task_id>')
@token_required 
@log_api_call
def getSendServiceProfessionalReports(task_id):
    task = celery_app.AsyncResult(task_id)
    return jsonify({'status': task.status, 'result': task.result}), 200

@app.post('/api/admin/tasks/send-customer-reports')
@token_required
@log_api_call
def startSendCustomerReports():
    task = sendCustomerReports.delay()
    return jsonify({'task_id': task.id}), 200

@app.get('/api/admin/tasks/send-customer-reports/<task_id>')
@token_required 
@log_api_call
def getSendCustomerReports(task_id):
    task = celery_app.AsyncResult(task_id)
    return jsonify({'status': task.status, 'result': task.result}), 200

@app.post('/api/admin/tasks/export-service-professional-as-csv')
@token_required
@log_api_call
def startExportServiceProfessionalAsCSV():
    id = request.json['id']
    task = exportServiceProfessionalAsCSV.delay(id)
    return jsonify({'task_id': task.id}), 200

@app.get('/api/admin/tasks/export-service-professional-as-csv/<task_id>')
@token_required
@log_api_call
def getExportServiceProfessionalAsCSV(task_id):
    task = celery_app.AsyncResult(task_id)
    print(task.state)
    if task.state == 'SUCCESS':
        return jsonify({'status': task.status, 'result': task.result}), 200
    else:
        return jsonify({'status': task.status}), 202

@app.get('/api/admin/tasks/export-service-professional-as-csv/download/<task_id>')
@token_required
@log_api_call
def downloadExportServiceProfessionalAsCSV(task_id):
    task = celery_app.AsyncResult(task_id)
    if task.state == 'SUCCESS':
        file_path = task.result.get('file_path')
        if file_path and os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'File not found or task not completed'}), 404

@app.post('/api/admin/service')
@token_required
@log_api_call
def addService():
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    time_required = request.form.get('timeRequired')
    icon_path = ''

    try:
        icon = request.files['icon']
        if icon:
            with open(os.path.join(app.config['SERVICE_ICONS_UPLOAD_FOLDER'], icon.filename), 'wb') as f:
                f.write(icon.read())
            icon_path = os.path.join(app.config['SERVICE_ICONS_UPLOAD_FOLDER'], icon.filename)
    except Exception as e:
        return jsonify({'message': 'Icon upload failed.'}), 400

    try:
        service = Services(name=name, description=description, price=price, time_required=time_required, icon_path=icon_path)
        db.session.add(service)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    return jsonify('Service added successfully'), 200

@app.patch('/api/admin/service')
@token_required
@log_api_call
def modifyService():
    id = int(request.form.get('id'))
    service = Services.query.filter_by(id=id).first()
    if request.form.get('name'):
        name = request.form.get('name')
        service.name = name
    if request.form.get('description'):
        description = request.form.get('description')
        service.description = description
    if request.form.get('price'):
        price = int(request.form.get('price'))
        service.price = price
    if request.form.get('timeRequired'):
        time_required = int(request.form.get('timeRequired'))
        service.time_required = time_required
    icon_path = ''

    try:
        if request.files:
            icon = request.files['icon']
            if icon:
                with open(os.path.join(app.config['SERVICE_ICONS_UPLOAD_FOLDER'], icon.filename), 'wb') as f:
                    f.write(icon.read())
                icon_path = os.path.join(app.config['SERVICE_ICONS_UPLOAD_FOLDER'], icon.filename)
                service.icon_path = icon_path
            else:
                pass
    except Exception as e:
        return jsonify({'message': 'Icon upload failed.'}), 400

    db.session.commit()

    return jsonify('Service modified successfully'), 200

@app.delete('/api/admin/service')
@token_required
@log_api_call
def deleteService():
    id = int(request.json['id'])
    service = Services.query.filter_by(id=id).first()
    service_professionals = ServiceProfessionals.query.filter_by(service_type=id)
    if service_professionals.count() > 0:
        return jsonify({'message':'Service has service professionals associated with it. Please delete them first.'}), 400
    
    db.session.delete(service)   
    db.session.commit()
    return jsonify('Service deleted successfully'), 200

@app.get('/api/admin/service')
@token_required
@log_api_call
def getServices():
    services = Services.query.all()
    return jsonify([service.serialize() for service in services]), 200

@app.get('/api/admin/service-professionals/')
@token_required
@log_api_call
def getUnapprovedServiceProfessionals():
    service_professionals = ServiceProfessionals.query.filter_by(admin_approved=0)
    return jsonify([service_professional.serialize() for service_professional in service_professionals]), 200

@app.post('/api/admin/service-professionals/')
@token_required
@log_api_call
def approveServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    service_professional.admin_approved = 1
    db.session.commit()
    return jsonify('Service professional approved successfully'), 200

@app.delete('/api/admin/service-professionals/')
@token_required
@log_api_call
def deleteServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    db.session.delete(service_professional)
    db.session.commit()
    return jsonify('Service professional deleted successfully'), 200

# Redis cached
@app.post('/api/admin/service-professionals/search')
@token_required
@log_api_call
def getServiceProfessionalsForAdmin():
    r = createClient()
    serviceProfessional_keys = r.keys('service_professional:*')
    service_professionals = []
    for key in serviceProfessional_keys:
        service_professional_json = r.get(key)
        if service_professional_json:
            service_professional_dict = json.loads(service_professional_json)
            service_professionals.append(service_professional_dict)
    return jsonify(service_professionals), 200

@app.patch('/api/admin/service-professionals/block')
@token_required
@log_api_call
def blockServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    service_professional.admin_approved = 2
    db.session.commit()
    return jsonify('Service professional blocked successfully'), 200

@app.patch('/api/admin/service-professionals/unblock')
@token_required
@log_api_call
def unblockServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    service_professional.admin_approved = 1
    db.session.commit()
    return jsonify('Service professional unblocked successfully'), 200

@app.delete('/api/admin/service-professionals/block')
@token_required
@log_api_call
def deleteBlockedServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    service_professional.admin_approved = 3

    service_requests = ServiceRequests.query.filter_by(serviceProfessional_id=email).all()
    for service_request in service_requests:
        db.session.delete(service_request)

    customer_requests = CustomerRequests.query.filter_by(serviceProfessional_id=email).all()
    for customer_request in customer_requests:
        db.session.delete(customer_request)
        
    db.session.commit()
    return jsonify('Service professional deleted successfully'), 200

# Redis cached
@app.post('/api/admin/customers/search')
@token_required
@log_api_call
def getCustomersForAdmin():
    r = createClient()
    customer_keys = r.keys('customer:*')
    customers = []
    for key in customer_keys:
        customer_json = r.get(key)
        if customer_json:
            customer_dict = json.loads(customer_json)
            customers.append(customer_dict)
    return jsonify(customers), 200

@app.patch('/api/admin/customers/block')
@token_required
@log_api_call
def blockCustomer():
    email = request.json['email']
    customer = Customers.query.filter_by(email=email).first()
    customer.admin_action = 1
    db.session.commit()
    return jsonify('Customer blocked successfully'), 200

@app.patch('/api/admin/customers/unblock')
@token_required
@log_api_call
def unblockCustomer():
    email = request.json['email']
    customer = Customers.query.filter_by(email=email).first()
    customer.admin_action = 0
    db.session.commit()
    return jsonify('Customer unblocked successfully'), 200

@app.delete('/api/admin/customers/block')
@token_required
@log_api_call
def deleteBlockedCustomer():
    email = request.json['email']
    customer = Customers.query.filter_by(email=email).first()
    customer.admin_action = 2

    service_requests = ServiceRequests.query.filter_by(customer_id=email).all()
    for service_request in service_requests:
        db.session.delete(service_request)

    customer_requests = CustomerRequests.query.filter_by(customer_id=email).all()
    for customer_request in customer_requests:
        db.session.delete(customer_request)
        
    db.session.commit()
    return jsonify('Customer deleted successfully'), 200
