# 🌍 Disaster Relief Management System

A full-stack web application designed to manage and coordinate disaster relief operations efficiently. The system enables tracking of disasters, victims, shelters, and resources in real time.

---

## 🚀 Tech Stack

* **Frontend:** React.js
* **Backend:** Flask (Python)
* **Database:** Oracle 21c XE
* **API:** RESTful services

---

## 📌 Features

* 🔹 Disaster tracking and management
* 🔹 Victim registration and monitoring
* 🔹 Shelter allocation system
* 🔹 Resource distribution management
* 🔹 Real-time data visualization (charts & dashboard)
* 🔹 Integrated Oracle database for reliable storage

---

## 🏗️ System Architecture

Frontend (React) → Backend (Flask API) → Oracle Database

* React handles UI and user interaction
* Flask processes requests and business logic
* Oracle stores structured disaster data

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the repository

```bash
git clone https://github.com/kiratpreet3108/Disaster-Relief-Management-System.git
cd Disaster-Relief-Management-System
```

---

### 🔹 2. Setup Database (Oracle)

* Open SQL Developer / SQL*Plus
* Run the SQL script:

```sql
@Database.sql
```

---

### 🔹 3. Run Backend (Flask)

```bash
cd Backend
pip install flask flask-cors oracledb
python app.py
```

👉 Backend runs on:

```
http://127.0.0.1:5000
```

---

### 🔹 4. Run Frontend (React)

```bash
cd frontend
npm install
npm start
```

👉 Frontend runs on:

```
http://localhost:3000
```

---

## 🔗 API Endpoint

* Base URL:

```
http://127.0.0.1:5000
```

* Example:

```
GET /
→ Returns API status and DB connection
```

---

## 📊 Project Workflow

1. User interacts with frontend UI
2. React sends request to Flask API
3. Flask processes request and queries Oracle DB
4. Data returned and displayed in dashboard

---

## 📷 Screenshots (Add your own)

* Dashboard view
* Disaster records
* Resource allocation

---

## 🧠 Learning Outcomes

* Built a full-stack application using modern technologies
* Integrated Oracle database with Python backend
* Designed REST APIs and frontend UI
* Understood real-world disaster management systems

---

## 👨‍💻 Author

**Kiratpreet Kaur**
GitHub: https://github.com/kiratpreet3108

---

## ⭐ Acknowledgements

* Oracle Database XE
* React & Flask documentation
* Open-source community

---

## 📌 Future Improvements

* 🔹 Authentication system (login/signup)
* 🔹 Deployment on cloud (AWS / Render)
* 🔹 Real-time alerts system
* 🔹 Mobile app integration

---

⭐ If you like this project, give it a star!
