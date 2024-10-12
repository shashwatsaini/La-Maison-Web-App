from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers

# Gets all services
@app.get('/services')
def services():
    services = Services.query.all()
    return jsonify([service.serialize() for service in services])
