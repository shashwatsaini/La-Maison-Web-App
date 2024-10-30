from datetime import datetime
from application.database import db

class Services(db.Model):
    __tablename__ = 'Services'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String, nullable=False)
    icon_path = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'time_required': self.time_required,
            'description': self.description,
            'icon_path': self.icon_path
        }

class Admins(db.Model):
    __tablename__ = 'Admins'
    email = db.Column(db.String, primary_key=True)
    password = db.Column(db.String, nullable=False)

    # For flask-login
    def get_id(self):
        return str(self.email)

class Customers(db.Model):
    __tablename__ = 'Customers'
    email = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=db.func.now())
    address = db.Column(db.String, nullable=False)
    services_booked = db.Column(db.Integer, nullable=False, default=0)

    def serialize(self):
        return {
            'email': self.email,
            'name': self.name,
            'date_created': self.date_created,
            'address': self.address,
            'services_booked': self.services_booked
        }

    # For flask-login
    def get_id(self):
        return str(self.email)

class ServiceProfessionals(db.Model):
    __tablename__ = 'ServiceProfessionals'
    email = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=db.func.now())
    description = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    service_type = db.Column(db.Integer, nullable=False)
    experience = db.Column(db.Integer, nullable=False, default=0)
    services_completed = db.Column(db.Integer, nullable=False, default=0)
    admin_approved = db.Column(db.Integer, nullable=False, default=0)
    rating = db.Column(db.Float, nullable=False, default=5)

    def serialize(self):
        return {
            'email': self.email,
            'name': self.name,
            'date_created': self.date_created,
            'description': self.description,
            'location': self.location,
            'service_type': self.service_type,
            'experience': self.experience,
            'rating': self.rating,
            'services_completed': self.services_completed,
            'admin_approved': self.admin_approved,
            'service_name': Services.query.filter_by(id=self.service_type).first().name,
            'service_price': Services.query.filter_by(id=self.service_type).first().price,
            'icon_path': Services.query.filter_by(id=self.service_type).first().icon_path
        }

    # For flask-login
    def get_id(self):
        return str(self.email)
    
class ServiceRequests(db.Model):
    __tablename__ = 'ServiceRequests'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.String, db.ForeignKey('Customers.email'), nullable=False)
    serviceProfessional_id = db.Column(db.String, db.ForeignKey('ServiceProfessionals.email'), nullable=False)
    service_type = db.Column(db.Integer, db.ForeignKey('Services.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    for_date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String)
    status = db.Column(db.Integer, nullable=False, default=0)
    remark = db.Column(db.String)
    rating = db.Column(db.Integer)

    def serialize(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': Customers.query.filter_by(email=self.customer_id).first().name,
            'customer_address': Customers.query.filter_by(email=self.customer_id).first().address,
            'serviceProfessional_id': self.serviceProfessional_id,
            'serviceProfessional_name': ServiceProfessionals.query.filter_by(email=self.serviceProfessional_id).first().name,
            'serviceProfessional_description': ServiceProfessionals.query.filter_by(email=self.serviceProfessional_id).first().description,
            'serviceProfessional_rating': ServiceProfessionals.query.filter_by(email=self.serviceProfessional_id).first().rating,
            'service_type': self.service_type,
            'service_name': Services.query.filter_by(id=self.service_type).first().name,
            'price': self.price,
            'created_at': self.created_at.strftime('%Y-%m-%d'),
            'for_date': self.for_date.strftime('%Y-%m-%d'),
            'for_day': self.for_date.strftime('%A'),
            'description': self.description,
            'status': self.status,
            'remark': self.remark,
            'rating': self.rating
        }

class CustomerRequests(db.Model):
    __tablename__ = 'CustomerRequests'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.String, db.ForeignKey('Customers.email'), nullable=False)
    serviceProfessional_id = db.Column(db.String, db.ForeignKey('ServiceProfessionals.email'), nullable=False)
    service_type = db.Column(db.Integer, db.ForeignKey('Services.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    for_date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String)
    status = db.Column(db.Integer, nullable=False, default=0)

    def serialize(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': Customers.query.filter_by(email=self.customer_id).first().name,
            'customer_address': Customers.query.filter_by(email=self.customer_id).first().address,
            'serviceProfessional_id': self.serviceProfessional_id,
            'serviceProfessional_name': ServiceProfessionals.query.filter_by(email=self.serviceProfessional_id).first().name,
            'serviceProfessional_description': ServiceProfessionals.query.filter_by(email=self.serviceProfessional_id).first().description,
            'serviceProfessional_rating': ServiceProfessionals.query.filter_by(email=self.serviceProfessional_id).first().rating,
            'service_type': self.service_type,
            'service_name': Services.query.filter_by(id=self.service_type).first().name,
            'price': self.price,
            'created_at': self.created_at.strftime('%Y-%m-%d'),
            'for_date': self.for_date.strftime('%Y-%m-%d'),
            'for_day': self.for_date.strftime('%A'),
            'description': self.description,
            'status': self.status
        }
