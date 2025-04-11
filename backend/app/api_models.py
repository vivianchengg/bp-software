from flask_restx import fields
from .extensions import api

# Define the Connection model
create_connection_model = api.model('CreateConnection', {
    'username': fields.String(required=True, description='Database username'),
    'password': fields.String(required=True, description='Database password'),
    'host': fields.String(required=True, description='Database host IP or URL'),
    'port': fields.Integer(default=1433, description='Database port, default 1433 for MSSQL'),
    'database': fields.String(required=True, description='Database name'),
    'driver': fields.String(default="ODBC Driver 17 for SQL Server", description='ODBC Driver for SQL Server')
})

# Define the Register model
register_model = api.model('Register', {
    'email': fields.String(required=True, description="Email"),
    'password': fields.String(required=True, description="Password"),
    'first_name': fields.String(required=True, description="First name"),
    'last_name': fields.String(required=True, description="Last name"),
    'title': fields.String(required=True, description="Title"),
    'position': fields.String(required=True, description="Position"),
    'profile_img': fields.String(required=True, description="Profile Img"),
    'organisation': fields.String(required=True, description="Organisation")
})

# Define the Login model
login_model = api.model('Login', {
    'email': fields.String(required=True, description="Email"),
    'password': fields.String(required=True, description="Password"),
})

# Define the Verify model
verify_model = api.model('Verify', {
    'verify_token': fields.String(required=True, description="Token")
})

reset_password_model = api.model('Reset Password', {
    'reset_code': fields.String(required=True, description="Token sent via email"),
    'password': fields.String(required=True, description="New password")
})

reset_password_request_model = api.model('Reset Password Request', {
    'email': fields.String(required=True, description="email")
})

edit_profile_model = api.model('Edit profile', {
    'title': fields.String(required=True, description="Title"),
    'organization': fields.String(required=True, description="Organization"),
    'position': fields.String(required=True, description="Position"),
    'avatar': fields.String(required=True, description="Avatar"),
    'first_name': fields.String(required=True, description="First name"),
    'last_name': fields.String(required=True, description="Last name"),
    'password': fields.String(required=True, description="Password"),
})

appointment_model = api.model('Appointment', {
    'internal_id': fields.Integer(description='Internal ID of the appointment'),
    'patient': fields.String(description='Patient'),
    'appointment_date': fields.Date(description='Appointment Date'),
    'appointment_time': fields.Integer(description='Appointment Time'),
    'appointment_length': fields.Integer(description='Appointment Length in Minutes'),
    'provider': fields.String(description='Doctor/Provider'),
    'urgent': fields.String(description='Urgency'),
    'appointment_type': fields.String(description='Type of Appointment'),
    'status': fields.String(description='Status'),
    'arrival_time': fields.Integer(description='Arrival Time'),
    'consultation_time': fields.Integer(description='Consultation Time'),
    'booked_by': fields.String(description='Booked By')
})

appointment_model_create = api.model('Appointment', {
    'patient': fields.String(description='Patient'),
    'appointment_date': fields.Date(description='Appointment Date'),
    'appointment_time': fields.Integer(description='Appointment Time'),
    'appointment_length': fields.Integer(description='Appointment Length in Minutes'),
    'provider': fields.String(description='Doctor/Provider'),
    'urgent': fields.String(description='Urgency'),
    'appointment_type': fields.String(description='Type of Appointment'),
    'status': fields.String(description='Status'),
    'arrival_time': fields.Integer(description='Arrival Time'),
    'consultation_time': fields.Integer(description='Consultation Time'),
    'booked_by': fields.String(description='Booked By')
})

