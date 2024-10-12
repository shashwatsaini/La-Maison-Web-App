from flask import current_app as app
from flask import jsonify, request, render_template
from application.models import db, Admins, Services, ServiceProfessionals, Customers
from application.security import generate_token, token_required

# Catch all routes and render the index.html file
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.post('/adminLogin')
def adminLogin():
    data = request.json
    email = data['email']
    password = data['password']

    if Admins.query.filter_by(email=email, password=password).first():
        token = generate_token(email)
        return jsonify({'token': token}), 200
    else:
        return jsonify('User not found.'), 404

# Not yet implemented
@app.post('/login')
def login():
    data = request.json
    email = data['email']
    password = data['password']

    if Customers.query.filter_by(email=email, password=password).first():
        token = generate_token(email)
        return jsonify({'token': token}), 200
    elif ServiceProfessionals.query.filter_by(email=email, password=password).first():
        token = generate_token(email)
        return jsonify({'token': token}), 200
    else:
        return jsonify('User not found.'), 404

# Registers a new user
@app.post('/register')
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
            service_type = data['serviceType']

            service_professional = ServiceProfessionals(email=email, name=name, password=password, description=description, service_type=service_type)
            db.session.add(service_professional)
            db.session.commit()
            return jsonify('Service professional created successfully'), 200
