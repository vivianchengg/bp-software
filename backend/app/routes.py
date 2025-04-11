from flask import request, jsonify, current_app
from flask_restx import Resource, Namespace
from sqlalchemy import desc, func, create_engine, or_, and_
from datetime import datetime, timedelta, date
from flask_sqlalchemy import SQLAlchemy

from .models import Appointment, Patient
from .api_models import *
from .extensions import api,db,MAIL
from datetime import date, datetime, timedelta
from .helpers import checkStr
from datetime import datetime

from .auth import auth_delete_account, auth_check_verify, auth_get_all_profile, auth_logout, auth_register, auth_login, auth_reset_password, auth_edit_profile, auth_get_profile, auth_reset_password_request, auth_verify
from .auth_helpers import require_auth, extract_token
from .persistence import loadData, saveData

import logging
logging.basicConfig(level=logging.DEBUG)
DEFAULT_DATE = "1900-1-1"

###########
# MongoDB #
###########
import os
import pymongo
mongo_uri = os.getenv('MONGO_URI')
if not os.getenv('LD_LIBRARY_PATH'):
    mongo_uri = 'mongodb://root:root@localhost:27017/'
print(mongo_uri)
myclient = pymongo.MongoClient(mongo_uri)
mydb = myclient["data"]
appointments_db = mydb["appointments"]

######################
# APPOINTMENT ROUTES #
######################
ns_app = Namespace("appointments")
@ns_app.route("")
class Appointments(Resource):
    """
    Retrieves all appointments.
    
    Returns:
        - list: A list of all appointments.
        - int: HTTP status code (200 for success).
    """
    @ns_app.response(200, 'success')
    @ns_app.marshal_list_with(appointment_model)
    def get(self):
        return Appointment.query.all()

@ns_app.route("/create")
class CreateAppointments(Resource):
    """
    Creates a new appointment and saves it to the database.
    
    This method handles the HTTP POST request to create a new appointment. It expects
    the appointment details in the request payload, creates a new Appointment object,
    saves it to the database, and returns the created appointment with its internal ID.

    Returns:
        - Appointment: The created appointment object with its internal ID.
        - int: HTTP status code (201 for success).
    """
    @ns_app.response(201, 'success')
    @ns_app.expect(appointment_model_create)
    @ns_app.marshal_with(appointment_model)
    def post(self):
        print(ns_app.payload)
        new_appointment = Appointment(patient=ns_app.payload["patient"],
                                      appointment_date=datetime.strptime(ns_app.payload["appointment_date"], '%Y-%m-%d').date(),
                                      appointment_time=ns_app.payload["appointment_time"],
                                      appointment_length=ns_app.payload["appointment_length"],
                                      provider=ns_app.payload["provider"],
                                      urgent=ns_app.payload["urgent"],
                                      appointment_type=ns_app.payload["appointment_type"],
                                      status=ns_app.payload["status"],
                                      arrival_time=ns_app.payload["arrival_time"],
                                      consultation_time=ns_app.payload["consultation_time"],
                                      booked_by=ns_app.payload["booked_by"])
        db.session.add(new_appointment)
        db.session.commit()

        appoint_with_id = db.session.query(Appointment)\
            .filter(Appointment.patient == new_appointment.patient)\
            .filter(Appointment.appointment_date == new_appointment.appointment_date)\
            .filter(Appointment.appointment_time == new_appointment.appointment_time)\
            .filter(Appointment.provider == new_appointment.provider)\
            .filter(Appointment.booked_by == new_appointment.booked_by)\
            .order_by(Appointment.internal_id.desc())\
            .first()

        return appoint_with_id, 201

@ns_app.route("/edit/<int:internal_id>")
class EditAppointments(Resource):
    """
    Updates an appointment by its internal ID.
    
    Parameters:
        - internal_id (int): The internal ID of the appointment to update.
    
    Returns:
        - Appointment: The updated appointment object.
        - int: HTTP status code (200 for success, 404 if appointment not found).
    """
    @ns_app.response(200, 'success')
    @ns_app.expect(appointment_model)
    @ns_app.marshal_with(appointment_model)
    def put(self, internal_id):
        appointment = db.session.query(Appointment).filter_by(internal_id=internal_id).first()

        if not appointment:
            ns_app.abort(404, f"Appointment with Internal ID {internal_id} not found.")

        appointment.patient = ns_app.payload["patient"]
        appointment.appointment_date = datetime.strptime(ns_app.payload["appointment_date"], '%Y-%m-%d').date()
        appointment.appointment_time = ns_app.payload["appointment_time"]
        appointment.appointment_length = ns_app.payload["appointment_length"]
        appointment.provider = ns_app.payload["provider"]
        appointment.urgent = ns_app.payload["urgent"]
        appointment.appointment_type = ns_app.payload["appointment_type"].ljust(92)[:92]
        appointment.status = ns_app.payload["status"].ljust(17)[:17]
        appointment.arrival_time = ns_app.payload["arrival_time"]
        appointment.consultation_time = ns_app.payload["consultation_time"]
        appointment.booked_by = ns_app.payload["booked_by"]

        db.session.commit()

        return appointment

