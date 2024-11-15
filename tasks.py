import os
import smtplib
from datetime import datetime
from app import logger
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from flask import current_app as app
from celery_app_conf import create_celery_app
from application.database import db
from application.models import ServiceProfessionals, CustomerRequests, ServiceRequests, Customers

celery_app = create_celery_app(app)

@celery_app.task
def sendServiceProfessionalNotifs():
    logger.info('----------------- Sending service professional notifications -----------------')

    service_professionals = db.session.query(ServiceProfessionals).join(
        CustomerRequests, ServiceProfessionals.email == CustomerRequests.serviceProfessional_id
    ).filter(CustomerRequests.status == 0).all()

    with smtplib.SMTP_SSL(app.config['SMTP_SERVER'], 465) as smtp_server:
        smtp_server.login(app.config['SMTP_SENDER_EMAIL'], app.config['SMTP_SENDER_PASSWORD'])
        for service_professional in service_professionals:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'LA MAISON: New Customer Request'
            msg['From'] = app.config['SMTP_SENDER_EMAIL']
            msg['To'] = service_professional.email

            text = f"""\
                Hello {service_professional.name},
                You have a new customer request for your services. Please check the app for more details.

                Sincerely,
                La Maison
                Visit: lamaison.com
            """

            html = f"""\
                <!DOCTYPE html>
                <html>
                <head></head>
                <body>
                    <div style="background-color: #000000; padding: 20px 0;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
                            <!-- Header with Logo -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="cid:logo_image" alt="La Maison Logo" style="width: 200px; height: auto;">
                                <br>
                                <img src="cid:logo_text_image" alt="La Maison Logo Text" style="width: 170px; margin-top: 10px;">
                            </div>

                            <!-- Main Content -->
                            <div>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Hello {service_professional.name},</p>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">You have a new customer request for your services. Please check the app for more details.</p>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
                                    Sincerely,<br>
                                    La Maison<br>
                                    Visit: <a href="https://lamaison.com" style="color: #0073e6; text-decoration: none;">lamaison.com</a>
                                </p>
                            </div>

                            <!-- Footer with Disclaimer -->
                            <div style="font-size: 12px; color: grey; text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd;">
                                This is an auto-generated email. Do not reply to this.
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            """

            part1 = MIMEText(text, 'plain')
            part2 = MIMEText(html, 'html')

            msg.attach(part1)
            msg.attach(part2)

            with open('static/img/logo-no-text.png', 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<logo_image>')
                img.add_header('Content-Disposition', 'inline', filename='logo.png')
                msg.attach(img)
            
            with open('static\img\logo-text.png', 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<logo_text_image>')
                img.add_header('Content-Disposition', 'inline', filename='logo_text.png')
                msg.attach(img)

            smtp_server.sendmail(app.config['SMTP_SENDER_EMAIL'], service_professional.email, msg.as_string())

    return {'message': 'Notifs sent successfully', 'count': len(service_professionals)}

@celery_app.task
def sendServiceProfessionalReports():
    logger.info('----------------- Sending service professional reports -----------------')

    CustomerRequests_status = {
        0: 'Pending',
        1: 'Rejected',
        2: 'Accepted'
    }

    ServiceRequests_status = {
        0: 'Pending',
        1: 'Rejected',
        2: 'Completed',
        3: 'Paid'
    }

    service_professionals = ServiceProfessionals.query.filter(ServiceProfessionals.admin_approved == 1).all()

    month = datetime.now().strftime("%B")
    month_number = datetime.now().month

    style = '''
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 16px;
                text-align: left;
            }
        
            th, td {
                padding: 12px;
                border: 1px solid #ddd;
            }
        
            th {
                background-color: #f2f2f2;
            }
        
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
        
            tr:hover {
                background-color: #f1f1f1;
            }
        </style>
    '''

    with smtplib.SMTP_SSL(app.config['SMTP_SERVER'], 465) as smtp_server:
        smtp_server.login(app.config['SMTP_SENDER_EMAIL'], app.config['SMTP_SENDER_PASSWORD'])
        for service_professional in service_professionals:
            # Do not send a report if no requests are present
            service_request_flag = 0
            customer_request_flag = 0

            html = f'''
                <!DOCTYPE html>
                <html>
                <head>
                    {style}
                </head>
                <body>
                    <div style="background-color: #000000; padding: 20px 0;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
                            <!-- Header with Logo -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="cid:logo_image" alt="La Maison Logo" style="width: 200px; height: auto;">
                                <br>
                                <img src="cid:logo_text_image" alt="La Maison Logo Text" style="width: 170px; margin-top: 10px;">
                            </div>

                            <!-- Main Content -->
                            <div>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Hello {service_professional.name},</p>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Here is your monthly report for {month}. Please check the app for more details.</p>
                                <br>
                                <hr>
            '''

            html_close = '''
                                <br>
                                <hr>
                                <br>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
                                    Sincerely,<br>
                                    La Maison<br>
                                    Visit: <a href="https://lamaison.com" style="color: #0073e6; text-decoration: none;">lamaison.com</a>
                                </p>
                            </div>

                            <!-- Footer with Disclaimer -->
                            <div style="font-size: 12px; color: grey; text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd;">
                                This is an auto-generated email. Do not reply to this.
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            '''

            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'LA MAISON: Monthy Report'
            msg['From'] = app.config['SMTP_SENDER_EMAIL']
            msg['To'] = service_professional.email

            service_requests = ServiceRequests.query.filter(ServiceRequests.serviceProfessional_id == service_professional.email, ServiceRequests.created_at.like(f'%-{month_number}-%'))
            service_request_flag = service_requests.count()

            if service_requests.count() > 0:
                table1 = '''
                    <p style="text-align: center; font-size: 16px; line-height: 1.5; margin: 10px 0; margin-top: 20px;">Active Requests</p>
                    <table>
                        <tr>
                            <th>Customer ID</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                '''

                table1_close = '''
                    </table>
                '''

                for service_request in service_requests:
                    table_row = f'''
                        <tr>
                            <td>{service_request.customer_id}</td>
                            <td>{service_request.for_date}</td>
                            <td>{service_request.description}</td>
                            <td>{service_request.price}</td>
                            <td>{ServiceRequests_status[service_request.status]}</td>
                        </tr>
                    '''

                    table1 += table_row
                html += table1
                html += table1_close

            service_requests = CustomerRequests.query.filter(CustomerRequests.serviceProfessional_id == service_professional.email, CustomerRequests.status == 0, CustomerRequests.created_at.like(f'%-{month_number}-%'))
            customer_request_flag = service_requests.count()

            if service_requests.count() > 0:
                table2 = '''
                    <p style="text-align: center; font-size: 16px; line-height: 1.5; margin: 10px 0;">Pending Customer Requests</p>
                    <table>
                        <tr>
                            <th>Customer ID</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                '''

                table2_close = '''
                    </table>
                '''

                for service_request in service_requests:
                    table_row = f'''
                        <tr>
                            <td>{service_request.customer_id}</td>
                            <td>{service_request.for_date}</td>
                            <td>{service_request.description}</td>
                            <td>{service_request.price}</td>
                            <td>{CustomerRequests_status[service_request.status]}</td>
                        </tr>
                    '''

                    table2 += table_row
                html += table2
                html += table2_close
            
            html += html_close

            if service_request_flag == 0 and customer_request_flag == 0:
                continue

            part1 = MIMEText(html, 'html')

            msg.attach(part1)

            with open('static/img/logo-no-text.png', 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<logo_image>')
                img.add_header('Content-Disposition', 'inline', filename='logo.png')
                msg.attach(img)
            
            with open('static\img\logo-text.png', 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<logo_text_image>')
                img.add_header('Content-Disposition', 'inline', filename='logo_text.png')
                msg.attach(img)

            smtp_server.sendmail(app.config['SMTP_SENDER_EMAIL'], service_professional.email, msg.as_string())
    
    return {'message': 'Reports sent successfully', 'count': len(service_professionals)}

@celery_app.task
def sendCustomerReports():
    logger.info('----------------- Sending customer reports -----------------')

    CustomerRequests_status = {
        0: 'Pending',
        1: 'Rejected',
        2: 'Accepted'
    }

    ServiceRequests_status = {
        0: 'Pending',
        1: 'Rejected',
        2: 'Completed',
        3: 'Paid'
    }

    customers = Customers.query.filter(Customers.admin_action == 0).all()

    month = datetime.now().strftime("%B")
    month_number = datetime.now().month

    style = '''
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 16px;
                text-align: left;
            }
        
            th, td {
                padding: 12px;
                border: 1px solid #ddd;
            }
        
            th {
                background-color: #f2f2f2;
            }
        
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
        
            tr:hover {
                background-color: #f1f1f1;
            }
        </style>
    '''

    with smtplib.SMTP_SSL(app.config['SMTP_SERVER'], 465) as smtp_server:
        smtp_server.login(app.config['SMTP_SENDER_EMAIL'], app.config['SMTP_SENDER_PASSWORD'])
        for customer in customers:
            # Do not send a report if no requests are present
            service_request_flag = 0
            customer_request_flag = 0

            html = f'''
                <!DOCTYPE html>
                <html>
                <head>
                    {style}
                </head>
                <body>
                    <div style="background-color: #000000; padding: 20px 0;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
                            <!-- Header with Logo -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="cid:logo_image" alt="La Maison Logo" style="width: 200px; height: auto;">
                                <br>
                                <img src="cid:logo_text_image" alt="La Maison Logo Text" style="width: 170px; margin-top: 10px;">
                            </div>

                            <!-- Main Content -->
                            <div>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Hello {customer.name},</p>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Here is your monthly report for {month}. Please check the app for more details.</p>
                                <br>
                                <hr>
            '''

            html_close = '''
                                <br>
                                <hr>
                                <br>
                                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
                                    Sincerely,<br>
                                    La Maison<br>
                                    Visit: <a href="https://lamaison.com" style="color: #0073e6; text-decoration: none;">lamaison.com</a>
                                </p>
                            </div>

                            <!-- Footer with Disclaimer -->
                            <div style="font-size: 12px; color: grey; text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd;">
                                This is an auto-generated email. Do not reply to this.
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            '''

            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'LA MAISON: Monthy Report'
            msg['From'] = app.config['SMTP_SENDER_EMAIL']
            msg['To'] = customer.email

            service_requests = ServiceRequests.query.filter(ServiceRequests.customer_id == customer.email, ServiceRequests.created_at.like(f'%-{month_number}-%'))
            service_request_flag = service_requests.count()

            if service_requests.count() > 0:
                table1 = '''
                    <p style="text-align: center; font-size: 16px; line-height: 1.5; margin: 10px 0; margin-top: 20px;">Active Requests</p>
                    <table>
                        <tr>
                            <th>Service Professional ID</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                '''

                table1_close = '''
                    </table>
                '''

                for service_request in service_requests:
                    table_row = f'''
                        <tr>
                            <td>{service_request.serviceProfessional_id}</td>
                            <td>{service_request.for_date}</td>
                            <td>{service_request.description}</td>
                            <td>{service_request.price}</td>
                            <td>{ServiceRequests_status[service_request.status]}</td>
                        </tr>
                    '''

                    table1 += table_row
                html += table1
                html += table1_close
            
            service_requests = CustomerRequests.query.filter(CustomerRequests.customer_id == customer.email, CustomerRequests.status == 0, CustomerRequests.created_at.like(f'%-{month_number}-%'))
            customer_request_flag = service_requests.count()

            if service_requests.count() > 0:
                table2 = '''
                    <p style="text-align: center; font-size: 16px; line-height: 1.5; margin: 10px 0;">Pending Customer Requests</p>
                    <table>
                        <tr>
                            <th>Service Professional ID</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                '''

                table2_close = '''
                    </table>
                '''

                for service_request in service_requests:
                    table_row = f'''
                        <tr>
                            <td>{service_request.serviceProfessional_id}</td>
                            <td>{service_request.for_date}</td>
                            <td>{service_request.description}</td>
                            <td>{service_request.price}</td>
                            <td>{CustomerRequests_status[service_request.status]}</td>
                        </tr>
                    '''

                    table2 += table_row
                html += table2
                html += table2_close

            html += html_close

            if service_request_flag == 0 and customer_request_flag == 0:
                continue

            part1 = MIMEText(html, 'html')

            msg.attach(part1)

            with open('static/img/logo-no-text.png', 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<logo_image>')
                img.add_header('Content-Disposition', 'inline', filename='logo.png')
                msg.attach(img)
            
            with open('static\img\logo-text.png', 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<logo_text_image>')
                img.add_header('Content-Disposition', 'inline', filename='logo_text.png')
                msg.attach(img)

            smtp_server.sendmail(app.config['SMTP_SENDER_EMAIL'], customer.email, msg.as_string())

    return {'message': 'Reports sent successfully', 'count': len(customers)}

@celery_app.task
def exportServiceProfessionalAsCSV(id):
    logger.info('----------------- Exporting Service Professional as CSV -----------------')

    service_requests = ServiceRequests.query.filter(ServiceRequests.serviceProfessional_id == id, ServiceRequests.status >= 2).all()  

    file_path = os.path.join(app.config['TASKS_DUMP_FOLDER'], f'{id}_service_requests.csv')
    with open(file_path, 'w') as f:
        f.write('customer_id,serviceProfessional_id,price,for_date,description,status\n')
        for service_request in service_requests:
            f.write(f'{service_request.customer_id},{service_request.serviceProfessional_id},{service_request.price},{service_request.for_date},{service_request.description},{service_request.status}\n')

    return {'message': 'CSV exported successfully', 'file_path': file_path}

@celery_app.task
def incrementServiceProfessionalExperience():
    logger.info('----------------- Incrementing Service Professional Experience -----------------')

    service_professionals = ServiceProfessionals.query.all()
    for service_professional in service_professionals:
        service_professional.experience += 1

    db.session.commit()

    return {'message': 'Experience incremented successfully', 'count': len(service_professionals)}
