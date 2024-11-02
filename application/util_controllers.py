from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers
from application.redis_controllers import createClient
import json

# Gets all services
# Redis cached
@app.get('/api/services')
def services():
    r = createClient()
    service_keys = r.keys('service:*')
    services = []
    for key in service_keys:
        service_json = r.get(key)
        if service_json:
            service_dict = json.loads(service_json)
            services.append(service_dict)
            
    return jsonify(services), 200
