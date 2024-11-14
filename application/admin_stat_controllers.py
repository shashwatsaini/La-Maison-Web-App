from datetime import datetime, timedelta
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

@app.get('/api/admin/stats/distributions')
@log_api_call
def getUserDistributionStats():

    '''Stats for Service Requests'''
    # Get the list of all services
    services = Services.query.all()
    services = [service.serialize()['name'] for service in services]

    # Count the number of service professionals for each service type
    service_professionals = ServiceProfessionals.query.all()
    service_professional_distribution = [0 for _ in range(len(services))]
    for service_professional in service_professionals:
        if (service_professional.service_type - 1) not in service_professional_distribution: # Index for services starts from 1
            service_professional_distribution[service_professional.service_type - 1] = 1
        else:
            service_professional_distribution[service_professional.service_type - 1] += 1
    
    # Count the number of service requests for each service type
    service_requests = ServiceRequests.query.all()
    service_requests_distribution = [0 for _ in range(len(services))]
    for service_request in service_requests:
        if (service_request.service_type - 1) not in service_requests_distribution:
            service_requests_distribution[service_request.service_type - 1] = 1
        else:
            service_requests_distribution[service_request.service_type - 1] += 1
    
    # Count the number of customer requests for each service type
    customer_requests = CustomerRequests.query.all()
    customer_requests_distribution = [0 for _ in range(len(services))]
    for customer_request in customer_requests:
        if (customer_request.service_type - 1) not in customer_requests_distribution:
            customer_requests_distribution[customer_request.service_type - 1] = 1
        else:
            customer_requests_distribution[customer_request.service_type - 1] += 1
    
    # Cumulative distribution of service revenue
    service_revenue_distribution = []
    for i, service_request in enumerate(service_requests):
        if service_request.status >= 2:
            if len(service_revenue_distribution) == 0:
                service_revenue_distribution.append(service_request.price)
            else:
                service_revenue_distribution.append(service_revenue_distribution[-1] + service_request.price)

    # Potential cumulative distribution of service revenue, if all requests were completed
    potential_service_revenue_distribution = []
    for i, service_request in enumerate(customer_requests):
        if len(potential_service_revenue_distribution) == 0:
            potential_service_revenue_distribution.append(service_request.price)
        else:
            potential_service_revenue_distribution.append(potential_service_revenue_distribution[-1] + service_request.price)

    '''Stats for Service Professionals'''
    # Count the number of service professionals for each location
    service_professional_location_distribution = {}
    for service_professional in service_professionals:
        if service_professional.location not in service_professional_location_distribution:
            service_professional_location_distribution[service_professional.location] = 1
        else:
            service_professional_location_distribution[service_professional.location] += 1
    
    # Count the experience of service professionals
    service_professional_experience_distribution = {}
    for service_professional in service_professionals:
        if service_professional.experience not in service_professional_experience_distribution:
            service_professional_experience_distribution[service_professional.experience] = 1
        else:
            service_professional_experience_distribution[service_professional.experience] += 1
    
    # Count the number of services completed by service professionals
    service_professional_services_completed_distribution = {}
    for service_professional in service_professionals:
        if service_professional.services_completed not in service_professional_services_completed_distribution:
            service_professional_services_completed_distribution[service_professional.services_completed] = 1
        else:
            service_professional_services_completed_distribution[service_professional.services_completed] += 1
        
    '''Stats for Customers'''
    # Count the lifetime of customers
    customers = Customers.query.all()
    customer_lifetime_distribution = {}
    for customer in customers:
        lifetime = (datetime.now() - customer.date_created).days // 30
        if lifetime not in customer_lifetime_distribution:
            customer_lifetime_distribution[lifetime] = 1
        else:
            customer_lifetime_distribution[lifetime] += 1
    
    # Count the number of services booked by customers
    customer_services_booked_distribution = {}
    for customer in customers:
        services_booked = ServiceRequests.query.filter_by(customer_id=customer.email).count()
        if services_booked not in customer_services_booked_distribution:
            customer_services_booked_distribution[services_booked] = 1
        else:
            customer_services_booked_distribution[services_booked] += 1

    # Count the price of services booked by customers
    customer_services_price_distribution = {}
    for customer in customers:
        services_booked = ServiceRequests.query.filter_by(customer_id=customer.email).all()
        for service in services_booked:
            if service.price not in customer_services_price_distribution:
                customer_services_price_distribution[service.price] = 1
            else:
                customer_services_price_distribution[service.price] += 1

    return jsonify({
        'services': services,
        'service_professional_distribution': service_professional_distribution,
        'service_requests_distribution': service_requests_distribution,
        'service_revenue_distribution': service_revenue_distribution,
        'potential_service_revenue_distribution': potential_service_revenue_distribution,
        'customer_requests_distribution': customer_requests_distribution,
        'service_professional_location_distribution': service_professional_location_distribution,
        'service_professional_experience_distribution': service_professional_experience_distribution,
        'service_professional_services_completed_distribution': service_professional_services_completed_distribution,
        'customer_lifetime_distribution': customer_lifetime_distribution,
        'customer_services_booked_distribution': customer_services_booked_distribution,
        'customer_services_price_distribution': customer_services_price_distribution
    })

@app.get('/api/admin/stats/api')
@log_api_call
def getAPIStats():
    api_requests = API_Log.query.all()
    recent_api_requests = API_Log.query.filter(API_Log.date >= datetime.now() - timedelta(days=2)).all()
    
    # Recent API Requests
    api_requests_recent = {}
    # Recent Average API Latency
    api_latency = {}
    # Total Ingress
    total_ingress = {}
    # Total Egress
    total_egress = {}

    for api_request in recent_api_requests:
        if str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour) not in api_requests_recent:
            api_requests_recent[str(api_request.date.strftime('%A'))[:3] + ' Hour ' + str(api_request.date.hour)] = 1
            api_latency[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] = api_request.response_time
            total_ingress[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] = api_request.size
            total_egress[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] = api_request.output_size
        else:
            api_requests_recent[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] += 1
            api_latency[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] += api_request.response_time
            total_ingress[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] += api_request.size
            total_egress[str(api_request.date.strftime('%A')[:3]) + ' Hour ' + str(api_request.date.hour)] += api_request.output_size
   
    for date in api_latency:
        api_latency[date] /= api_requests_recent[date]

    # Daily API Requests
    daily_api_requests = {}
    for api_request in api_requests:
        date = api_request.date.strftime('%Y-%m-%d')
        if date not in daily_api_requests:
            daily_api_requests[date] = 1
        else:
            daily_api_requests[date] += 1
    
    # Daily Average API Latency
    daily_average_api_latency = {}
    for api_request in api_requests:
        date = api_request.date.strftime('%Y-%m-%d')
        if date not in daily_average_api_latency:
            daily_average_api_latency[date] = api_request.response_time
        else:
            daily_average_api_latency[date] += api_request.response_time
    for date in daily_average_api_latency:
        daily_average_api_latency[date] /= daily_api_requests[date]
    
    return jsonify({
        'api_requests_recent': api_requests_recent,
        'api_latency': api_latency,
        'total_ingress': total_ingress,
        'total_egress': total_egress,
        'daily_api_requests': daily_api_requests,
        'daily_average_api_latency': daily_average_api_latency
    })