@ns_app.route("/delete/<int:internal_id>")
class DeleteAppointment(Resource):
    """
    Deletes an appointment by its internal ID.
    Parameters:
        - internal_id (int): The internal ID of the appointment to delete.
    Returns:
        - dict: Success message.
        - int: HTTP status code (200 for success, 404 if appointment not found).
    """
    @ns_app.response(200, 'Appointment successfully deleted')
    @ns_app.response(404, 'Appointment not found')
    def delete(self, internal_id):
        appointment = db.session.query(Appointment).filter_by(internal_id=internal_id).first()

        if not appointment:
            ns_app.abort(404, f"Appointment with Internal ID {internal_id} not found.")

        db.session.delete(appointment)
        db.session.commit()

        return {"message": f"Appointment {internal_id} was deleted successfully"}, 200

@ns_app.route("/notes/<int:app_id>")
class Notes(Resource):
    """
    Retrieves or updates notes for an appointment by its app ID.
    Parameters:
        - app_id (int): The app ID of the appointment.
    Returns:
        - dict: Appointment data or success message.
        - int: HTTP status code (200 for success, 404 if appointment not found, 400 for invalid request).
    """
    @ns_app.response(200, 'success')
    @ns_app.response(404, 'id not found')
    def get(self, app_id):
        appointment = appointments_db.find_one({'app_id': app_id})

        if appointment:
            return {"app_id": app_id, "note": appointment['note']}, 200
        else:
            return {"message": f"Appointment with app_id {app_id} not found."}, 404

    """
    Updates or creates a note for an appointment by its app ID.
    Parameters:
        - app_id (int): The app ID of the appointment.
    Returns:
        - dict: Success message.
        - int: HTTP status code (200 for successful update, 201 for successful create, 400 for invalid request body, 404 for invalid ID).
    """
    @ns_app.expect(note_model)
    @ns_app.response(200, 'successful update')
    @ns_app.response(201, 'successful create')
    @ns_app.response(400, 'invalid request body: note')
    @ns_app.response(404, 'invalid id input')
    def put(self, app_id):
        noteData = request.json

        if 'note' not in noteData:
            return {"message": "Missing 'note' in the request body."}, 400

        noteStr = noteData.get("note") or ''
        app = appointments_db.find_one({'app_id': app_id})

        # update
        if app:
            app['note'] = noteStr
            appointments_db.update_one({'app_id': app_id}, {'$set': app})
            return {"message": "Appointment note updated successfully."}, 200

        # create new
        new_app = {"app_id": app_id, "note": noteStr}
        appointments_db.insert_one(new_app)
        return {"message": "Appointment created successfully."}, 200

