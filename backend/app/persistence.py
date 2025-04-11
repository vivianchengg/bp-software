import json

DATA_FILE = './app/data.json'

"""
Loads data from a JSON file.
Parameters: None
Returns:
- dict: The data loaded from the JSON file.
"""
def loadData():
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

"""
 Saves data to a JSON file.
 Parameters:
   - data (dict): The data to be saved to the JSON file.
 Returns: None
"""
def saveData(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)