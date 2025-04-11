from .extensions import db


"""
Represents an appointment in the system.

Attributes:
    patient (str): The patient associated with the appointment.
    internal_id (int): The internal ID of the appointment, primary key.
    appointment_date (date): The date of the appointment.
    appointment_time (int): The time of the appointment.
    appointment_length (int): The length of the appointment.
    provider (str): The provider for the appointment.
    urgent (str): Indicates if the appointment is urgent.
    appointment_type (str): The type of the appointment.
    status (str): The status of the appointment.
    arrival_time (int): The arrival time for the appointment.
    consultation_time (int): The consultation time for the appointment.
    booked_by (str): The person who booked the appointment.
"""
class Appointment(db.Model):
    __tablename__ = 'BPS_APPOINTMENTS'

    patient = db.Column('Patient', db.String) 
    internal_id = db.Column('InternalID', db.Integer, primary_key=True, autoincrement=True)
    appointment_date = db.Column('AppointmentDate', db.Date)
    appointment_time = db.Column('AppointmentTime', db.Integer)
    appointment_length = db.Column('AppointmentLength', db.Integer)
    provider = db.Column('Provider', db.String)
    urgent = db.Column('Urgent', db.String(5))
    appointment_type = db.Column('AppointmentType', db.String(250))
    status = db.Column('Status', db.String(20))
    arrival_time = db.Column('ArrivalTime', db.Integer) 
    consultation_time = db.Column('ConsultationTime', db.Integer) 
    booked_by = db.Column('BookedBy', db.String) 

"""
Represents a patient in the system.

    iid (int): The internal ID of the patient, primary key.
    firstname (str): The first name of the patient.
    surname (str): The surname of the patient.
    email (str): The email address of the patient.
    status_text (str): The status text of the patient.
    title (str): The title of the patient.
    middlename (str): The middle name of the patient.
    preferred_name (str): The preferred name of the patient.
    address1 (str): The first line of the patient's address.
    address2 (str): The second line of the patient's address.
    city (str): The city of the patient's address.
    postcode (str): The postcode of the patient's address.
    postal_address (str): The postal address of the patient.
    postal_city (str): The postal city of the patient.
    postal_postcode (str): The postal postcode of the patient.
    dob (datetime): The date of birth of the patient.
    sex (str): The sex of the patient.
    ethnicity (str): The ethnicity of the patient.
    home_phone (str): The home phone number of the patient.
    work_phone (str): The work phone number of the patient.
    mobile_phone (str): The mobile phone number of the patient.
    medicare_no (str): The Medicare number of the patient.
    medicare_line_no (str): The Medicare line number of the patient.
    medicare_expiry (str): The Medicare expiry date of the patient.
    pension_no (str): The pension number of the patient.
    pension_start (datetime): The pension start date of the patient.
    pension_expiry (datetime): The pension expiry date of the patient.
    pension_type (str): The type of pension the patient has.
    dva_no (str): The DVA number of the patient.
    safety_net_no (str): The safety net number of the patient.
    record_no (str): The record number of the patient.
    hch_tier (str): The HCH tier of the patient.
    hch_start (datetime): The HCH start date of the patient.
    religion (str): The religion of the patient.
    health_fund_name (str): The name of the health fund of the patient.
    health_fund_no (str): The health fund number of the patient.
    ihi (str): The IHI of the patient.
    usual_doctor (str): The usual doctor of the patient.
    gender (str): The gender of the patient.
"""
class Patient(db.Model):
    __tablename__ = 'BPS_PATIENTS'

    iid = db.Column('InternalID', db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column('Firstname', db.String(50))
    surname = db.Column('Surname', db.String(40))
    email = db.Column('Email', db.String(100))
    status_text = db.Column('StatusText', db.String(12))
    title = db.Column('Title', db.String(30))
    middlename = db.Column('Middlename', db.String(30))
    preferred_name = db.Column('Preferredname', db.String(30))
    address1 = db.Column('Address1', db.String(40))
    address2 = db.Column('Address2', db.String(40))
    city = db.Column('City', db.String(40))
    postcode = db.Column('Postcode', db.String(4))
    postal_address = db.Column('PostalAddress', db.String(40))
    postal_city = db.Column('PostalCity', db.String(40))
    postal_postcode = db.Column('PostalPostcode', db.String(4))
    dob = db.Column('DOB', db.DateTime)
    sex = db.Column('Sex', db.String(10))
    ethnicity = db.Column('Ethnicity', db.String(50))
    home_phone = db.Column('HomePhone', db.String(14))
    work_phone = db.Column('WorkPhone', db.String(14))
    mobile_phone = db.Column('MobilePhone', db.String(14))
    medicare_no = db.Column('MedicareNo', db.String(13))
    medicare_line_no = db.Column('MedicareLineNo', db.String(1))
    medicare_expiry = db.Column('MedicareExpiry', db.String(10))
    pension_no = db.Column('PensionNo', db.String(14))
    pension_start = db.Column('PensionStart', db.DateTime)
    pension_expiry = db.Column('PensionExpiry', db.DateTime)
    pension_type = db.Column('PensionType', db.String(40))
    dva_no = db.Column('DVANo', db.String(14))
    safety_net_no = db.Column('SafetyNetNo', db.String(14))
    record_no = db.Column('RecordNo', db.String(10))
    hch_tier = db.Column('HCHTier', db.String(12))
    hch_start = db.Column('HCHStart', db.DateTime)
    religion = db.Column('Religion', db.String(20))
    health_fund_name = db.Column('HealthFundName', db.String(100))
    health_fund_no = db.Column('HealthFundNo', db.String(20))
    ihi = db.Column('IHI', db.String(16))
    usual_doctor = db.Column('UsualDoctor', db.String(162))
    gender = db.Column('Gender', db.String(20))