@ns_app.route('/filter')
class AppointmentFilter(Resource):
    """
    Filters and retrieves appointments based on doctor ID and date.

    Parameters:
        - doctor_id (str): The ID of the doctor to filter appointments by.
        - date (str): The date to filter appointments by, in the format YYYY-MM-DD.

    Returns:
        - list: A list of dictionaries containing appointment and patient details.
        - int: HTTP status code (200 for success, 400 for invalid date format).

    Each dictionary in the returned list contains:
        - appointmentId (int): The internal ID of the appointment.
        - patientId (int): The ID of the patient.
        - patient (str): The full name of the patient.
        - phone (str): The phone number of the patient.
        - medicare (bool): Whether the patient has a Medicare number.
        - overYearAgo (bool): Whether the last appointment was over a year ago.
        - time (str): The time of the appointment.
        - duration (float): The duration of the appointment in hours.
        - appointmentType (str): The type of the appointment.
        - lastAppointment (date): The date of the last appointment, if applicable.
    """
    @ns_app.param('doctor_id', 'doctor id')
    @ns_app.param('date', 'date')
    @ns_app.response(200, 'success')
    @ns_app.response(400, 'invalid date format')
    @ns_app.marshal_list_with(appointment_card)

    def get(self):
        # Retrieve doctor_id and date from query parameters
        doctor_id = request.args.get("doctor_id")
        date_str = request.args.get("date")

        # Validate and parse the date
        try:
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (TypeError, ValueError):
            return {"error": "Invalid date format. Expected format is YYYY-MM-DD."}, 400

        # Query appointments by doctor and date
        appointments = db.session.query(Appointment)\
                .filter(Appointment.provider == doctor_id)\
                .filter(Appointment.appointment_date == appointment_date)

        # Debug output to verify appointments data
        print(f"Doctor ID: {doctor_id}, Appointment Date: {appointment_date}")
        print(f"Appointments found: {appointments.all()}")  # Debug output

        combined_data = []

        for appointment in appointments.all():
            # Query all patients
            patients = db.session.query(Patient).all()

            for patient in patients:
                # Check if the patient's full name matches the appointment patient
                if f"{patient.firstname.strip()} {patient.surname.strip()}" == appointment.patient:
                    appointment_id = appointment.internal_id
                    patient_id = patient.iid
                    name = f"{patient.firstname.strip()} {patient.surname.strip()}"
                    phone_number = patient.mobile_phone.strip() if patient.mobile_phone else None
                    medicare = bool(patient.medicare_no)
                    time = appointment.appointment_time
                    duration = appointment.appointment_length / 60
                    appointment_type = appointment.appointment_type.strip()

                    # Determine if the last appointment was over a year ago
                    the_one_year_ago = appointment_date - timedelta(days=365)

                    last_appointment = db.session.query(Appointment)\
                            .filter(Appointment.patient == name)\
                            .filter(
                                or_(
                                    Appointment.appointment_date < appointment_date,
                                    and_(Appointment.appointment_date == appointment_date,
                                         Appointment.appointment_time < appointment.appointment_time)
                                )
                            )\
                            .filter(func.trim(Appointment.appointment_type) != 'Telephone Consult')\
                            .order_by(desc(Appointment.appointment_date))\
                            .first()

                    over_year_ago = False
                    last_appointment_date = None
                    if last_appointment and last_appointment.appointment_date <= the_one_year_ago:
                        over_year_ago = True
                        last_appointment_date = last_appointment.appointment_date
                    elif last_appointment:
                        last_appointment_date = last_appointment.appointment_date

                    # Append the combined data for this appointment and patient
                    combined_data.append({
                        'appointmentId': appointment_id,
                        "patientId": patient_id,
                        "patient": name,
                        'phone': phone_number,
                        'medicare': medicare,
                        'overYearAgo': over_year_ago,
                        'time': time,
                        'duration': duration,
                        'appointmentType': appointment_type,
                        'lastAppointment': last_appointment_date,
                        })

        #print(f"Combined Data: {combined_data}")

        return combined_data, 200

@ns_app.route('/pcheck')
class AppointmentPCheck(Resource):
    @ns_app.param('appointment_id', 'appointment id')
    @ns_app.response(200, 'success')
    @ns_app.response(400, 'invalid app id')
    @ns_app.response(404, 'Appointment not found')
    @ns_app.marshal_list_with(appPCheck_model)
    def get(self):
        app_id = request.args.get("appointment_id")

        if not app_id:
            return {"error": "invalid appointment id"}, 400

        appointment = db.session.query(Appointment).filter_by(internal_id=app_id).first()

        if not appointment:
            ns_app.abort(404, f"Appointment with Internal ID {app_id} not found.")

        isPhone = (appointment.appointment_type == 'Telephone Consult')
        over_year_ago = False
        last_appointment_date = None

        if isPhone:
            the_one_year_ago = appointment.appointment_date - timedelta(days=365)

            # check last physical visit of the patient
            last_appointment = db.session.query(Appointment)\
                        .filter_by(patient=appointment.patient)\
                        .filter(func.trim(Appointment.appointment_type) != 'Telephone Consult')\
                        .filter(
                            or_(
                                Appointment.appointment_date < appointment.appointment_date,
                                and_(Appointment.appointment_date == appointment.appointment_date,
                                        Appointment.appointment_time < appointment.appointment_time)
                            )
                        )\
                        .order_by(desc(Appointment.appointment_date))\
                        .first()

            if last_appointment and last_appointment.appointment_date <= the_one_year_ago:
                over_year_ago = True
                last_appointment_date = last_appointment.appointment_date
            elif last_appointment:
                last_appointment_date = last_appointment.appointment_date

        return {
            'isPhone': isPhone,
            'lastAppointment': last_appointment_date,
            'overYearAgo': over_year_ago,
        }, 200


@ns_app.route('/stats')
class AppointmentStats(Resource):
    """
    Retrieves appointment statistics for a specific doctor for the current day.
    
    Parameters:
        - doctor_id (str): The ID of the doctor whose appointment statistics are to be retrieved.
    
    Returns:
        - dict: A dictionary containing the total number of bookings and total hours of appointments.
        - int: HTTP status code (200 for success, 400 if the doctor_id is invalid).
    """
    @ns_app.param('doctor_id', 'doctor id')
    @ns_app.response(200, 'success')
    @ns_app.response(400, 'invalid doctor id')
    def get(self):
        # Use request.args to get query parameters in GET requests
        doctor_id = request.args.get("doctor_id")

        if not doctor_id:
            return {"error": "invalid doctor id"}, 400

        today_date = datetime.today().strftime('%Y-%m-%d')

        appointments = Appointment.query.filter_by(provider=doctor_id, appointment_date=today_date).all()
        if not appointments:
            return {
                    "total_bookings": 0,
                    "total_hours": 0
                    }, 200

        total_bookings = len(appointments)
        total_minutes = sum(appt.appointment_length for appt in appointments)
        total_hours = total_minutes / 60.0

        return {
                "total_bookings": total_bookings,
                "total_hours": total_hours
                }, 200


