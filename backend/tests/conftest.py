import pytest
from app import create_app, db

"""
Pytest fixture that sets up a Flask test client with an in-memory SQLite database.

This fixture creates a new Flask application configured for testing, initializes
the database, and provides a test client for making requests to the application.
After the test is complete, the database is dropped.

Yields:
    FlaskClient: A test client for the Flask application.
"""
@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()
