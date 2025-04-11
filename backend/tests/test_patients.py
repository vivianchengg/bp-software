
import datetime

#################
# Patient Tests #
#################
class TestPatients:

    def test_create_patient(self, client):
        response = client.post('/patients/create', json={
            "firstname": "Jane",
            "middlename": "Marie",
            "preferred_name": "Janey",
            "surname": "Doe",
            "email": "jane@example.com",
            "status_text": "Active",
            "title": "Ms",
            "address1": "123 Main St",
            "address2": "Apt 4B",
            "city": "Springfield",
            "postcode": "1234",
            "postal_address": "PO Box 123",
            "postal_city": "Springfield",
            "postal_postcode": "1234",
            "dob": "1990-1-1",
            "sex": "Female",
            "ethnicity": "Caucasian",
            "home_phone": "555-1234",
            "work_phone": "555-5678",
            "mobile_phone": "555-8765",
            "medicare_no": "1234567890",
            "medicare_line_no": "1",
            "medicare_expiry": "2025-1-1",
            "pension_no": "987654321",
            "pension_start": "2020-1-1",
            "pension_expiry": "2030-1-1",
            "pension_type": "Type A",
            "dva_no": "DVA12345",
            "safety_net_no": "SN12345",
            "record_no": "R12345",
            "hch_tier": "Tier 1",
            "hch_start": "2021-1-1",
            "religion": "None",
            "health_fund_name": "Fund ABC",
            "health_fund_no": "HF12345",
            "ihi": "IHI12345",
            "usual_doctor": "Dr. Smith",
            "gender": "Female"
        })
        assert response.status_code == 201
        assert response.json['iid'] is not None

    def test_get_patient_by_id(self, client):
        client.post('/patients/create', json={
            "firstname": "Jane",
            "dob": "1990-1-1",
            "email": "jane@example.com",
            "dob": "1990-01-01",
            "sex": "Female",
            "mobile_phone": "1234567890"
        })
        response = client.get('/patients/1')
        assert response.status_code == 200
        assert response.json['firstname'] == "Jane"

    def test_edit_patient(self, client):
        client.post('/patients/create', json={
            "firstname": "Jane",
            "middlename": "Marie",
            "preferred_name": "Janey",
            "surname": "Doe",
            "email": "jane@example.com",
            "status_text": "Active",
            "title": "Ms",
            "address1": "123 Main St",
            "address2": "Apt 4B",
            "city": "Springfield",
            "postcode": "1234",
            "postal_address": "PO Box 123",
            "postal_city": "Springfield",
            "postal_postcode": "1234",
            "dob": "1990-01-01",
            "sex": "Female",
            "ethnicity": "Caucasian",
            "home_phone": "555-1234",
            "work_phone": "555-5678",
            "mobile_phone": "555-8765",
            "medicare_expiry": "2025-1-1",
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
            "gender": "Female"
        })

        # Edit the patient
        response = client.put('/patients/edit/1', json={
            "firstname": "Jane Updated",
            "middlename": "Marie Updated",
            "preferred_name": "Janey Updated",
            "surname": "Doe Updated",
            "email": "jane_updated@example.com",
            "status_text": "Inactive",
            "title": "Mrs",
            "address1": "456 Elm St",
            "address2": "Suite 5A",
            "city": "Shelbyville",
            "postcode": "5432",
            "postal_address": "PO Box 456",
            "postal_city": "Shelbyville",
            "postal_postcode": "5432",
            "dob": "1991-2-2",
            "sex": "Female",
            "ethnicity": "Asian",
            "home_phone": "555-4321",
            "work_phone": "555-8765",
            "mobile_phone": "555-5678",
            "medicare_no": "0987654321",
            "medicare_line_no": "2",
            "medicare_expiry": "2026-2-1",
            "pension_no": "123456789",
            "pension_start": "2021-2-2",
            "pension_expiry": "2031-2-2",
            "pension_type": "Type B",
            "dva_no": "DVA54321",
            "safety_net_no": "SN54321",
            "record_no": "R54321",
            "hch_tier": "Tier 2",
            "hch_start": "2022-2-2",
            "religion": "Buddhism",
            "health_fund_name": "Fund XYZ",
            "health_fund_no": "HF54321",
            "ihi": "IHI54321",
            "usual_doctor": "Dr. Brown",
            "gender": "Female"
        })
        assert response.status_code == 200
        assert response.json['dob'] == "1991-02-02T00:00:00"
        assert response.json['address1'] == "456 Elm St"
        assert response.json['dob'] == "1991-02-02" + "T00:00:00"

    def test_delete_patient(self, client):
        client.post('/patients/create', json={
            "firstname": "Jane",
            "surname": "Doe",
            "email": "jane@example.com",
            "dob": "1990-01-01",
            "sex": "Female",
            "mobile_phone": "1234567890"
        })
        response = client.delete('/patients/delete/1')
        assert response.status_code == 200
        assert response.json["message"] == "Patient 1 was deleted successfully"