@ns_app.route('/<int:internal_id>')
class AppointmentById(Resource):
    """
    Retrieves an appointment by its internal ID.
    
    Parameters:
        - internal_id (int): The internal ID of the appointment to retrieve.
    
    Returns:
        - dict: A dictionary containing appointment details if found.
            - patient (str): The patient associated with the appointment.
            - appointment_date (str): The date of the appointment.
            - appointment_time (str): The time of the appointment.
            - appointment_length (int): The length of the appointment.
            - provider (str): The provider of the appointment.
            - urgent (str): Urgency status of the appointment.
            - appointment_type (str): The type of the appointment.
            - status (str): The status of the appointment.
            - arrival_time (str): The arrival time for the appointment.
            - consultation_time (str): The consultation time for the appointment.
            - booked_by (str): The person who booked the appointment.
        - int: HTTP status code (200 for success, 404 if appointment not found).
    """
    @ns_app.response(200, 'success')
    @ns_app.response(404, 'appointment not found')
    def get(self, internal_id):
        appointment = Appointment.query.filter_by(internal_id=internal_id).first()
        if not appointment:
            return {"message": "Appointment not found"}, 404

        appoint_data = {
                'patient': checkStr(appointment.patient),
                'appointment_date': str(appointment.appointment_date).strip() or None,
                'appointment_time': appointment.appointment_time,
                'appointment_length': appointment.appointment_length,
                'provider': checkStr(appointment.provider),
                'urgent': checkStr(appointment.urgent),
                'appointment_type': checkStr(appointment.appointment_type),
                'status': checkStr(appointment.status),
                'arrival_time': appointment.arrival_time,
                'consultation_time': appointment.consultation_time,
                'booked_by': checkStr(appointment.booked_by),
                }
        return appoint_data, 200


##################
# PATIENT ROUTES #
##################
ns_pat = Namespace("patients")
@ns_pat.route("")
class Patients(Resource):
    """
    Retrieves a list of all patients.
    Returns:
        - list: A list of all patients.
        - int: HTTP status code 200 indicating success.
    """
    @ns_pat.response(200, 'success')
    @ns_pat.marshal_list_with(patient_model)
    def get(self):
        return Patient.query.all()

