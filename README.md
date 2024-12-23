# La Maison: A House-hold Services App

## Description

La Maison is a comprehensive, robust platform for providing home servicing and solutions.

## Frameworks & Technologies Used

- **Flask**: The corner-stone of the project, Flask serves as the backend to the web-app, providing a robust API.
- **Flask SQLAlchemy & SQLite**: The database for the web-app, holds all users, campaigns, and requests.
- **VueJS**: Used for UI, Vue forms the frontend of the application, featuring API calls, frontend validation, and secure access with JSON Web Tokens (JWTs).
- **Redis**: Caching and message brokering for Celery.
- **Celery**: Celery workers are used for batch processing, and Celery Beat is used for scheduled jobs.
- **Simple Mail Transfer Protocol (SMTP)**: Sending notifications and reports.
- **Postman**: Maintaining and testing API performance.
- **Bootstrap & CSS**: All styling is done through bootstrap and additional CSS.
- **JWTs**: Generated based on the user with a set expiration, JWTs allow for authentication to the API.
- **OpenAPI & Swagger**: Documenting the API.
- **ChartJS**: Used to generate graphs for the admin portal.

## Requirements

Install all dependencies through `requirements.txt`. Add relevant information for redis and SMTP in `keys.json`. Run using `app.py`.

## Core Functionalities

### a. Login System
- A single login page for customers and service professionals.
- Authentication is done via JWTs, which encode the user’s email and an expiration time.

### b. Admin Portal
- **Statistics - Overview**: Overview of total users, services, requests, revenue, logins, API requests, and latency.
- **Statistics - Distributions**: Distributions of customers, service professionals, and revenue.
- **Statistics - API**: Requests, latency, ingress, and egress.
- **Services**: Can be added or modified.
- **Approvals**: Approve new service professionals.
- **Reviewing**: Block and delete customers and service professionals.

### c. Customer Dashboard
- **Requests**: View completed requests, accepted requests, and sent requests.
- **Modify Requests**: Accepted and sent requests can be modified.
- **Search**: Find service professionals via category or search bar.

### d. Service Professional Dashboard
- **Requests**: View completed, accepted, and received requests.
- **Actions**: Accept or reject requests and close completed requests.

### e. Caching
- Various endpoints are cached with Redis and automatically updated when the database is modified.

### f. Backend Jobs Through Celery
- Scheduled daily notifications for service professionals via email.
- Monthly reports for both customers and service professionals via email.
- Exporting service professionals and their requests via CSV.

## Additional Features

### a. Secure Login System
- Robust and secure login system through JWTs that prevents unauthorized access to both the frontend and API endpoints.

### b. Detailed Styling and Aesthetics
- Custom logos for La Maison, customers, service professionals, and icons for services.

### c. Notifications and Reports
- Well-designed email notifications and reports using Bootstrap.

### d. API Logging
- Stores details of every API call, including date, method, ingress, egress, browser, and platform.

### e. Payment Portal
- A dummy payment portal for customers to pay service professionals.

### f. Charts and Graphs
- Created using ChartJS for data visualization in the admin portal.

### g. Comprehensive Logging
- Logs for registered endpoints, requests, and Celery tasks.

### h. Frontend Validation
- Implemented in forms using JavaScript in VueJS.

### i. Backend Validation
- API validation that returns error messages to be displayed on the frontend.

## Directory Structure

### Folder Setup

```shell
├── application
│   ├── admin_controllers.py
│   ├── admin_stat_controllers.py
│   ├── config.py
│   ├── controllers.py
│   ├── customer_controllers.py
│   ├── database.py
│   ├── models.py
│   ├── redis_controllers.py
│   ├── security.py
│   ├── serviceProfessionals_controllers.py
│   ├── util_controllers.py
├── app.py
├── celery_app_conf.py
├── db
│   └── database.sqlite3
├── keys.json
├── LICENSE
├── README.md
├── redis.conf
├── requirements.txt
├── static
│   ├── components
│   │    ├── admin
│   │    │    ├── adminDash.js
│   │    │    ├── adminStats1.js
│   │    │    ├── adminStats2.js
│   │    │    ├── adminStats3.js
│   │    ├── customer
│   │    │    ├── customerDash.js
│   │    │    ├── payment.js
│   │    ├── serviceProfessional
│   │    │    ├── serviceProfessionalDash.js
│   │    ├── footer.js
│   │    ├── lineSeperator.js
│   │    ├── navbar.js
│   │    ├── nonStickyFooter.js
│   ├── css
│   │    ├── adminDash.css
│   │    ├── customerDash.css
│   │    ├── login.css
│   │    ├── serviceProfessionalDash.css
│   ├── img
│   ├── index.js
│   ├── openapi.yaml
│   ├── router.js
│   ├── uploads
│   │    ├── detailed_services
│   │    ├── services
├── templates
│   ├── docs.html
│   ├── index.html
└── tasks.py
```

## Database Schema

![DB Schema](https://github.com/user-attachments/assets/4999cadd-fd16-40db-998f-2bce0be4b8c8)

## Attribution

All icons for services are from [Flaticon.com](flaticon.com)

