from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers
from application.security import generate_token, log_api_call

# Catch all routes and render the index.html file
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.post('/api/admin/login')
@log_api_call
def adminLogin():
    data = request.json
    email = data['email']
    password = data['password']

    if Admins.query.filter_by(email=email, password=password).first():
        token = generate_token(email)
        return jsonify({'token': token}), 200
    else:
        return jsonify('User not found.'), 404

@app.post('/api/login')
@log_api_call
def login():
    data = request.json
    email = data['email']
    password = data['password']

    if Customers.query.filter_by(email=email, password=password, admin_action = 0).first():
        token = generate_token(email)
        return jsonify({'token': token, 'user_type': 0}), 200
    elif Customers.query.filter_by(email=email, password=password, admin_action = 1).first():
        token = generate_token(email)
        return jsonify({'message': 'User has been blocked and is under review. If you think this is a mistake, please contact the admin.', 'user_type': 0}), 405
    elif Customers.query.filter_by(email=email, password=password, admin_action = 2).first():
        token = generate_token(email)   
        return jsonify({'message': 'User has been blocked and deleted, post review. If you think this is a mistake, please contact the admin.', 'user_type': 0}), 405 
    elif ServiceProfessionals.query.filter_by(email=email, password=password, admin_approved = 1).first():
        token = generate_token(email)
        return jsonify({'token': token, 'user_type': 1}), 200
    elif ServiceProfessionals.query.filter_by(email=email, password=password, admin_approved = 2).first():
        token = generate_token(email)
        return jsonify({'message': 'User has been blocked and is under review. If you think this is a mistake, please contact the admin.', 'user_type': 1}), 405
    elif ServiceProfessionals.query.filter_by(email=email, password=password, admin_approved = 3).first():
        token = generate_token(email)
        return jsonify({'message': 'User has been blocked and deleted, post review. If you think this is a mistake, please contact the admin.', 'user_type': 1}), 405
    else:
        return jsonify('User not found.'), 404

# Registers a new user
@app.post('/api/register')
@log_api_call
def register():
    data = request.json
    
    if data['registerType'] == 0:
        if Customers.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already in use.'}), 400

        else:
            email = data['email']
            name = data['name']
            password = data['password']
            address = data['address']

            customer = Customers(email=email, name=name, password=password, address=address)
            db.session.add(customer)
            db.session.commit()
            return jsonify('Customer created successfully'), 200
    
    elif data['registerType'] == 1:
        if ServiceProfessionals.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already in use.'}), 400
        
        else:
            email = data['email']
            name = data['name']
            password = data['password']
            description = data['description']
            location = data['location']
            service_type = data['serviceType']
            admin_approved = 0

            service_professional = ServiceProfessionals(email=email, name=name, password=password, description=description, location=location, service_type=service_type, admin_approved=admin_approved)
            db.session.add(service_professional)
            db.session.commit()
            return jsonify('Service professional created successfully'), 200