@ns_pat.route("/create")
class CreatePatient(Resource):
    """
    Creates a new patient record in the database.
    HTTP Methods:
        - POST: Creates a new patient record with the provided details.
    Request Body:
        - firstname (str): The first name of the patient.
        - middlename (str): The middle name of the patient.
        - preferred_name (str): The preferred name of the patient.
        - surname (str): The surname of the patient.
        - email (str): The email address of the patient.
        - status_text (str): The status text of the patient.
        - title (str): The title of the patient.
        - address1 (str): The primary address of the patient.
        - address2 (str): The secondary address of the patient.
        - city (str): The city of the patient.
        - postcode (str): The postcode of the patient.
        - postal_address (str): The postal address of the patient.
        - postal_city (str): The postal city of the patient.
        - postal_postcode (str): The postal postcode of the patient.
        - dob (str): The date of birth of the patient.
        - sex (str): The sex of the patient.
        - ethnicity (str): The ethnicity of the patient.
        - home_phone (str): The home phone number of the patient.
        - work_phone (str): The work phone number of the patient.
        - mobile_phone (str): The mobile phone number of the patient.
        - medicare_no (str): The Medicare number of the patient.
        - medicare_line_no (str): The Medicare line number of the patient.
        - medicare_expiry (str): The Medicare expiry date of the patient.
        - pension_no (str): The pension number of the patient.
        - pension_start (str): The pension start date of the patient.
        - pension_expiry (str): The pension expiry date of the patient.
        - pension_type (str): The type of pension of the patient.
        - dva_no (str): The DVA number of the patient.
        - safety_net_no (str): The safety net number of the patient.
        - record_no (str): The record number of the patient.
        - hch_tier (str): The HCH tier of the patient.
        - hch_start (str): The HCH start date of the patient.
        - religion (str): The religion of the patient.
        - health_fund_name (str): The name of the health fund of the patient.
        - health_fund_no (str): The health fund number of the patient.
        - ihi (str): The IHI of the patient.
        - usual_doctor (str): The usual doctor of the patient.
        - gender (str): The gender of the patient.
    Returns:
        - dict: A dictionary containing the internal ID of the newly created patient.
        - int: HTTP status code (201 for success).
    """
    @ns_pat.response(201, 'success')
    @ns_pat.expect(patient_model_create)
    def post(self):
        print(ns_pat.payload)
        new_patient = Patient(
                firstname=ns_pat.payload.get("firstname", ""),
                middlename=ns_pat.payload.get("middlename", ""),
                preferred_name=ns_pat.payload.get("preferred_name", ""),
                surname=ns_pat.payload.get("surname", ""),
                email=ns_pat.payload.get("email", ""),
                status_text=ns_pat.payload.get("status_text", ""),
                title=ns_pat.payload.get("title", ""),
                address1=ns_pat.payload.get("address1", ""),
                address2=ns_pat.payload.get("address2", ""),
                city=ns_pat.payload.get("city", ""),
                postcode=ns_pat.payload.get("postcode", ""),
                postal_address=ns_pat.payload.get("postal_address", ""),
                postal_city=ns_pat.payload.get("postal_city", ""),
                postal_postcode=ns_pat.payload.get("postal_postcode", ""),
                dob=datetime.strptime(ns_pat.payload.get("dob", DEFAULT_DATE), "%Y-%m-%d"),
                sex=ns_pat.payload.get("sex", ""),
                ethnicity=ns_pat.payload.get("ethnicity", ""),
                home_phone=ns_pat.payload.get("home_phone", ""),
                work_phone=ns_pat.payload.get("work_phone", ""),
                mobile_phone=ns_pat.payload.get("mobile_phone", ""),
                medicare_no=ns_pat.payload.get("medicare_no", ""),
                medicare_line_no=ns_pat.payload.get("medicare_line_no", ""),
                medicare_expiry=ns_pat.payload.get("medicare_expiry", ""),
                pension_no=ns_pat.payload.get("pension_no", ""),
                pension_start=datetime.strptime(ns_pat.payload.get("pension_start", DEFAULT_DATE), "%Y-%m-%d"),
                pension_expiry=datetime.strptime(ns_pat.payload.get("pension_expiry", DEFAULT_DATE), "%Y-%m-%d"),
                pension_type=ns_pat.payload.get("pension_type", ""),
                dva_no=ns_pat.payload.get("dva_no", ""),
                safety_net_no=ns_pat.payload.get("safety_net_no", ""),
                record_no=ns_pat.payload.get("record_no", ""),
                hch_tier=ns_pat.payload.get("hch_tier", ""),
                hch_start=datetime.strptime(ns_pat.payload.get("hch_start", DEFAULT_DATE), "%Y-%m-%d"),
                religion=ns_pat.payload.get("religion", ""),
                health_fund_name=ns_pat.payload.get("health_fund_name", ""),
                health_fund_no=ns_pat.payload.get("health_fund_no", ""),
                ihi=ns_pat.payload.get("ihi", ""),
                usual_doctor=ns_pat.payload.get("usual_doctor", ""),
                gender=ns_pat.payload.get("gender", "")
                )
        db.session.add(new_patient)
        db.session.commit()
        return {'iid': new_patient.iid}, 201

@ns_pat.route("/edit/<int:iid>")
class EditPatient(Resource):
    """
    Updates a patient's information by their internal ID.
    
    Parameters:
        - iid (int): The internal ID of the patient to update.
    
    Returns:
        - dict: The updated patient information.
        - int: HTTP status code (200 for success, 404 if patient not found).
    """
    @ns_pat.response(200, 'success')
    @ns_pat.response(404, 'Patient not found')
    @ns_pat.expect(patient_model_create) 
    @ns_pat.marshal_with(patient_model_create)
    def put(self, iid):
        patient = db.session.query(Patient).filter_by(iid=iid).first()

        if not patient:
            ns_pat.abort(404, f"Patient with ID {iid} not found")

        patient.firstname = ns_pat.payload.get("firstname", "")
        patient.surname = ns_pat.payload.get("surname", "")
        patient.email = ns_pat.payload.get("email", "")
        patient.title = ns_pat.payload.get("title", "")
        patient.address1 = ns_pat.payload.get("address1", "")
        patient.address2 = ns_pat.payload.get("address2", "")
        patient.city = ns_pat.payload.get("city", "")
        patient.postcode = ns_pat.payload.get("postcode", "")
        patient.dob = datetime.strptime(ns_pat.payload.get("dob", DEFAULT_DATE), "%Y-%m-%d")
        patient.sex = ns_pat.payload.get("sex", "")
        patient.mobile_phone = ns_pat.payload.get("mobile_phone", "")
        patient.medicare_no = ns_pat.payload.get("medicare_no", "")
        patient.medicare_line_no = ns_pat.payload.get("medicare_line_no", "")
        # patient.medicare_expiry = ns_pat.payload.get("medicare_expiry", "")  # should add functionality
        patient.health_fund_name = ns_pat.payload.get("health_fund_name", "")
        patient.health_fund_no = ns_pat.payload.get("health_fund_no", "")

        db.session.commit()

        return patient

