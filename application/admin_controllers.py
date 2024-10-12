import os
from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers
from application.security import generate_token, token_required

@app.post('/admin/service')
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
