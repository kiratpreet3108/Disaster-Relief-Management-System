"""
Disaster Relief Management System — Flask Backend
UCS310 · TIET Patiala · 2025-26
Oracle XE + python-oracledb
"""

import datetime
import oracledb
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ── DB Config ─────────────────────────────────────────────────
DB_USER     = "system"
DB_PASSWORD = "31082006"
DB_DSN      = "localhost:1521/XE"


def get_conn():
    return oracledb.connect(user=DB_USER, password=DB_PASSWORD, dsn=DB_DSN)


def rows_to_dicts(cursor):
    cols = [d[0].lower() for d in cursor.description]
    result = []
    for row in cursor.fetchall():
        record = {}
        for k, v in zip(cols, row):
            if isinstance(v, datetime.datetime):
                record[k] = v.strftime("%Y-%m-%d")
            else:
                record[k] = v
        result.append(record)
    return result


def ok(data):
    return jsonify(data)


def err(e, code=500):
    print(f"[ERROR] {e}")
    return jsonify({"error": str(e)}), code


# ════════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ════════════════════════════════════════════════════════════════

@app.route("/")
def home():
    try:
        conn = get_conn()
        conn.close()
        return ok({"status": "Disaster Relief API v2.0 OK", "oracle": "connected"})
    except Exception as e:
        return ok({"status": "API running", "oracle": f"error: {str(e)}"})


# ════════════════════════════════════════════════════════════════
#  DISASTERS
# ════════════════════════════════════════════════════════════════

@app.route("/disasters")
def get_disasters():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Disaster_ID, Disaster_Type, Location,
                   TO_CHAR(Disaster_Date, 'YYYY-MM-DD') AS Disaster_Date,
                   Severity_Level
            FROM   Disaster
            ORDER  BY Disaster_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/add_disaster", methods=["POST"])
def add_disaster():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            INSERT INTO Disaster (Disaster_ID, Disaster_Type, Location, Disaster_Date, Severity_Level)
            VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5)
        """, (int(d["id"]), d["type"], d["location"], d["date"], d["severity"]))
        conn.commit()
        return ok({"message": f"Disaster #{d['id']} registered successfully"})
    except Exception as e:
        return err(e)


@app.route("/delete_disaster/<int:did>", methods=["DELETE"])
def delete_disaster(did):
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("DELETE FROM Disaster WHERE Disaster_ID = :1", [did])
        if cur.rowcount == 0:
            return err(Exception(f"Disaster #{did} not found"), 404)
        conn.commit()
        return ok({"message": f"Disaster #{did} and all linked data deleted (cascade)"})
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  VICTIMS
# ════════════════════════════════════════════════════════════════

@app.route("/victims")
def get_victims():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Victim_ID, Victim_First_Name, Victim_Last_Name,
                   Age, Gender, Health_Status, Shelter_ID, Disaster_ID
            FROM   Victim
            ORDER  BY Victim_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/add_victim", methods=["POST"])
def add_victim():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        # Calls fixed add_victim_proc — 8 params, all NOT NULL columns included
        cur.callproc("add_victim_proc", [
            int(d["id"]),
            d["first_name"],
            d["last_name"],
            int(d.get("age", 0)),
            d.get("gender", "Male"),
            d.get("health_status", "Stable"),
            int(d["shelter_id"]),
            int(d["disaster_id"]),
        ])
        conn.commit()
        return ok({"message": f"Victim {d['first_name']} {d['last_name']} registered"})
    except Exception as e:
        if "20002" in str(e) or "capacity" in str(e).lower():
            return err(Exception("Shelter is at full capacity"), 400)
        return err(e)


@app.route("/delete_victim", methods=["DELETE"])
def delete_victim():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        cur.callproc("delete_victim_proc", [int(d["id"])])
        conn.commit()
        return ok({"message": f"Victim #{d['id']} removed"})
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  RESOURCES
# ════════════════════════════════════════════════════════════════

@app.route("/resources")
def get_resources():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Resource_ID, Resource_Type, Quantity_Available, Disaster_ID
            FROM   Resources
            ORDER  BY Resource_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/update_resource", methods=["PUT"])
def update_resource():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        # Calls update_resource_proc — adds qty to existing stock
        cur.callproc("update_resource_proc", [int(d["resource_id"]), int(d["qty"])])
        conn.commit()
        return ok({"message": f"Added {d['qty']} units to Resource #{d['resource_id']}"})
    except Exception as e:
        return err(e)


@app.route("/resource_availability")
def resource_availability():
    """Resource_Availability_View — Oracle VIEW"""
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("SELECT * FROM Resource_Availability_View ORDER BY Quantity_Available")
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  RESOURCE DISTRIBUTION
# ════════════════════════════════════════════════════════════════

@app.route("/resource_distributions")
def get_distributions():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Distribution_ID,
                   TO_CHAR(Distribution_Date, 'YYYY-MM-DD') AS Distribution_Date,
                   Quantity_Distributed,
                   Resource_ID,
                   Victim_ID
            FROM   Resource_Distribution
            ORDER  BY Distribution_ID DESC
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/add_distribution", methods=["POST"])
def add_distribution():
    """
    Inserts into Resource_Distribution.
    Oracle triggers fire automatically:
      trg_check_resource  — verifies enough stock exists (BEFORE INSERT)
      trg_update_resource — deducts qty from Resources   (AFTER INSERT)
    """
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()

        # Auto next Distribution_ID
        cur.execute("SELECT NVL(MAX(Distribution_ID), 0) + 1 FROM Resource_Distribution")
        next_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO Resource_Distribution
                   (Distribution_ID, Distribution_Date, Quantity_Distributed, Resource_ID, Victim_ID)
            VALUES (:1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, :5)
        """, (
            next_id,
            d["distribution_date"],
            int(d["quantity_distributed"]),
            int(d["resource_id"]),
            int(d["victim_id"]),
        ))
        conn.commit()
        return ok({
            "message": (
                f"Distribution #{next_id} recorded — "
                f"{d['quantity_distributed']} units of Resource #{d['resource_id']} "
                f"distributed to Victim #{d['victim_id']}"
            )
        })
    except Exception as e:
        msg = str(e)
        if "20001" in msg or "not enough" in msg.lower():
            return err(Exception("Not enough resources available to distribute"), 400)
        return err(e)