@ns_pat.route("/delete/<int:iid>")
class DeletePatient(Resource):
    """
    Deletes a patient by their internal ID.

    Parameters:
        - iid (int): The internal ID of the patient to delete.

    Returns:
        - dict: Success message.
        - int: HTTP status code (200 for success, 404 if patient not found).
    """
    @ns_pat.response(200, 'Patient successfully deleted')
    @ns_pat.response(404, 'Patient not found')
    def delete(self, iid):
        patient = db.session.query(Patient).filter_by(iid=iid).first()

        if not patient:
            ns_pat.abort(404, f"Patient with ID {iid} not found")

        db.session.delete(patient)
        db.session.commit()

        return {'message': f"Patient {iid} was deleted successfully"}, 200

@ns_pat.route('/<int:patient_id>')
class PatientById(Resource):
    """
    Retrieves patient information and their appointments by patient ID.

    Parameters:
        - patient_id (int): The ID of the patient to retrieve.

    Responses:
        - 200: Success, returns patient data and appointments.
        - 404: Patient not found.

    Returns:
        - dict: Patient information including personal details, contact information, and appointments.
        - int: HTTP status code (200 for success, 404 if patient not found).
    """
    @ns_pat.response(200, 'success')
    @ns_pat.response(404, 'patient not found')
    def get(self, patient_id):
        patient = Patient.query.filter_by(iid=patient_id).first()
        if not patient:
            return {"message": "Patient not found"}, 404

        patientName = f"{patient.firstname.strip()} {patient.surname.strip()}"
        appointments = Appointment.query.filter_by(patient=patientName).all()

        # address = ', '.join(filter(None, [checkStr(patient.address1), checkStr(patient.address2), checkStr(patient.city), checkStr(patient.postcode)]))
        # changed so that its easier to use and more universal
        postal = ', '.join(filter(None, [checkStr(patient.postal_address), checkStr(patient.postal_city), checkStr(patient.postal_postcode)]))

        patient_data = {
                'iid': patient.iid,
                'title': checkStr(patient.title),
                'firstname': checkStr(patient.firstname),
                'surname': checkStr(patient.surname),
                'email': checkStr(patient.email),
                'dob': patient.dob.strftime('%Y-%m-%d') if patient.dob else None,
                'gender': checkStr(patient.sex),
                'phone': (patient.mobile_phone or "NA").replace(" ", ""), # or patient.home_phone or patient.work_phone
                'mobile_phone': checkStr(patient.mobile_phone),
                'home_phone': checkStr(patient.home_phone),
                'work_phone': checkStr(patient.work_phone),
                'address1': checkStr(patient.address1),
                'address2': checkStr(patient.address2),
                'city': checkStr(patient.city),
                'postcode': checkStr(patient.postcode),
                'medicare_no': checkStr(patient.medicare_no),
                'health_fund_name': checkStr(patient.health_fund_name),
                'health_fund_no': checkStr(patient.health_fund_no),
                'appointments': [],
                }

        for appointment in appointments:
            appointment_data = {
                    'appointment_id': appointment.internal_id,
                    'appointment_date': str(appointment.appointment_date).strip() or None,
                    'appointment_time': appointment.appointment_time,
                    'appointment_length': appointment.appointment_length,
                    'appointment_type': checkStr(appointment.appointment_type),
                    'provider': checkStr(appointment.provider),
                    'urgent': checkStr(appointment.urgent),
                    'status': checkStr(appointment.status),
                    }
            patient_data['appointments'].append(appointment_data)

        return patient_data, 200


@ns_pat.route("/names")
class PatientNames(Resource):
    """
    Retrieves a list of patient names.
    
    This method queries all patients from the database and constructs a list of their full names,
    with each name formatted as "firstname surname".
    
    Returns:
        - list: A list of strings, each representing a patient's full name.
        - int: HTTP status code (200 for success).
    """
    @ns_pat.response(200, 'success')
    def get(self):
        patients = Patient.query.all()  # Query all patients
        patient_names = [f"{patient.firstname.strip()} {patient.surname.strip()}" for patient in patients]
        return patient_names, 200