# Define the Patient model
patient_model = api.model('Patient', {
    'iid': fields.Integer(description='Internal Patient ID'),
    'firstname': fields.String(description='First Name'),
    'middlename': fields.String(description='Middle Name'),
    'preferred_name': fields.String(description='Preferred Name'),
    'surname': fields.String(description='Surname'),
    'email': fields.String(description='Email'),
    'status_text': fields.String(description='Status Text'),
    'title': fields.String(description='Title'),
    'address1': fields.String(description='Address Line 1'),
    'address2': fields.String(description='Address Line 2'),
    'city': fields.String(description='City'),
    'postcode': fields.String(description='Postcode'),
    'postal_address': fields.String(description='Postal Address'),
    'postal_city': fields.String(description='Postal City'),
    'postal_postcode': fields.String(description='Postal Postcode'),
    'dob': fields.DateTime(description='Date of Birth'),
    'sex': fields.String(description='Sex'),
    'ethnicity': fields.String(description='Ethnicity'),
    'home_phone': fields.String(description='Home Phone Number'),
    'work_phone': fields.String(description='Work Phone Number'),
    'mobile_phone': fields.String(description='Mobile Phone Number'),
    'medicare_no': fields.String(description='Medicare Number'),
    'medicare_line_no': fields.String(description='Medicare Line Number'),
    'medicare_expiry': fields.String(description='Medicare Expiry Date'),
    'pension_no': fields.String(description='Pension Number'),
    'pension_start': fields.DateTime(description='Pension Start Date'),
    'pension_expiry': fields.DateTime(description='Pension Expiry Date'),
    'pension_type': fields.String(description='Pension Type'),
    'dva_no': fields.String(description='DVA Number'),
    'safety_net_no': fields.String(description='Safety Net Number'),
    'record_no': fields.String(description='Record Number'),
    'hch_tier': fields.String(description='HCH Tier'),
    'hch_start': fields.DateTime(description='HCH Start Date'),
    'religion': fields.String(description='Religion'),
    'health_fund_name': fields.String(description='Health Fund Name'),
    'health_fund_no': fields.String(description='Health Fund Number'),
    'ihi': fields.String(description='IHI'),
    'usual_doctor': fields.String(description='Usual Doctor'),
    'gender': fields.String(description='Gender'),
})

# Define the Patient Card model
patient_model_create = api.model('Patient', {
    'firstname': fields.String(description='First Name'),
    'middlename': fields.String(description='Middle Name'),
    'preferred_name': fields.String(description='Preferred Name'),
    'surname': fields.String(description='Surname'),
    'email': fields.String(description='Email'),
    'status_text': fields.String(description='Status Text'),
    'title': fields.String(description='Title'),
    'address1': fields.String(description='Address Line 1'),
    'address2': fields.String(description='Address Line 2'),
    'city': fields.String(description='City'),
    'postcode': fields.String(description='Postcode'),
    'postal_address': fields.String(description='Postal Address'),
    'postal_city': fields.String(description='Postal City'),
    'postal_postcode': fields.String(description='Postal Postcode'),
    'dob': fields.DateTime(description='Date of Birth'),
    'sex': fields.String(description='Sex'),
    'ethnicity': fields.String(description='Ethnicity'),
    'home_phone': fields.String(description='Home Phone Number'),
    'work_phone': fields.String(description='Work Phone Number'),
    'mobile_phone': fields.String(description='Mobile Phone Number'),
    'medicare_no': fields.String(description='Medicare Number'),
    'medicare_line_no': fields.String(description='Medicare Line Number'),
    'medicare_expiry': fields.String(description='Medicare Expiry Date'),
    'pension_no': fields.String(description='Pension Number'),
    'pension_start': fields.DateTime(description='Pension Start Date'),
    'pension_expiry': fields.DateTime(description='Pension Expiry Date'),
    'pension_type': fields.String(description='Pension Type'),
    'dva_no': fields.String(description='DVA Number'),
    'safety_net_no': fields.String(description='Safety Net Number'),
    'record_no': fields.String(description='Record Number'),
    'hch_tier': fields.String(description='HCH Tier'),
    'hch_start': fields.DateTime(description='HCH Start Date'),
    'religion': fields.String(description='Religion'),
    'health_fund_name': fields.String(description='Health Fund Name'),
    'health_fund_no': fields.String(description='Health Fund Number'),
    'ihi': fields.String(description='IHI'),
    'usual_doctor': fields.String(description='Usual Doctor'),
    'gender': fields.String(description='Gender'),
})

# Define the Appointment Card model
appointment_card = api.model('Appointment Card', {
    'appointmentId': fields.Integer(description='Internal ID of the appointment'),
    'patientId': fields.Integer(description='Patient id'),
    'patient': fields.String(description='Patient'),
    'phone': fields.String(description='Patient phone number'),
    'medicare': fields.Boolean(description='Has medicare'),
    'overYearAgo': fields.Boolean(description='Appointment was over a year ago'),
    'time': fields.Integer(description='Appointment Time in Minutes'),
    'duration': fields.Integer(description='Appointment Length in Minutes'),
    'appointmentType': fields.String(description='Type of Appointment'),
    'lastAppointment': fields.String(description='Date of Appointment'),
})

# Define the app phone check model
appPCheck_model = api.model('Appointment Phone Check', {
    'isPhone': fields.Boolean(description='Is Phone Consult'),
    'overYearAgo': fields.Boolean(description='Appointment was over a year ago'),
    'lastAppointment': fields.String(description='Date of Appointment'),
})

# Define the note model
note_model = api.model('Note', {
    'note': fields.String(required=True, description='Appointment Note')
})