# ════════════════════════════════════════════════════════════════
#  DONATIONS
# ════════════════════════════════════════════════════════════════

@app.route("/donations")
def get_donations():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Donation_ID, Donor_Name, Amount,
                   TO_CHAR(Donation_Date, 'YYYY-MM-DD') AS Donation_Date,
                   Disaster_ID
            FROM   Donation
            ORDER  BY Donation_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/add_donation", methods=["POST"])
def add_donation():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        # Calls add_donation_proc — auto-ID via seq_donation sequence
        cur.callproc("add_donation_proc", [
            d["donor_name"],
            float(d["amount"]),
            d["donation_date"],
            int(d["disaster_id"]),
        ])
        return ok({"message": f"Donation from {d['donor_name']} (Rs.{float(d['amount']):,.0f}) recorded"})
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  VOLUNTEERS
# ════════════════════════════════════════════════════════════════

@app.route("/volunteers")
def get_volunteers():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Volunteer_ID, Volunteer_Name, Contact_No, Team_ID
            FROM   Volunteer
            ORDER  BY Volunteer_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/add_volunteer", methods=["POST"])
def add_volunteer():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        # Calls add_volunteer_proc — auto-ID via seq_volunteer sequence
        cur.callproc("add_volunteer_proc", [
            d["volunteer_name"],
            d["contact_no"],
            int(d["team_id"]),
        ])
        return ok({"message": f"{d['volunteer_name']} registered as volunteer"})
    except Exception as e:
        if "unique" in str(e).lower() or "dup" in str(e).lower():
            return err(Exception("Contact number already registered"), 400)
        return err(e)


# ════════════════════════════════════════════════════════════════
#  SHELTERS
# ════════════════════════════════════════════════════════════════

@app.route("/shelters")
def get_shelters():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Shelter_ID, Shelter_Name, Location, Capacity
            FROM   Shelter
            ORDER  BY Shelter_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/shelter_occupancy")
def shelter_occupancy():
    """Shelter_Occupancy_View — Oracle VIEW"""
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("SELECT * FROM Shelter_Occupancy_View ORDER BY Occupancy_Pct DESC")
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  RESCUE TEAMS
# ════════════════════════════════════════════════════════════════

@app.route("/rescue_teams")
def get_rescue_teams():
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Team_ID, Team_Name, Leader_Name, Disaster_ID
            FROM   Rescue_Team
            ORDER  BY Team_ID
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/add_rescue_team", methods=["POST"])
def add_rescue_team():
    try:
        d    = request.json
        conn = get_conn()
        cur  = conn.cursor()
        # Calls add_rescue_team_proc — auto-ID via seq_rescue_team sequence
        cur.callproc("add_rescue_team_proc", [
            d["team_name"],
            d["leader_name"],
            int(d["disaster_id"]),
        ])
        return ok({"message": f"{d['team_name']} deployed successfully"})
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  ORACLE VIEWS — direct endpoints
# ════════════════════════════════════════════════════════════════

@app.route("/disaster_summary")
def disaster_summary():
    """Disaster_Summary_View — Oracle VIEW"""
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("""
            SELECT Disaster_ID, Disaster_Type, Location,
                   TO_CHAR(Disaster_Date,'YYYY-MM-DD') AS Disaster_Date,
                   Severity_Level, Total_Victims, Total_Teams, Total_Donations
            FROM   Disaster_Summary_View
            ORDER  BY Total_Victims DESC
        """)
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


@app.route("/volunteer_teams")
def volunteer_teams():
    """Volunteer_Team_View — Oracle VIEW"""
    try:
        conn = get_conn()
        cur  = conn.cursor()
        cur.execute("SELECT * FROM Volunteer_Team_View ORDER BY Volunteer_ID")
        return ok(rows_to_dicts(cur))
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  PL/SQL FUNCTION ENDPOINTS
# ════════════════════════════════════════════════════════════════