###############
# AUTH ROUTES #
###############
ns_auth = Namespace("auth")
@ns_auth.route('/create_connection')
class CreateConnection(Resource):
    """
    Handles the creation of a new database connection using provided parameters.
    Parameters:
        - None
    Returns:
        - dict: A dictionary containing the connection string if successful, or an error message if an exception occurs.
        - int: HTTP status code (200 for success, 400 if an error occurs).
    """
    @ns_auth.expect(create_connection_model)
    def post(self):
        data = ns_auth.payload
        try:
            # Extract connection parameters from the JSON payload
            username = data["username"]
            password = data["password"]
            host = data["host"]
            port = data["port"]
            database = data["database"]
            driver = data["driver"]

            connection_string = f"mssql+pyodbc://{username}:{password}@{host}:{port}/{database}?driver={driver}"
            current_app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
            
            # Initialize db with app (only if not already initialized)
            with current_app.app_context():
                db.init_app(current_app)
            #engine = create_engine(connection_string)
            #Session = scoped_session(sessionmaker(bind=engine))

            return {"connection_string": connection_string}, 200

        except Exception as e:
            return {"error": str(e)}, 400
        
@ns_auth.route('/register')
class Register(Resource):
    """
    Handles the user registration process.
    This method expects a payload containing user details and creates a new user if the provided data is valid.
    Parameters:
        - None (data is extracted from the request payload)
    Returns:
        - dict: A success message and user details if the user is created successfully.
        - int: HTTP status code (201 for success, 400 for invalid data).
    """
    @ns_auth.expect(register_model) #for params appear in swagger
    @ns_auth.response(201, 'User created successfully')
    @ns_auth.response(400, 'Invalid data provided')
    def post(self):
        data = ns_auth.payload
        if 'title' in data and 'organisation' in data and 'position' in data and 'email' in data and 'password' in data and 'first_name' in data and 'last_name' in data:
            if 'profile_img' in data:
                return auth_register(data['email'], data['password'], data['first_name'], data['last_name'], data['title'], data['position'], data['profile_img'], data["organisation"])
            else:
                return auth_register(data['email'], data['password'], data['first_name'], data['last_name'], data['title'], data['position'], '', data["organisation"])

        else:
            return {"success":False, "message": "Invalid Input"}, 400

@ns_auth.route('/login')
class Login(Resource):
    """
    Handles user login requests.
    
    This method expects a payload containing 'email' and 'password' fields.
    
    Parameters:
        - None (data is extracted from the request payload)
    
    Returns:
        - dict: A dictionary containing the authentication result.
        - int: HTTP status code (201 for success, 400 for invalid data).
    """
    @ns_auth.expect(login_model) #for params appear in swagger
    @ns_auth.response(201, 'User created successfully')
    @ns_auth.response(400, 'Invalid data provided')
    def post(self):
        data = ns_auth.payload
        if 'email' in data and 'password' in data:
            return auth_login(data['email'], data['password'])
        else:
            return {"success":False, "message": "Invalid Input"}, 400

