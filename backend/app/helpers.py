from datetime import timedelta, timezone, datetime

AUTH_COUNTER = 0

"""
Get the current time in UTC as a timestamp.

Returns:
    int: The current UTC time as a Unix timestamp.
"""
def time_now():

    return int(datetime.now(timezone.utc).replace(tzinfo=timezone.utc).timestamp())

"""
Generate a unique user ID by incrementing a global counter.

Returns:
    int: The next unique user ID.
"""
def generate_user_id():
 
    global AUTH_COUNTER
    AUTH_COUNTER += 1
    return AUTH_COUNTER

"""
Check if a string is not empty or whitespace.

Args:
    str (str): The string to check.

Returns:
    str or None: The stripped string if it is not empty or whitespace, otherwise None.
"""
def checkStr(str):

    return str.strip() if str and str.strip() else None

"""
Check if there are any non-phone appointments in the past 12 months.

Args:
    appointments (list): A list of appointment objects with 'appointment_type' and 'appointment_date' attributes.

Returns:
    bool: True if there is at least one non-phone appointment in the past 12 months, otherwise False.
"""
def has_attended_past_12_months(appointments):

    non_phone_past_apps = [a for a in appointments if a.appointment_type != 'Phone' and a.appointment_date <= datetime.now().date()]

    if len(non_phone_past_apps) == 0:
        return False

    non_phone_past_apps.sort(key=lambda a: a.appointment_date, reverse=True)
    last_app_date = non_phone_past_apps[0].appointment_date
    one_year_ago = datetime.now().date() - timedelta(days=365)

    return last_app_date >= one_year_ago

"""
Check if there are any upcoming phone appointments.

Args:
    appointments (list): A list of appointment objects with 'appointment_type' and 'appointment_date' attributes.

Returns:
    bool: True if there is at least one upcoming phone appointment, otherwise False.
"""
def has_upcoming_phone_appointment(appointments):

    future_appointments = [a for a in appointments if a.appointment_date > datetime.now().date()]
    return any(a.appointment_type == 'Telephone Consult' for a in future_appointments)
