# Force the use of the amd64 architecture for Python image
FROM --platform=linux/amd64 python:3.8-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    apt-transport-https \
    gnupg \
    unixodbc-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV LD_LIBRARY_PATH=/opt/microsoft/msodbcsql17/lib:$LD_LIBRARY_PATH

CMD ["flask", "run", "--host=0.0.0.0", "--reload", "--debugger"]
# flask run --host=0.0.0.0 --reload --debugger

