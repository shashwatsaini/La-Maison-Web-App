from datetime import datetime
from flask import current_app as app
from flask import jsonify, request
from application.models import db, Services, ServiceProfessionals, Customers, ServiceRequests, CustomerRequests, API_Log
from application.security import token_required, log_api_call

@app.get('/api/admin/stats/overview')
@token_required
@log_api_call
def getOverviewStats():
    month = datetime.now().month
    day = datetime.now().day

    total_customers = Customers.query.count()
    total_service_professionals = ServiceProfessionals.query.count()
    total_services = Services.query.count()
    total_service_requests = ServiceRequests.query.count()
    total_customer_requests = CustomerRequests.query.count()
    monthly_revenue = ServiceRequests.query.with_entities(db.func.sum(ServiceRequests.price)).filter(ServiceRequests.status == 3, ServiceRequests.created_at.like(f'%-{month}-%')).scalar()
    total_revenue = ServiceRequests.query.with_entities(db.func.sum(ServiceRequests.price)).filter(ServiceRequests.status == 3).scalar()

    total_site_visits = API_Log.query.filter(API_Log.referrer.like(f"%{app.config['PORT']}/")).count()
    total_logins = API_Log.query.filter(API_Log.path.like('%login%')).count()
    total_api_requests = API_Log.query.count()
    average_api_latency = API_Log.query.with_entities(db.func.avg(API_Log.response_time)).scalar()
    average_api_latency = round(average_api_latency, 2)
    daily_site_visits = API_Log.query.filter(API_Log.referrer.like(f"%{app.config['PORT']}/"), API_Log.date.like(f'%-{day}%')).count()
    daily_logins = API_Log.query.filter(API_Log.path.like('%login%'), API_Log.date.like(f'%-{day}%')).count()
    daily_api_requests = API_Log.query.filter(API_Log.date.like(f'%-{day}%')).count()
    daily_average_api_latency = API_Log.query.with_entities(db.func.avg(API_Log.response_time)).filter(API_Log.date.like(f'%-{day}%')).scalar()
    daily_average_api_latency = round(daily_average_api_latency, 2)

    return jsonify({
        'total_users': total_customers + total_service_professionals,
        'total_customers': total_customers,
        'total_service_professionals': total_service_professionals,
        'total_services': total_services,
        'total_service_requests': total_service_requests,
        'total_customer_requests': total_customer_requests,
        'monthly_revenue': monthly_revenue,
        'total_revenue': total_revenue,

        'total_site_visits': total_site_visits,
        'total_logins': total_logins,
        'total_api_requests': total_api_requests,
        'average_api_latency': average_api_latency,
        'daily_site_visits': daily_site_visits,
        'daily_logins': daily_logins,
        'daily_api_requests': daily_api_requests,
        'daily_average_api_latency': daily_average_api_latency
    })
