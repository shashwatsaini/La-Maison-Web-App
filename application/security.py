from functools import wraps
from flask import current_app as app
from flask import jsonify, request
from application.models import db, Admins, ServiceProfessionals, Customers
import jwt
from datetime import datetime

# Generate a token for the user
def generate_token(email):
    expiration = datetime.utcnow() + app.config['TOKEN_EXPIRATION']
    token = jwt.encode({
        'email': email,
        'exp': expiration
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# Decorator to check if the user is authenticated
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Missing authentication!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            email = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired, please login again.'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        # Check if the user exists in any of the possible user models
        current_user = None
        if Admins.query.get(email):
            current_user = Admins.query.get(email)
        elif Customers.query.get(email):
            current_user = Customers.query.get(email)
        elif ServiceProfessionals.query.get(email):
            current_user = ServiceProfessionals.query.get(email)
        else:
            return jsonify({'message': 'User unauthorized!'}), 401
        
        return f(*args, **kwargs)

    return decorated

# Gets email from token, once authenticated
def get_email_from_token(token):
    data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    return data['email']
