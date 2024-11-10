import smtplib
from app import logger
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from flask import current_app as app
from celery_app_conf import create_celery_app
from application.database import db
from application.models import ServiceProfessionals, CustomerRequests

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

            break

    return {'message': 'Emails sent successfully', 'count': len(service_professionals)}