@ns_auth.route("/logout")
class Logout(Resource):
    """
    Handles the logout process for a user.

    Parameters:
        - token (str): The authentication token of the user.

    Returns:
        - dict: A message indicating the result of the logout process.
        - int: HTTP status code (200 for successful logout, 401 if the token is invalid).
    """
    @ns_auth.response(200, 'Logout successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    @require_auth
    def post(self, token):
        token,_,_ = extract_token()
        return auth_logout(token)

@ns_auth.route("/check_verify")
class CheckVerify(Resource):
    """
    Verifies the provided token.

    Parameters:
        - token (str): The token to be verified.

    Returns:
        - dict: Verification status message.
        - int: HTTP status code (200 for success, 401 for unauthorized, 500 for internal server error).
    """
    @ns_auth.response(200, 'Verified')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    @ns_auth.response(500, 'Internal Server Error')
    @require_auth
    def get(self, token):
        token, _, _ = extract_token()
        return auth_check_verify(token)

@ns_auth.route("/verify")
class Verify(Resource):
    """
    Verifies the provided token.
    
    Parameters:
        - None (token is expected to be provided as a query parameter 'verify_token')
    
    Returns:
        - dict: Verification result with a success message or error message.
        - int: HTTP status code (200 for success, 401 for invalid token, 400 for invalid input).
    """
    @ns_auth.response(200, 'Verified')
    @ns_auth.response(401, 'Invalid token')
    def get(self):
        data = request.args.get('verify_token')
        if data:
            return auth_verify(data)
        else:
            return {"success":False, "message": "Invalid Input"}, 400

@ns_auth.route("/resetPasswordRequest")
class ResetPasswordRequest(Resource):
    """
    Handles the POST request for resetting a password.

    This method expects an email in the payload and sends a password reset request
    if the email is valid.

    Responses:
        - 200: Email Sent successfully
        - 401: Unauthorized: Invalid email
        - 400: Invalid Input if email is not provided in the payload

    Returns:
        - dict: A dictionary containing the success status, message, and reset code.
        - int: HTTP status code.
    """
    @ns_auth.expect(reset_password_request_model) #for params appear in swagger
    @ns_auth.response(200, 'Email Sent successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid email')
    def post(self):
        data = ns_auth.payload
        if 'email' in data:
            return auth_reset_password_request(data['email'])
        else:
            return {"success":False, "message": "Invalid Input", "reset_code": None }, 400

@ns_auth.route("/resetPassword")
class ResetPassword(Resource):
    """
    Handles the password reset request.
    
    This method expects a payload containing a reset code and a new password.
    It validates the presence of these fields and calls the `auth_reset_password` 
    function to reset the password.

    Parameters:
        None

    Returns:
        - dict: A success message if the password is reset successfully.
        - int: HTTP status code (200 for success, 401 for unauthorized, 400 for invalid input).
    """
    @ns_auth.expect(reset_password_model) #for params appear in swagger
    @ns_auth.response(200, 'Reset successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    def post(self):
        data = ns_auth.payload
        if 'reset_code' in data and 'password' in data:
            return auth_reset_password(data['reset_code'], data['password'])
        else:
            return {"success":False, "message": "Invalid Input"}, 400

@ns_auth.route("/editProfile")
class EditProfile(Resource):
    """
    Edits the user profile with the provided data.
    
    Parameters:
        - token (str): The authentication token of the user.
    
    Returns:
        - dict: Success message if the profile is edited successfully.
        - int: HTTP status code (200 for success, 400 for invalid input, 401 for unauthorized access).
    """
    @ns_auth.expect(edit_profile_model) #for params appear in swagger
    @ns_auth.response(200, 'Edit successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    @require_auth
    def post(self, token):
        token,_,_ = extract_token()
        data = ns_auth.payload
        if 'position' in data and 'avatar' in data and 'first_name' in data and 'last_name' in data and 'title' in data and 'organisation' in data and 'password' in data:
            logging.debug('wait')
            return auth_edit_profile(token, data['position'], data['avatar'], data['first_name'], data['last_name'], data['title'], data['organisation'], data['password'])
        else:
            logging.debug('failllll')
            return {"success":False, "message": "Invalid Input"}, 400


@ns_auth.route("/getProfile")
class GetProfile(Resource):
    """
    Retrieves the profile information of a user based on the provided user ID.
    
    Parameters:
        - token (str): The authentication token of the user making the request.
    
    Query Parameters:
        - userId (str): The ID of the user whose profile information is being requested.
    
    Returns:
        - dict: The profile information of the user.
        - int: HTTP status code (200 for success, 401 for unauthorized access).
    """
    @ns_auth.param('userId', 'user id')
    @ns_auth.response(200, 'Get User Info successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    @require_auth
    def get(self, token):
        userId = request.args.get('userId')
        token,_,_ = extract_token()
        return auth_get_profile(token, userId)

@ns_auth.route("/getAllProfile")
class GetAllProfile(Resource):
    """
    Retrieves all profiles associated with the provided token.
    
    Parameters:
        - token (str): The authentication token used to validate the request.
    
    Returns:
        - dict: A dictionary containing all profiles if the token is valid.
        - int: HTTP status code (200 for success, 401 if unauthorized).
    """
    @ns_auth.response(200, 'Edit successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    @require_auth
    def get(self, token):
        token,_,_ = extract_token()
        return auth_get_all_profile(token)

@ns_auth.route("/deleteAccount")
class DeleteAccount(Resource):
    """
    Deletes a user account based on the provided token.
    
    Parameters:
        - token (str): The authentication token of the user whose account is to be deleted.
    
    Returns:
        - dict: Success message if the account is deleted successfully.
        - int: HTTP status code (200 for success, 401 for unauthorized access, 404 if user not found).
    """
    @ns_auth.response(200, 'Account deleted successfully')
    @ns_auth.response(401, 'Unauthorized: Invalid token')
    @ns_auth.response(404, 'User not found')
    @require_auth
    def delete(self, token):
        token, _, _ = extract_token()
        return auth_delete_account(token)


# return all doctors
@ns_app.route('/doctors')
class DoctorList(Resource):
    """
    Retrieves a list of unique doctor names from the appointments.
    Returns:
        - list: A list of dictionaries, each containing a doctor's name.
        - int: HTTP status code 200 for success.
    """
    @ns_app.response(200, 'success')
    @ns_app.marshal_list_with(ns_app.model('Doctor', {
        'name': fields.String(description='Doctor Name')
    }))
    def get(self):
        doctor_names = db.session.query(Appointment.provider).distinct().all()
        
        unique_doctors = set()
        doctors = []

        for doctor_name in doctor_names:
            if doctor_name[0] not in unique_doctors:
                unique_doctors.add(doctor_name[0])
                doctors.append({'name': doctor_name[0]})

        return doctors
