import os
import pytest
from app import create_app, db
from app.models import Appointment, Patient
from datetime import datetime


#####################
# Appointment Tests #
#####################
class TestAppointments:
    def test_get_all_appointments(self, client):
        response = client.get('/appointments')
        assert response.status_code == 200

    def test_create_appointment(self, client):
        response = client.post('/appointments/create', json={
            "patient": "John Doe",
            "appointment_date": "2024-11-07",
            "appointment_time": 900,
            "appointment_length": 30,
            "provider": "Dr. Smith",
            "urgent": "Yes",
            "appointment_type": "Consultation",
            "status": "Confirmed",
            "arrival_time": 850,
            "consultation_time": 915,
            "booked_by": "Receptionist"
        })
        assert response.status_code == 201
        assert response.json['patient'] == "John Doe"

    def test_edit_appointment(self, client):
        # Create an appointment to edit
        client.post('/appointments/create', json={
            "patient": "Jane Doe",
            "appointment_date": "2024-11-07",
            "appointment_time": 900,
            "appointment_length": 30,
            "provider": "Dr. Smith",
            "urgent": "No",
            "appointment_type": "Follow-up",
            "status": "Scheduled",
            "arrival_time": 850,
            "consultation_time": 915,
            "booked_by": "Receptionist"
        })
        # Edit the appointment
        response = client.put('/appointments/edit/1', json={
            "patient": "Jane Doe Updated",
            "appointment_date": "2024-11-08",
            "appointment_time": 930,
            "appointment_length": 30,
            "provider": "Dr. Brown",
            "urgent": "Yes",
            "appointment_type": "Consultation",
            "status": "Confirmed",
            "arrival_time": 920,
            "consultation_time": 945,
            "booked_by": "Admin"
        })
        assert response.status_code == 200
        assert response.json['patient'] == "Jane Doe Updated"

    def test_delete_appointment(self, client):
        # Create an appointment to delete
        client.post('/appointments/create', json={
            "patient": "John Doe",
            "appointment_date": "2024-11-07",
            "appointment_time": 900,
            "appointment_length": 30,
            "provider": "Dr. Smith",
            "urgent": "No",
            "appointment_type": "Consultation",
            "status": "Scheduled",
            "arrival_time": 850,
            "consultation_time": 915,
            "booked_by": "Receptionist"
        })
        # Delete the appointment
        response = client.delete('/appointments/delete/1')
        assert response.status_code == 200
        assert response.json["message"] == "Appointment 1 was deleted successfully"

    def test_filter_appointments_by_doctor_and_date(self, client):
        # Create a patient that matches the appointment
        client.post('/patients/create', json={
            "firstname": "John",
            "middlename": "",
            "preferred_name": "Johnny",
            "surname": "Doe",
            "email": "john.doe@example.com",
            "status_text": "Active",
            "title": "Mr",
            "address1": "123 Main St",
            "address2": "Apt 4B",
            "city": "Springfield",
            "postcode": "1235",
            "postal_address": "PO Box 123",
            "postal_city": "Springfield",
            "postal_postcode": "1235",
            "dob": "1990-01-01",
            "sex": "Male",
            "ethnicity": "Caucasian",
            "home_phone": "555-1234",
            "work_phone": "555-5678",
            "mobile_phone": "555-8765",
            "medicare_no": "1234567890",
            "medicare_line_no": "1",
            "medicare_expiry": "2025-01",
            "pension_no": "987654321",
            "pension_start": "2020-01-01",
            "pension_expiry": "2030-01-01",
            "pension_type": "Type A",
            "dva_no": "DVA12345",
            "safety_net_no": "SN12345",
            "record_no": "R12345",
            "hch_tier": "Tier 1",
            "hch_start": "2021-01-01",
            "religion": "None",
            "health_fund_name": "Fund ABC",
            "health_fund_no": "HF12345",
            "ihi": "IHI12345",
            "usual_doctor": "Dr. Smith",
            "gender": "Male"
        })

        # Create an appointment to filter
        client.post('/appointments/create', json={
            "patient": "John Doe",
            "appointment_date": "2024-11-07",  # Date format matches the filter route
            "appointment_time": 900,
            "appointment_length": 30,
            "provider": "Dr. Smith",  # Ensure provider matches doctor_id
            "urgent": "No",
            "appointment_type": "Consultation",
            "status": "Scheduled",
            "arrival_time": 850,
            "consultation_time": 915,
            "booked_by": "Receptionist"
        })

        # Use query_string to pass GET parameters
        response = client.get(
            '/appointments/filter',
            query_string={"doctor_id": "Dr. Smith", "date": "2024-11-07"}
        )

        # Assert the response contains one result
        assert response.status_code == 200
        assert len(response.json) == 1  # Check if we get exactly one result
        assert response.json[0]['patient'] == "John Doe"

    def test_get_appointment_stats(self, client):
        # Create an appointment to ensure stats are generated
        today_date = datetime.today().strftime('%Y-%m-%d')
        client.post('/appointments/create', json={
            "patient": "John Doe",
            "appointment_date": today_date,
            "appointment_time": 900,
            "appointment_length": 30,
            "provider": "Dr. Smith",
            "urgent": "Yes",
            "appointment_type": "Consultation",
            "status": "Confirmed",
            "arrival_time": 850,
            "consultation_time": 915,
            "booked_by": "Receptionist"
        })

        # Ensure correct parameters and headers for the GET request
        response = client.get(
            '/appointments/stats',
            query_string={"doctor_id": "Dr. Smith"}
        )

        assert response.status_code == 200
        assert response.json["total_bookings"] == 1
        assert response.json["total_hours"] == 0.5

    def test_get_appointment_notes(self, client):
        # Add a note to an appointment
        client.post('/appointments/create', json={
            "patient": "John Doe",
            "appointment_date": "2024-11-07",
            "appointment_time": 900,
            "appointment_length": 30,
            "provider": "Dr. Smith",
            "urgent": "Yes",
            "appointment_type": "Consultation",
            "status": "Confirmed",
            "arrival_time": 850,
            "consultation_time": 915,
            "booked_by": "Receptionist"
        })
        response = client.put('/appointments/notes/1', json={
            "note": "Patient prefers morning appointments."
        })
        assert response.status_code == 200
        response = client.get('/appointments/notes/1')
        assert response.status_code == 200
        assert response.json['note'] == "Patient prefers morning appointments."

