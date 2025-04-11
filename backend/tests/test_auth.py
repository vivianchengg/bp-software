import pytest

# Global variable to cache the registration response
_register_response = None

@pytest.fixture
def register_user(client):
    global _register_response
    if _register_response is None:
        response = client.post('/auth/register', json={
            'email': 'unique_test@example.com',
            'password': 'password123',
            'first_name': 'Test',
            'last_name': 'User',
            'title': 'Dr.',
            'position': 'Doctor',
            'profile_img': '',
            'organisation': 'Hospital'
        })
        assert response.status_code == 201
        assert response.json['success'] is True
        _register_response = response
    return _register_response

class TestAuth:
    @pytest.mark.order(1)
    def test_register_user(self, register_user):
        # The assertions are in the fixture
        pass

    @pytest.mark.order(2)
    def test_verify_user(self, client, register_user):
        verify_token = register_user.json['verify_token']  # Retrieve verification token
        print(register_user.json)
        response = client.get(f'/auth/verify?verify_token={verify_token}')
        print(response.json)
        assert response.status_code == 201
        assert response.json['success'] is True

    @pytest.mark.order(3)
    def test_login_user(self, client):
        response = client.post('/auth/login', json={
            'email': 'unique_test@example.com',  # Match the registered email
            'password': 'password123'
        })
        print(response.json)
        assert response.status_code == 200
        assert 'token' in response.json

    @pytest.mark.order(4)
    def test_login_invalid_password(self, client):
        response = client.post('/auth/login', json={
            'email': 'unique_test@example.com',
            'password': 'wrongpassword'
        })
        assert response.status_code == 400
        assert response.json['message'] == 'Invalid email or password'

    @pytest.mark.order(5)
    def test_reset_password_request(self, client):
        response = client.post('/auth/resetPasswordRequest', json={
            'email': 'unique_test@example.com'
        })
        print(response.json)
        assert response.status_code == 200
        assert response.json['success'] is True

    @pytest.mark.order(6)
    def test_reset_password(self, client):
        reset_request_response = client.post('/auth/resetPasswordRequest', json={
            'email': 'unique_test@example.com'
        })
        reset_code = reset_request_response.json['reset_code']  # Retrieve reset code

        response = client.post('/auth/resetPassword', json={
            'reset_code': reset_code,
            'password': 'newpassword123'
        })
        print(response.json)
        assert response.status_code == 200
        assert response.json['success'] is True

    @pytest.mark.order(7)
    def test_logout_user(self, client):
        # Log in to obtain a token
        login_response = client.post('/auth/login', json={
            'email': 'unique_test@example.com',
            'password': 'newpassword123'
        })
        assert login_response.status_code == 200
        token = login_response.json.get('token')
        assert token is not None

        # Use the token to log out
        response = client.post('/auth/logout', headers={
            'Authorization': f'Bearer {token}'
        })
        print(response.json)
        assert response.status_code == 200
        assert response.json['success'] is True

    @pytest.mark.order(8)
    def test_delete_user(self, client):
        # Log in to obtain a token
        login_response = client.post('/auth/login', json={
            'email': 'unique_test@example.com',
            'password': 'newpassword123'
        })
        print(login_response.json)
        assert login_response.status_code == 200
        token = login_response.json.get('token')
        assert token is not None

        # Use the token to delete the user
        response = client.delete('/auth/deleteAccount', headers={
            'Authorization': f'Bearer {token}'
        })
        print(response.json)
        assert response.status_code == 200
        assert response.json['success'] is True
