import os
from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers
from application.security import generate_token, token_required

@app.post('/api/admin/service')
@token_required
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

@app.get('/api/admin/service-professionals/')
@token_required
def getUnapprovedServiceProfessionals():
    service_professionals = ServiceProfessionals.query.filter_by(admin_approved=0)
    return jsonify([service_professional.serialize() for service_professional in service_professionals]), 200

@app.post('/api/admin/service-professionals/')
@token_required
def approveServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    service_professional.admin_approved = 1
    db.session.commit()
    return jsonify('Service professional approved successfully'), 200

@app.delete('/api/admin/service-professionals/')
@token_required
def deleteServiceProfessional():
    email = request.json['email']
    service_professional = ServiceProfessionals.query.filter_by(email=email).first()
    db.session.delete(service_professional)
    db.session.commit()
    return jsonify('Service professional deleted successfully'), 200
