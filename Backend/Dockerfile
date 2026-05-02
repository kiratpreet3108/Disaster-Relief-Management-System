FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install flask flask-cors oracledb

CMD ["python", "app.py"]