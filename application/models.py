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
    service_type = db.Column(db.String, nullable=False)
    experience = db.Column(db.Integer, nullable=False, default=0)
    services_completed = db.Column(db.Integer, nullable=False, default=0)
    admin_approved = db.Column(db.Integer, nullable=False, default=0)

    def serialize(self):
        return {
            'email': self.email,
            'name': self.name,
            'date_created': self.date_created,
            'description': self.description,
            'service_type': self.service_type,
            'experience': self.experience,
            'services_completed': self.services_completed,
            'admin_approved': self.admin_approved,
            'service_name': Services.query.filter_by(id=self.service_type).first().name,
            'icon_path': Services.query.filter_by(id=self.service_type).first().icon_path
        }

    # For flask-login
    def get_id(self):
        return str(self.email)