@app.route("/total_donation/<int:disaster_id>")
def total_donation(disaster_id):
    """Calls get_total_donation PL/SQL function"""
    try:
        conn   = get_conn()
        cur    = conn.cursor()
        result = cur.callfunc("get_total_donation", oracledb.NUMBER, [disaster_id])
        return ok({"disaster_id": disaster_id, "total_donation": result})
    except Exception as e:
        return err(e)


@app.route("/victim_count/<int:disaster_id>")
def victim_count(disaster_id):
    """Calls get_victim_count PL/SQL function"""
    try:
        conn   = get_conn()
        cur    = conn.cursor()
        result = cur.callfunc("get_victim_count", oracledb.NUMBER, [disaster_id])
        return ok({"disaster_id": disaster_id, "victim_count": result})
    except Exception as e:
        return err(e)


@app.route("/avg_donation/<int:disaster_id>")
def avg_donation(disaster_id):
    """Calls get_avg_donation PL/SQL function"""
    try:
        conn   = get_conn()
        cur    = conn.cursor()
        result = cur.callfunc("get_avg_donation", oracledb.NUMBER, [disaster_id])
        return ok({"disaster_id": disaster_id, "avg_donation": result})
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  ANALYTICS — powers full Analytics page
#  Uses all 4 Oracle VIEWs + aggregation queries
# ════════════════════════════════════════════════════════════════

@app.route("/analytics")
def analytics():
    try:
        conn = get_conn()
        cur  = conn.cursor()

        # 1. Disaster_Summary_View
        cur.execute("""
            SELECT Disaster_ID, Disaster_Type, Location,
                   TO_CHAR(Disaster_Date,'YYYY-MM-DD') AS Disaster_Date,
                   Severity_Level, Total_Victims, Total_Teams, Total_Donations
            FROM   Disaster_Summary_View
            ORDER  BY Total_Victims DESC
        """)
        summary = rows_to_dicts(cur)

        # 2. Shelter_Occupancy_View
        cur.execute("SELECT * FROM Shelter_Occupancy_View ORDER BY Occupancy_Pct DESC")
        occupancy = rows_to_dicts(cur)

        # 3. Resource_Availability_View
        cur.execute("SELECT * FROM Resource_Availability_View ORDER BY Quantity_Available")
        resources = rows_to_dicts(cur)

        # 4. Victim health breakdown
        cur.execute("""
            SELECT Health_Status, COUNT(*) AS Victim_Count
            FROM   Victim
            GROUP  BY Health_Status
            ORDER  BY Victim_Count DESC
        """)
        health = rows_to_dicts(cur)

        # 5. Donations by disaster (for bar chart)
        cur.execute("""
            SELECT d.Disaster_Type || ', ' || d.Location  AS label,
                   d.Severity_Level,
                   SUM(don.Amount)        AS total_amount,
                   COUNT(don.Donation_ID) AS donor_count
            FROM   Disaster d
            JOIN   Donation don ON don.Disaster_ID = d.Disaster_ID
            GROUP  BY d.Disaster_Type, d.Location, d.Severity_Level
            ORDER  BY total_amount DESC
        """)
        donations = rows_to_dicts(cur)

        # 6. Team + volunteer counts per disaster
        cur.execute("""
            SELECT d.Disaster_Type || ', ' || d.Location AS label,
                   COUNT(DISTINCT rt.Team_ID)       AS team_count,
                   COUNT(DISTINCT v.Volunteer_ID)   AS total_volunteers
            FROM   Disaster d
            JOIN   Rescue_Team rt ON rt.Disaster_ID = d.Disaster_ID
            LEFT   JOIN Volunteer v ON v.Team_ID = rt.Team_ID
            GROUP  BY d.Disaster_Type, d.Location
            ORDER  BY team_count DESC
        """)
        teams = rows_to_dicts(cur)

        # 7. Resource distribution stats
        cur.execute("""
            SELECT r.Resource_Type,
                   NVL(SUM(rd.Quantity_Distributed), 0) AS total_distributed,
                   r.Quantity_Available                  AS remaining
            FROM   Resources r
            LEFT   JOIN Resource_Distribution rd ON rd.Resource_ID = r.Resource_ID
            GROUP  BY r.Resource_Type, r.Quantity_Available
            ORDER  BY total_distributed DESC
            FETCH  FIRST 10 ROWS ONLY
        """)
        dist_stats = rows_to_dicts(cur)

        return ok({
            "disaster_summary":      summary,
            "shelter_occupancy":     occupancy,
            "resource_availability": resources,
            "health_breakdown":      health,
            "donation_by_disaster":  donations,
            "team_summary":          teams,
            "distribution_stats":    dist_stats,
        })
    except Exception as e:
        return err(e)


# ════════════════════════════════════════════════════════════════
#  RUN
# ════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 55)
    print("  Disaster Relief Management System — Flask API")
    print("  UCS310 · TIET Patiala · 2025-26")
    print("  http://127.0.0.1:5000")
    print("=" * 55)
    app.run(debug=True, port=5000)