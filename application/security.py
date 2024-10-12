from flask import current_app as app
from flask import jsonify, request
from application.models import db, Admins, ServiceProfessionals, Customers
import jwt

# Generate a token for the user
def generate_token(email):
    token = jwt.encode({
        'email': email
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# Decorator to check if the user is authenticated
def token_required(f):
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            if Admins.query.get(data['email']).first():
                current_user = Admins.query.get(data['email']).first()
            elif Customers.query.get(data['email']).first():
                current_user = Customers.query.get(data['email']).first()
            elif ServiceProfessionals.query.get(data['email']).first():
                current_user = ServiceProfessionals.query.get(data['email']).first
            else:
                return jsonify({'message': 'Token is invalid!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
