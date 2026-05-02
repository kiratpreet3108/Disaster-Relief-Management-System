CREATE TABLE Disaster (
    Disaster_ID NUMBER PRIMARY KEY,
    Disaster_Type VARCHAR2(50) NOT NULL,
    Location VARCHAR2(100),
    Disaster_Date DATE,
    Severity_Level VARCHAR2(10) 
        CHECK (Severity_Level IN ('Low','Medium','High','Critical'))
);
CREATE TABLE Shelter (
    Shelter_ID NUMBER PRIMARY KEY,
    Shelter_Name VARCHAR2(100) NOT NULL,
    Location VARCHAR2(100),
    Capacity NUMBER 
        CHECK (Capacity > 0)
);
CREATE TABLE Rescue_Team (
    Team_ID NUMBER PRIMARY KEY,
    Team_Name VARCHAR2(100) NOT NULL,
    Leader_Name VARCHAR2(100),
    Disaster_ID NUMBER NOT NULL,
    FOREIGN KEY (Disaster_ID) 
        REFERENCES Disaster(Disaster_ID)
        ON DELETE CASCADE
);
CREATE TABLE Resources (
    Resource_ID NUMBER PRIMARY KEY,
    Resource_Type VARCHAR2(50),
    Quantity_Available NUMBER 
        CHECK (Quantity_Available >= 0),
    Disaster_ID NUMBER NOT NULL,
    FOREIGN KEY (Disaster_ID) 
        REFERENCES Disaster(Disaster_ID)
        ON DELETE CASCADE
);
CREATE TABLE Donation (
    Donation_ID NUMBER PRIMARY KEY,
    Donor_Name VARCHAR2(100),
    Donation_Date DATE,
    Amount NUMBER 
        CHECK (Amount >= 0),
    Disaster_ID NUMBER NOT NULL,
    FOREIGN KEY (Disaster_ID) 
        REFERENCES Disaster(Disaster_ID)
        ON DELETE CASCADE
);
CREATE TABLE Volunteer (
    Volunteer_ID NUMBER PRIMARY KEY,
    Volunteer_Name VARCHAR2(100) NOT NULL,
    Contact_No VARCHAR2(15) UNIQUE,
    Team_ID NUMBER,
    FOREIGN KEY (Team_ID) 
        REFERENCES Rescue_Team(Team_ID)
);
CREATE TABLE Victim (
    Victim_ID NUMBER PRIMARY KEY,
    Victim_First_Name VARCHAR2(100),
    Victim_Last_Name VARCHAR2(100),
    Age NUMBER,
    Gender VARCHAR2(20)
        CHECK (Gender IN ('Male','Female','Other')),
    Health_Status VARCHAR2(100),
    Shelter_ID NUMBER NOT NULL,
    Disaster_ID NUMBER NOT NULL,
    FOREIGN KEY (Shelter_ID) 
        REFERENCES Shelter(Shelter_ID),
    FOREIGN KEY (Disaster_ID) 
        REFERENCES Disaster(Disaster_ID)
);
CREATE TABLE Resource_Distribution (
    Distribution_ID NUMBER PRIMARY KEY,
    Distribution_Date DATE,
    Quantity_Distributed NUMBER 
        CHECK (Quantity_Distributed > 0),
    Resource_ID NUMBER NOT NULL,
    Victim_ID NUMBER NOT NULL,
    FOREIGN KEY (Resource_ID) 
        REFERENCES Resources(Resource_ID),
    FOREIGN KEY (Victim_ID) 
        REFERENCES Victim(Victim_ID)
);

INSERT INTO Disaster VALUES (1,'Flood','Assam',DATE '2023-07-10','High');
INSERT INTO Disaster VALUES (2,'Earthquake','Gujarat',DATE '2023-05-15','Critical');
INSERT INTO Disaster VALUES (3,'Cyclone','Odisha',DATE '2023-06-20','High');
INSERT INTO Disaster VALUES (4,'Landslide','Himachal Pradesh',DATE '2023-08-01','Medium');
INSERT INTO Disaster VALUES (5,'Wildfire','Uttarakhand',DATE '2023-06-05','High');
INSERT INTO Disaster VALUES (6,'Flood','Bihar',DATE '2023-07-25','Critical');
INSERT INTO Disaster VALUES (7,'Heatwave','Rajasthan',DATE '2023-05-30','Medium');
INSERT INTO Disaster VALUES (8,'Tsunami','Andaman',DATE '2023-09-10','Critical');
INSERT INTO Disaster VALUES (9,'Drought','Maharashtra',DATE '2023-04-18','Low');
INSERT INTO Disaster VALUES (10,'Cyclone','West Bengal',DATE '2023-06-28','High');

INSERT INTO Shelter VALUES (1,'Relief Camp A','Assam',200);
INSERT INTO Shelter VALUES (2,'Relief Camp B','Gujarat',180);
INSERT INTO Shelter VALUES (3,'Cyclone Shelter','Odisha',250);
INSERT INTO Shelter VALUES (4,'Hill Camp','Himachal Pradesh',120);
INSERT INTO Shelter VALUES (5,'Forest Shelter','Uttarakhand',150);
INSERT INTO Shelter VALUES (6,'Flood Camp','Bihar',300);
INSERT INTO Shelter VALUES (7,'Heat Shelter','Rajasthan',200);
INSERT INTO Shelter VALUES (8,'Island Shelter','Andaman',220);

INSERT INTO Rescue_Team VALUES (1,'NDRF Alpha','Rajesh Kumar',1);
INSERT INTO Rescue_Team VALUES (2,'NDRF Bravo','Amit Singh',2);
INSERT INTO Rescue_Team VALUES (3,'Army Rescue A','Col Verma',3);
INSERT INTO Rescue_Team VALUES (4,'Army Rescue B','Col Rana',4);
INSERT INTO Rescue_Team VALUES (5,'Medical Unit A','Dr Mehta',5);
INSERT INTO Rescue_Team VALUES (6,'Fire Squad A','Anil Sharma',6);
INSERT INTO Rescue_Team VALUES (7,'Water Rescue A','Arjun Singh',1);
INSERT INTO Rescue_Team VALUES (8,'Heat Response','Deepak Joshi',7);
INSERT INTO Rescue_Team VALUES (9,'Forest Rescue','Kunal Rawat',5);
INSERT INTO Rescue_Team VALUES (10,'Coast Guard','Ajay Nair',8);
INSERT INTO Rescue_Team VALUES (11,'Flood Relief Team','Suresh Yadav',6);
INSERT INTO Rescue_Team VALUES (12,'Cyclone Unit','Ravi Das',10);
INSERT INTO Rescue_Team VALUES (13,'Drought Support','Rahul Deshmukh',9);
INSERT INTO Rescue_Team VALUES (14,'Earthquake Response','Vikas Sharma',2);
INSERT INTO Rescue_Team VALUES (15,'Rapid Action Force','Pawan Kumar',3);

INSERT INTO Resources VALUES (1,'Food Packets',1200,1);
INSERT INTO Resources VALUES (2,'Water Bottles',2500,1);
INSERT INTO Resources VALUES (3,'Medicines',600,2);
INSERT INTO Resources VALUES (4,'Blankets',900,3);
INSERT INTO Resources VALUES (5,'Tents',350,4);
INSERT INTO Resources VALUES (6,'Clothes',700,5);
INSERT INTO Resources VALUES (7,'First Aid Kits',450,6);
INSERT INTO Resources VALUES (8,'Rescue Boats',60,1);
INSERT INTO Resources VALUES (9,'Generators',120,2);
INSERT INTO Resources VALUES (10,'Masks',1500,7);
INSERT INTO Resources VALUES (11,'Sanitizers',800,6);
INSERT INTO Resources VALUES (12,'Milk Packets',950,3);
INSERT INTO Resources VALUES (13,'Rice Bags',1400,6);
INSERT INTO Resources VALUES (14,'Cooking Kits',250,5);
INSERT INTO Resources VALUES (15,'Solar Lights',200,8);
INSERT INTO Resources VALUES (16,'Shoes',500,4);
INSERT INTO Resources VALUES (17,'Gloves',700,2);
INSERT INTO Resources VALUES (18,'Medical Beds',150,5);
INSERT INTO Resources VALUES (19,'Stretchers',140,3);
INSERT INTO Resources VALUES (20,'Water Tanks',100,6);

INSERT INTO Donation VALUES (1,'Tata Trust',DATE '2023-07-12',600000,1);
INSERT INTO Donation VALUES (2,'Reliance Foundation',DATE '2023-07-15',750000,2);
INSERT INTO Donation VALUES (3,'Infosys',DATE '2023-06-21',320000,3);
INSERT INTO Donation VALUES (4,'Wipro',DATE '2023-08-02',250000,4);
INSERT INTO Donation VALUES (5,'Adani Group',DATE '2023-06-07',480000,5);
INSERT INTO Donation VALUES (6,'HDFC Bank',DATE '2023-07-20',300000,6);
INSERT INTO Donation VALUES (7,'ICICI Bank',DATE '2023-05-30',260000,7);
INSERT INTO Donation VALUES (8,'Axis Bank',DATE '2023-09-12',350000,8);
INSERT INTO Donation VALUES (9,'State Bank of India',DATE '2023-04-20',420000,9);
INSERT INTO Donation VALUES (10,'ONGC',DATE '2023-06-29',380000,10);
INSERT INTO Donation VALUES (11,'Rahul Sharma',DATE '2023-07-13',5000,1);
INSERT INTO Donation VALUES (12,'Priya Singh',DATE '2023-07-14',7000,2);
INSERT INTO Donation VALUES (13,'Aman Verma',DATE '2023-06-25',4000,3);
INSERT INTO Donation VALUES (14,'Neha Gupta',DATE '2023-08-03',6000,4);
INSERT INTO Donation VALUES (15,'Rohit Kumar',DATE '2023-06-10',5500,5);
INSERT INTO Donation VALUES (16,'Sneha Patel',DATE '2023-07-26',6500,6);
INSERT INTO Donation VALUES (17,'Arjun Mehta',DATE '2023-05-31',7200,7);
INSERT INTO Donation VALUES (18,'Pooja Yadav',DATE '2023-09-11',4800,8);
INSERT INTO Donation VALUES (19,'Karan Shah',DATE '2023-04-19',5300,9);
INSERT INTO Donation VALUES (20,'Simran Kaur',DATE '2023-06-27',6200,10);
INSERT INTO Donation VALUES (21,'Vikas Sharma',DATE '2023-07-15',5100,1);
INSERT INTO Donation VALUES (22,'Anjali Mehta',DATE '2023-05-18',6800,2);
INSERT INTO Donation VALUES (23,'Suresh Kumar',DATE '2023-06-28',4500,3);
INSERT INTO Donation VALUES (24,'Riya Singh',DATE '2023-08-06',5700,4);
INSERT INTO Donation VALUES (25,'Amit Patel',DATE '2023-06-12',6100,5);
INSERT INTO Donation VALUES (26,'Neeraj Gupta',DATE '2023-07-29',7300,6);
INSERT INTO Donation VALUES (27,'Kavita Sharma',DATE '2023-05-29',4900,7);
INSERT INTO Donation VALUES (28,'Manish Verma',DATE '2023-09-09',5200,8);
INSERT INTO Donation VALUES (29,'Deepak Yadav',DATE '2023-04-21',5800,9);
INSERT INTO Donation VALUES (30,'Sunita Devi',DATE '2023-06-30',6400,10);
INSERT INTO Donation VALUES (31,'Maruti Suzuki',DATE '2023-07-18',410000,1);
INSERT INTO Donation VALUES (32,'Asian Paints',DATE '2023-06-14',275000,2);
INSERT INTO Donation VALUES (33,'ITC Limited',DATE '2023-07-05',360000,3);
INSERT INTO Donation VALUES (34,'Hindustan Unilever',DATE '2023-08-08',390000,4);
INSERT INTO Donation VALUES (35,'Bharat Petroleum',DATE '2023-06-19',340000,5);

INSERT INTO Volunteer VALUES (1,'Rahul Sharma','9876500001',1);
INSERT INTO Volunteer VALUES (2,'Priya Singh','9876500002',2);
INSERT INTO Volunteer VALUES (3,'Aman Verma','9876500003',3);
INSERT INTO Volunteer VALUES (4,'Neha Gupta','9876500004',4);
INSERT INTO Volunteer VALUES (5,'Rohit Kumar','9876500005',5);
INSERT INTO Volunteer VALUES (6,'Sneha Patel','9876500006',6);
INSERT INTO Volunteer VALUES (7,'Arjun Mehta','9876500007',7);
INSERT INTO Volunteer VALUES (8,'Pooja Yadav','9876500008',8);
INSERT INTO Volunteer VALUES (9,'Karan Shah','9876500009',9);
INSERT INTO Volunteer VALUES (10,'Simran Kaur','9876500010',10);
INSERT INTO Volunteer VALUES (11,'Vikas Sharma','9876500011',11);
INSERT INTO Volunteer VALUES (12,'Anjali Mehta','9876500012',12);
INSERT INTO Volunteer VALUES (13,'Suresh Kumar','9876500013',13);
INSERT INTO Volunteer VALUES (14,'Riya Singh','9876500014',14);
INSERT INTO Volunteer VALUES (15,'Amit Patel','9876500015',15);
INSERT INTO Volunteer VALUES (16,'Neeraj Gupta','9876500016',1);
INSERT INTO Volunteer VALUES (17,'Kavita Sharma','9876500017',2);
INSERT INTO Volunteer VALUES (18,'Manish Verma','9876500018',3);
INSERT INTO Volunteer VALUES (19,'Deepak Yadav','9876500019',4);
INSERT INTO Volunteer VALUES (20,'Sunita Devi','9876500020',5);
INSERT INTO Volunteer VALUES (21,'Harsh Gupta','9876500021',6);
INSERT INTO Volunteer VALUES (22,'Divya Sharma','9876500022',7);
INSERT INTO Volunteer VALUES (23,'Nitin Verma','9876500023',8);
INSERT INTO Volunteer VALUES (24,'Aarti Singh','9876500024',9);
INSERT INTO Volunteer VALUES (25,'Mohit Kumar','9876500025',10);
INSERT INTO Volunteer VALUES (26,'Rakesh Yadav','9876500026',11);
INSERT INTO Volunteer VALUES (27,'Pankaj Sharma','9876500027',12);
INSERT INTO Volunteer VALUES (28,'Komal Gupta','9876500028',13);
INSERT INTO Volunteer VALUES (29,'Varun Mehta','9876500029',14);
INSERT INTO Volunteer VALUES (30,'Shreya Patel','9876500030',15);
INSERT INTO Volunteer VALUES (31,'Gaurav Singh','9876500031',1);
INSERT INTO Volunteer VALUES (32,'Meena Kumari','9876500032',2);
INSERT INTO Volunteer VALUES (33,'Tarun Verma','9876500033',3);
INSERT INTO Volunteer VALUES (34,'Nisha Yadav','9876500034',4);
INSERT INTO Volunteer VALUES (35,'Sanjay Kumar','9876500035',5);
INSERT INTO Volunteer VALUES (36,'Rekha Sharma','9876500036',6);
INSERT INTO Volunteer VALUES (37,'Ajay Gupta','9876500037',7);
INSERT INTO Volunteer VALUES (38,'Kriti Singh','9876500038',8);
INSERT INTO Volunteer VALUES (39,'Lokesh Verma','9876500039',9);
INSERT INTO Volunteer VALUES (40,'Preeti Yadav','9876500040',10);
INSERT INTO Volunteer VALUES (41,'Abhishek Sharma','9876500041',11);
INSERT INTO Volunteer VALUES (42,'Tanvi Gupta','9876500042',12);
INSERT INTO Volunteer VALUES (43,'Rohan Mehta','9876500043',13);
INSERT INTO Volunteer VALUES (44,'Ishita Verma','9876500044',14);
INSERT INTO Volunteer VALUES (45,'Yash Patel','9876500045',15);
INSERT INTO Volunteer VALUES (46,'Ankit Yadav','9876500046',1);
INSERT INTO Volunteer VALUES (47,'Sakshi Singh','9876500047',2);
INSERT INTO Volunteer VALUES (48,'Naveen Kumar','9876500048',3);
INSERT INTO Volunteer VALUES (49,'Bhavna Sharma','9876500049',4);
INSERT INTO Volunteer VALUES (50,'Kunal Gupta','9876500050',5);

INSERT INTO Victim VALUES (1,'Ravi','Kumar',35,'Male','Injured',1,1);
INSERT INTO Victim VALUES (2,'Sita','Devi',28,'Female','Stable',2,1);
INSERT INTO Victim VALUES (3,'Aman','Singh',40,'Male','Critical',3,2);
INSERT INTO Victim VALUES (4,'Neha','Sharma',22,'Female','Stable',4,2);
INSERT INTO Victim VALUES (5,'Rahul','Das',30,'Male','Injured',5,3);
INSERT INTO Victim VALUES (6,'Pooja','Verma',27,'Female','Stable',6,3);
INSERT INTO Victim VALUES (7,'Karan','Mehta',45,'Male','Critical',7,4);
INSERT INTO Victim VALUES (8,'Anita','Patel',33,'Female','Stable',8,4);
INSERT INTO Victim VALUES (9,'Vikas','Gupta',50,'Male','Injured',1,5);
INSERT INTO Victim VALUES (10,'Riya','Shah',19,'Female','Stable',2,5);
INSERT INTO Victim VALUES (11,'Deepak','Yadav',38,'Male','Injured',3,6);
INSERT INTO Victim VALUES (12,'Sunita','Kumari',42,'Female','Stable',4,6);
INSERT INTO Victim VALUES (13,'Arjun','Rana',29,'Male','Critical',5,7);
INSERT INTO Victim VALUES (14,'Kavita','Joshi',34,'Female','Stable',6,7);
INSERT INTO Victim VALUES (15,'Manoj','Rawat',47,'Male','Injured',7,8);
INSERT INTO Victim VALUES (16,'Meena','Negi',36,'Female','Stable',8,8);
INSERT INTO Victim VALUES (17,'Rohit','Chauhan',31,'Male','Critical',1,9);
INSERT INTO Victim VALUES (18,'Poonam','Thakur',25,'Female','Stable',2,9);
INSERT INTO Victim VALUES (19,'Amit','Tiwari',44,'Male','Injured',3,10);
INSERT INTO Victim VALUES (20,'Shreya','Mishra',21,'Female','Stable',4,10);
INSERT INTO Victim VALUES (21,'Nitin','Sharma',39,'Male','Stable',5,1);
INSERT INTO Victim VALUES (22,'Divya','Gupta',26,'Female','Injured',6,1);
INSERT INTO Victim VALUES (23,'Sanjay','Verma',48,'Male','Critical',7,2);
INSERT INTO Victim VALUES (24,'Komal','Singh',23,'Female','Stable',8,2);
INSERT INTO Victim VALUES (25,'Ajay','Yadav',37,'Male','Injured',1,3);
INSERT INTO Victim VALUES (26,'Ritika','Kaur',32,'Female','Stable',2,3);
INSERT INTO Victim VALUES (27,'Vivek','Shah',41,'Male','Critical',3,4);
INSERT INTO Victim VALUES (28,'Preeti','Agarwal',29,'Female','Stable',4,4);
INSERT INTO Victim VALUES (29,'Harsh','Patel',34,'Male','Injured',5,5);
INSERT INTO Victim VALUES (30,'Nisha','Jain',27,'Female','Stable',6,5);
INSERT INTO Victim VALUES (31,'Gaurav','Bansal',36,'Male','Stable',7,6);
INSERT INTO Victim VALUES (32,'Megha','Saxena',24,'Female','Injured',8,6);
INSERT INTO Victim VALUES (33,'Tarun','Kapoor',43,'Male','Critical',1,7);
INSERT INTO Victim VALUES (34,'Isha','Malhotra',28,'Female','Stable',2,7);
INSERT INTO Victim VALUES (35,'Ankit','Bhardwaj',33,'Male','Injured',3,8);
INSERT INTO Victim VALUES (36,'Renu','Chopra',39,'Female','Stable',4,8);
INSERT INTO Victim VALUES (37,'Kunal','Arora',46,'Male','Critical',5,9);
INSERT INTO Victim VALUES (38,'Pallavi','Goyal',22,'Female','Stable',6,9);
INSERT INTO Victim VALUES (39,'Yash','Mittal',35,'Male','Injured',7,10);
INSERT INTO Victim VALUES (40,'Sonal','Bajaj',31,'Female','Stable',8,10);
INSERT INTO Victim VALUES (41,'Abhishek','Sharma',34,'Male','Injured',1,1);
INSERT INTO Victim VALUES (42,'Tanvi','Gupta',26,'Female','Stable',2,1);
INSERT INTO Victim VALUES (43,'Rohan','Mehta',41,'Male','Critical',3,2);
INSERT INTO Victim VALUES (44,'Ishita','Verma',23,'Female','Stable',4,2);
INSERT INTO Victim VALUES (45,'Yash','Patel',37,'Male','Injured',5,3);
INSERT INTO Victim VALUES (46,'Ankita','Yadav',29,'Female','Stable',6,3);
INSERT INTO Victim VALUES (47,'Naveen','Kumar',45,'Male','Critical',7,4);
INSERT INTO Victim VALUES (48,'Bhavna','Sharma',31,'Female','Stable',8,4);
INSERT INTO Victim VALUES (49,'Kunal','Gupta',38,'Male','Injured',1,5);
INSERT INTO Victim VALUES (50,'Preeti','Singh',24,'Female','Stable',2,5);
INSERT INTO Victim VALUES (51,'Lokesh','Verma',42,'Male','Critical',3,6);
INSERT INTO Victim VALUES (52,'Rekha','Yadav',35,'Female','Stable',4,6);
INSERT INTO Victim VALUES (53,'Ajay','Shah',47,'Male','Injured',5,7);
INSERT INTO Victim VALUES (54,'Kriti','Agarwal',21,'Female','Stable',6,7);
INSERT INTO Victim VALUES (55,'Varun','Jain',36,'Male','Critical',7,8);
INSERT INTO Victim VALUES (56,'Meena','Bansal',39,'Female','Stable',8,8);
INSERT INTO Victim VALUES (57,'Gaurav','Kapoor',33,'Male','Injured',1,9);
INSERT INTO Victim VALUES (58,'Sonia','Malhotra',28,'Female','Stable',2,9);
INSERT INTO Victim VALUES (59,'Tarun','Arora',44,'Male','Critical',3,10);
INSERT INTO Victim VALUES (60,'Nisha','Chopra',25,'Female','Stable',4,10);
INSERT INTO Victim VALUES (61,'Pankaj','Mishra',40,'Male','Injured',5,1);
INSERT INTO Victim VALUES (62,'Ritika','Tiwari',27,'Female','Stable',6,1);
INSERT INTO Victim VALUES (63,'Manish','Dubey',48,'Male','Critical',7,2);
INSERT INTO Victim VALUES (64,'Shweta','Pandey',22,'Female','Stable',8,2);
INSERT INTO Victim VALUES (65,'Anil','Srivastava',36,'Male','Injured',1,3);
INSERT INTO Victim VALUES (66,'Neelam','Tripathi',30,'Female','Stable',2,3);
INSERT INTO Victim VALUES (67,'Suresh','Pathak',45,'Male','Critical',3,4);
INSERT INTO Victim VALUES (68,'Kiran','Shukla',33,'Female','Stable',4,4);
INSERT INTO Victim VALUES (69,'Ramesh','Yadav',50,'Male','Injured',5,5);
INSERT INTO Victim VALUES (70,'Anju','Verma',26,'Female','Stable',6,5);
INSERT INTO Victim VALUES (71,'Sunil','Chaudhary',39,'Male','Critical',7,6);
INSERT INTO Victim VALUES (72,'Pooja','Kumari',24,'Female','Stable',8,6);
INSERT INTO Victim VALUES (73,'Deepak','Singh',43,'Male','Injured',1,7);
INSERT INTO Victim VALUES (74,'Seema','Devi',37,'Female','Stable',2,7);
INSERT INTO Victim VALUES (75,'Ashok','Kumar',52,'Male','Critical',3,8);
INSERT INTO Victim VALUES (76,'Geeta','Sharma',31,'Female','Stable',4,8);
INSERT INTO Victim VALUES (77,'Mukesh','Jha',46,'Male','Injured',5,9);
INSERT INTO Victim VALUES (78,'Babita','Thakur',29,'Female','Stable',6,9);
INSERT INTO Victim VALUES (79,'Naresh','Paswan',41,'Male','Critical',7,10);
INSERT INTO Victim VALUES (80,'Suman','Devi',34,'Female','Stable',8,10);
INSERT INTO Victim VALUES (81,'Vijay','Rao',38,'Male','Injured',1,1);
INSERT INTO Victim VALUES (82,'Lakshmi','Iyer',27,'Female','Stable',2,1);
INSERT INTO Victim VALUES (83,'Prakash','Naidu',44,'Male','Critical',3,2);
INSERT INTO Victim VALUES (84,'Anitha','Reddy',30,'Female','Stable',4,2);
INSERT INTO Victim VALUES (85,'Raghav','Shetty',35,'Male','Injured',5,3);
INSERT INTO Victim VALUES (86,'Kavya','Menon',28,'Female','Stable',6,3);
INSERT INTO Victim VALUES (87,'Sandeep','Nair',42,'Male','Critical',7,4);
INSERT INTO Victim VALUES (88,'Divya','Pillai',23,'Female','Stable',8,4);
INSERT INTO Victim VALUES (89,'Harish','Kumar',47,'Male','Injured',1,5);
INSERT INTO Victim VALUES (90,'Meera','Nair',32,'Female','Stable',2,5);
INSERT INTO Victim VALUES (91,'Ravi','Reddy',39,'Male','Critical',3,6);
INSERT INTO Victim VALUES (92,'Sneha','Shetty',26,'Female','Stable',4,6);
INSERT INTO Victim VALUES (93,'Kiran','Naidu',45,'Male','Injured',5,7);
INSERT INTO Victim VALUES (94,'Pavitra','Rao',29,'Female','Stable',6,7);
INSERT INTO Victim VALUES (95,'Ganesh','Iyer',50,'Male','Critical',7,8);
INSERT INTO Victim VALUES (96,'Asha','Menon',34,'Female','Stable',8,8);
INSERT INTO Victim VALUES (97,'Ramesh','Shetty',37,'Male','Injured',1,9);
INSERT INTO Victim VALUES (98,'Latha','Nair',31,'Female','Stable',2,9);
INSERT INTO Victim VALUES (99,'Mohan','Reddy',48,'Male','Critical',3,10);
INSERT INTO Victim VALUES (100,'Radha','Iyer',25,'Female','Stable',4,10);
INSERT INTO Victim VALUES (101,'Suraj','Yadav',33,'Male','Injured',5,1);
INSERT INTO Victim VALUES (102,'Pinky','Kumari',21,'Female','Stable',6,1);
INSERT INTO Victim VALUES (103,'Dinesh','Paswan',41,'Male','Critical',7,2);
INSERT INTO Victim VALUES (104,'Kajal','Devi',27,'Female','Stable',8,2);
INSERT INTO Victim VALUES (105,'Mahesh','Yadav',36,'Male','Injured',1,3);
INSERT INTO Victim VALUES (106,'Rekha','Kumari',32,'Female','Stable',2,3);
INSERT INTO Victim VALUES (107,'Shiv','Kumar',49,'Male','Critical',3,4);
INSERT INTO Victim VALUES (108,'Anita','Devi',35,'Female','Stable',4,4);
INSERT INTO Victim VALUES (109,'Rajesh','Yadav',43,'Male','Injured',5,5);
INSERT INTO Victim VALUES (110,'Poonam','Kumari',29,'Female','Stable',6,5);
INSERT INTO Victim VALUES (111,'Mukesh','Paswan',46,'Male','Critical',7,6);
INSERT INTO Victim VALUES (112,'Sunita','Devi',38,'Female','Stable',8,6);
INSERT INTO Victim VALUES (113,'Rakesh','Yadav',40,'Male','Injured',1,7);
INSERT INTO Victim VALUES (114,'Sarla','Kumari',24,'Female','Stable',2,7);
INSERT INTO Victim VALUES (115,'Ashish','Kumar',35,'Male','Critical',3,8);
INSERT INTO Victim VALUES (116,'Geeta','Devi',30,'Female','Stable',4,8);
INSERT INTO Victim VALUES (117,'Vinod','Paswan',42,'Male','Injured',5,9);
INSERT INTO Victim VALUES (118,'Lalita','Kumari',26,'Female','Stable',6,9);
INSERT INTO Victim VALUES (119,'Santosh','Yadav',47,'Male','Critical',7,10);
INSERT INTO Victim VALUES (120,'Maya','Devi',33,'Female','Stable',8,10);
INSERT INTO Victim VALUES (121,'Hemant','Sharma',36,'Male','Injured',1,1);
INSERT INTO Victim VALUES (122,'Renu','Gupta',28,'Female','Stable',2,1);
INSERT INTO Victim VALUES (123,'Sanjay','Mehta',44,'Male','Critical',3,2);
INSERT INTO Victim VALUES (124,'Komal','Verma',23,'Female','Stable',4,2);
INSERT INTO Victim VALUES (125,'Nikhil','Patel',39,'Male','Injured',5,3);
INSERT INTO Victim VALUES (126,'Sakshi','Shah',31,'Female','Stable',6,3);
INSERT INTO Victim VALUES (127,'Harsh','Jain',45,'Male','Critical',7,4);
INSERT INTO Victim VALUES (128,'Ritu','Agarwal',27,'Female','Stable',8,4);
INSERT INTO Victim VALUES (129,'Vivek','Bansal',38,'Male','Injured',1,5);
INSERT INTO Victim VALUES (130,'Neha','Kapoor',25,'Female','Stable',2,5);
INSERT INTO Victim VALUES (131,'Amit','Arora',41,'Male','Critical',3,6);
INSERT INTO Victim VALUES (132,'Pooja','Chopra',29,'Female','Stable',4,6);
INSERT INTO Victim VALUES (133,'Rohit','Malhotra',43,'Male','Injured',5,7);
INSERT INTO Victim VALUES (134,'Simran','Kaur',26,'Female','Stable',6,7);
INSERT INTO Victim VALUES (135,'Gurpreet','Singh',48,'Male','Critical',7,8);
INSERT INTO Victim VALUES (136,'Jasleen','Kaur',32,'Female','Stable',8,8);
INSERT INTO Victim VALUES (137,'Manpreet','Singh',37,'Male','Injured',1,9);
INSERT INTO Victim VALUES (138,'Navneet','Kaur',28,'Female','Stable',2,9);
INSERT INTO Victim VALUES (139,'Harjit','Singh',50,'Male','Critical',3,10);
INSERT INTO Victim VALUES (140,'Baljit','Kaur',35,'Female','Stable',4,10);
INSERT INTO Victim VALUES (141,'Kuldeep','Singh',42,'Male','Injured',5,1);
INSERT INTO Victim VALUES (142,'Paramjit','Kaur',30,'Female','Stable',6,1);
INSERT INTO Victim VALUES (143,'Sukhdev','Singh',46,'Male','Critical',7,2);
INSERT INTO Victim VALUES (144,'Harpreet','Kaur',27,'Female','Stable',8,2);
INSERT INTO Victim VALUES (145,'Jagtar','Singh',39,'Male','Injured',1,3);
INSERT INTO Victim VALUES (146,'Rajwinder','Kaur',31,'Female','Stable',2,3);
INSERT INTO Victim VALUES (147,'Gurmeet','Singh',44,'Male','Critical',3,4);
INSERT INTO Victim VALUES (148,'Amrit','Kaur',29,'Female','Stable',4,4);
INSERT INTO Victim VALUES (149,'Balwinder','Singh',47,'Male','Injured',5,5);
INSERT INTO Victim VALUES (150,'Jaspreet','Kaur',33,'Female','Stable',6,5);

INSERT INTO Resource_Distribution VALUES (1,DATE '2023-07-12',20,1,1);
INSERT INTO Resource_Distribution VALUES (2,DATE '2023-07-12',15,2,2);
INSERT INTO Resource_Distribution VALUES (3,DATE '2023-07-13',10,3,3);
INSERT INTO Resource_Distribution VALUES (4,DATE '2023-07-13',25,4,4);
INSERT INTO Resource_Distribution VALUES (5,DATE '2023-07-14',18,5,5);
INSERT INTO Resource_Distribution VALUES (6,DATE '2023-07-14',12,6,6);
INSERT INTO Resource_Distribution VALUES (7,DATE '2023-07-15',22,7,7);
INSERT INTO Resource_Distribution VALUES (8,DATE '2023-07-15',16,8,8);
INSERT INTO Resource_Distribution VALUES (9,DATE '2023-07-16',30,9,9);
INSERT INTO Resource_Distribution VALUES (10,DATE '2023-07-16',20,10,10);
INSERT INTO Resource_Distribution VALUES (11,DATE '2023-07-17',18,11,11);
INSERT INTO Resource_Distribution VALUES (12,DATE '2023-07-17',14,12,12);
INSERT INTO Resource_Distribution VALUES (13,DATE '2023-07-18',22,13,13);
INSERT INTO Resource_Distribution VALUES (14,DATE '2023-07-18',17,14,14);
INSERT INTO Resource_Distribution VALUES (15,DATE '2023-07-19',19,15,15);
INSERT INTO Resource_Distribution VALUES (16,DATE '2023-07-19',13,16,16);
INSERT INTO Resource_Distribution VALUES (17,DATE '2023-07-20',25,17,17);
INSERT INTO Resource_Distribution VALUES (18,DATE '2023-07-20',21,18,18);
INSERT INTO Resource_Distribution VALUES (19,DATE '2023-07-21',23,19,19);
INSERT INTO Resource_Distribution VALUES (20,DATE '2023-07-21',15,20,20);
INSERT INTO Resource_Distribution VALUES (21,DATE '2023-07-22',17,1,21);
INSERT INTO Resource_Distribution VALUES (22,DATE '2023-07-22',16,2,22);
INSERT INTO Resource_Distribution VALUES (23,DATE '2023-07-23',18,3,23);
INSERT INTO Resource_Distribution VALUES (24,DATE '2023-07-23',20,4,24);
INSERT INTO Resource_Distribution VALUES (25,DATE '2023-07-24',22,5,25);
INSERT INTO Resource_Distribution VALUES (26,DATE '2023-07-24',14,6,26);
INSERT INTO Resource_Distribution VALUES (27,DATE '2023-07-25',19,7,27);
INSERT INTO Resource_Distribution VALUES (28,DATE '2023-07-25',15,8,28);
INSERT INTO Resource_Distribution VALUES (29,DATE '2023-07-26',21,9,29);
INSERT INTO Resource_Distribution VALUES (30,DATE '2023-07-26',18,10,30);
INSERT INTO Resource_Distribution VALUES (31,DATE '2023-07-27',20,11,31);
INSERT INTO Resource_Distribution VALUES (32,DATE '2023-07-27',17,12,32);
INSERT INTO Resource_Distribution VALUES (33,DATE '2023-07-28',19,13,33);
INSERT INTO Resource_Distribution VALUES (34,DATE '2023-07-28',22,14,34);
INSERT INTO Resource_Distribution VALUES (35,DATE '2023-07-29',23,15,35);
INSERT INTO Resource_Distribution VALUES (36,DATE '2023-07-29',16,16,36);
INSERT INTO Resource_Distribution VALUES (37,DATE '2023-07-30',18,17,37);
INSERT INTO Resource_Distribution VALUES (38,DATE '2023-07-30',21,18,38);
INSERT INTO Resource_Distribution VALUES (39,DATE '2023-07-31',24,19,39);
INSERT INTO Resource_Distribution VALUES (40,DATE '2023-07-31',20,20,40);
INSERT INTO Resource_Distribution VALUES (41,DATE '2023-08-01',18,1,41);
INSERT INTO Resource_Distribution VALUES (42,DATE '2023-08-01',17,2,42);
INSERT INTO Resource_Distribution VALUES (43,DATE '2023-08-02',19,3,43);
INSERT INTO Resource_Distribution VALUES (44,DATE '2023-08-02',21,4,44);
INSERT INTO Resource_Distribution VALUES (45,DATE '2023-08-03',23,5,45);
INSERT INTO Resource_Distribution VALUES (46,DATE '2023-08-03',15,6,46);
INSERT INTO Resource_Distribution VALUES (47,DATE '2023-08-04',18,7,47);
INSERT INTO Resource_Distribution VALUES (48,DATE '2023-08-04',20,8,48);
INSERT INTO Resource_Distribution VALUES (49,DATE '2023-08-05',22,9,49);
INSERT INTO Resource_Distribution VALUES (50,DATE '2023-08-05',19,10,50);
INSERT INTO Resource_Distribution VALUES (51,DATE '2023-08-06',18,11,51);
INSERT INTO Resource_Distribution VALUES (52,DATE '2023-08-06',16,12,52);
INSERT INTO Resource_Distribution VALUES (53,DATE '2023-08-07',20,13,53);
INSERT INTO Resource_Distribution VALUES (54,DATE '2023-08-07',22,14,54);
INSERT INTO Resource_Distribution VALUES (55,DATE '2023-08-08',24,15,55);
INSERT INTO Resource_Distribution VALUES (56,DATE '2023-08-08',15,16,56);
INSERT INTO Resource_Distribution VALUES (57,DATE '2023-08-09',19,17,57);
INSERT INTO Resource_Distribution VALUES (58,DATE '2023-08-09',21,18,58);
INSERT INTO Resource_Distribution VALUES (59,DATE '2023-08-10',23,19,59);
INSERT INTO Resource_Distribution VALUES (60,DATE '2023-08-10',18,20,60);
INSERT INTO Resource_Distribution VALUES (61,DATE '2023-08-11',17,1,61);
INSERT INTO Resource_Distribution VALUES (62,DATE '2023-08-11',16,2,62);
INSERT INTO Resource_Distribution VALUES (63,DATE '2023-08-12',19,3,63);
INSERT INTO Resource_Distribution VALUES (64,DATE '2023-08-12',20,4,64);
INSERT INTO Resource_Distribution VALUES (65,DATE '2023-08-13',22,5,65);
INSERT INTO Resource_Distribution VALUES (66,DATE '2023-08-13',15,6,66);
INSERT INTO Resource_Distribution VALUES (67,DATE '2023-08-14',18,7,67);
INSERT INTO Resource_Distribution VALUES (68,DATE '2023-08-14',21,8,68);
INSERT INTO Resource_Distribution VALUES (69,DATE '2023-08-15',24,9,69);
INSERT INTO Resource_Distribution VALUES (70,DATE '2023-08-15',19,10,70);
INSERT INTO Resource_Distribution VALUES (71,DATE '2023-08-16',18,11,71);
INSERT INTO Resource_Distribution VALUES (72,DATE '2023-08-16',17,12,72);
INSERT INTO Resource_Distribution VALUES (73,DATE '2023-08-17',20,13,73);
INSERT INTO Resource_Distribution VALUES (74,DATE '2023-08-17',22,14,74);
INSERT INTO Resource_Distribution VALUES (75,DATE '2023-08-18',23,15,75);
INSERT INTO Resource_Distribution VALUES (76,DATE '2023-08-18',16,16,76);
INSERT INTO Resource_Distribution VALUES (77,DATE '2023-08-19',19,17,77);
INSERT INTO Resource_Distribution VALUES (78,DATE '2023-08-19',21,18,78);
INSERT INTO Resource_Distribution VALUES (79,DATE '2023-08-20',24,19,79);
INSERT INTO Resource_Distribution VALUES (80,DATE '2023-08-20',18,20,80);
INSERT INTO Resource_Distribution VALUES (81,DATE '2023-08-21',17,1,81);
INSERT INTO Resource_Distribution VALUES (82,DATE '2023-08-21',16,2,82);
INSERT INTO Resource_Distribution VALUES (83,DATE '2023-08-22',19,3,83);
INSERT INTO Resource_Distribution VALUES (84,DATE '2023-08-22',21,4,84);
INSERT INTO Resource_Distribution VALUES (85,DATE '2023-08-23',22,5,85);
INSERT INTO Resource_Distribution VALUES (86,DATE '2023-08-23',15,6,86);
INSERT INTO Resource_Distribution VALUES (87,DATE '2023-08-24',18,7,87);
INSERT INTO Resource_Distribution VALUES (88,DATE '2023-08-24',20,8,88);
INSERT INTO Resource_Distribution VALUES (89,DATE '2023-08-25',23,9,89);
INSERT INTO Resource_Distribution VALUES (90,DATE '2023-08-25',19,10,90);
INSERT INTO Resource_Distribution VALUES (91,DATE '2023-08-26',18,11,91);
INSERT INTO Resource_Distribution VALUES (92,DATE '2023-08-26',17,12,92);
INSERT INTO Resource_Distribution VALUES (93,DATE '2023-08-27',20,13,93);
INSERT INTO Resource_Distribution VALUES (94,DATE '2023-08-27',22,14,94);
INSERT INTO Resource_Distribution VALUES (95,DATE '2023-08-28',24,15,95);
INSERT INTO Resource_Distribution VALUES (96,DATE '2023-08-28',16,16,96);
INSERT INTO Resource_Distribution VALUES (97,DATE '2023-08-29',19,17,97);
INSERT INTO Resource_Distribution VALUES (98,DATE '2023-08-29',21,18,98);
INSERT INTO Resource_Distribution VALUES (99,DATE '2023-08-30',23,19,99);
INSERT INTO Resource_Distribution VALUES (100,DATE '2023-08-30',18,20,100);
INSERT INTO Resource_Distribution VALUES (101,DATE '2023-08-31',17,1,101);
INSERT INTO Resource_Distribution VALUES (102,DATE '2023-08-31',16,2,102);
INSERT INTO Resource_Distribution VALUES (103,DATE '2023-09-01',19,3,103);
INSERT INTO Resource_Distribution VALUES (104,DATE '2023-09-01',21,4,104);
INSERT INTO Resource_Distribution VALUES (105,DATE '2023-09-02',22,5,105);
INSERT INTO Resource_Distribution VALUES (106,DATE '2023-09-02',15,6,106);
INSERT INTO Resource_Distribution VALUES (107,DATE '2023-09-03',18,7,107);
INSERT INTO Resource_Distribution VALUES (108,DATE '2023-09-03',20,8,108);
INSERT INTO Resource_Distribution VALUES (109,DATE '2023-09-04',23,9,109);
INSERT INTO Resource_Distribution VALUES (110,DATE '2023-09-04',19,10,110);
INSERT INTO Resource_Distribution VALUES (111,DATE '2023-09-05',18,11,111);
INSERT INTO Resource_Distribution VALUES (112,DATE '2023-09-05',17,12,112);
INSERT INTO Resource_Distribution VALUES (113,DATE '2023-09-06',20,13,113);
INSERT INTO Resource_Distribution VALUES (114,DATE '2023-09-06',22,14,114);
INSERT INTO Resource_Distribution VALUES (115,DATE '2023-09-07',24,15,115);
INSERT INTO Resource_Distribution VALUES (116,DATE '2023-09-07',16,16,116);
INSERT INTO Resource_Distribution VALUES (117,DATE '2023-09-08',19,17,117);
INSERT INTO Resource_Distribution VALUES (118,DATE '2023-09-08',21,18,118);
INSERT INTO Resource_Distribution VALUES (119,DATE '2023-09-09',23,19,119);
INSERT INTO Resource_Distribution VALUES (120,DATE '2023-09-09',18,20,120);
INSERT INTO Resource_Distribution VALUES (121,DATE '2023-09-10',17,1,121);
INSERT INTO Resource_Distribution VALUES (122,DATE '2023-09-10',16,2,122);
INSERT INTO Resource_Distribution VALUES (123,DATE '2023-09-11',19,3,123);
INSERT INTO Resource_Distribution VALUES (124,DATE '2023-09-11',21,4,124);
INSERT INTO Resource_Distribution VALUES (125,DATE '2023-09-12',22,5,125);
INSERT INTO Resource_Distribution VALUES (126,DATE '2023-09-12',15,6,126);
INSERT INTO Resource_Distribution VALUES (127,DATE '2023-09-13',18,7,127);
INSERT INTO Resource_Distribution VALUES (128,DATE '2023-09-13',20,8,128);
INSERT INTO Resource_Distribution VALUES (129,DATE '2023-09-14',23,9,129);
INSERT INTO Resource_Distribution VALUES (130,DATE '2023-09-14',19,10,130);
INSERT INTO Resource_Distribution VALUES (131,DATE '2023-09-15',18,11,131);
INSERT INTO Resource_Distribution VALUES (132,DATE '2023-09-15',17,12,132);
INSERT INTO Resource_Distribution VALUES (133,DATE '2023-09-16',20,13,133);
INSERT INTO Resource_Distribution VALUES (134,DATE '2023-09-16',22,14,134);
INSERT INTO Resource_Distribution VALUES (135,DATE '2023-09-17',24,15,135);
INSERT INTO Resource_Distribution VALUES (136,DATE '2023-09-17',16,16,136);
INSERT INTO Resource_Distribution VALUES (137,DATE '2023-09-18',19,17,137);
INSERT INTO Resource_Distribution VALUES (138,DATE '2023-09-18',21,18,138);
INSERT INTO Resource_Distribution VALUES (139,DATE '2023-09-19',23,19,139);
INSERT INTO Resource_Distribution VALUES (140,DATE '2023-09-19',18,20,140);
INSERT INTO Resource_Distribution VALUES (141,DATE '2023-09-20',17,1,141);
INSERT INTO Resource_Distribution VALUES (142,DATE '2023-09-20',16,2,142);
INSERT INTO Resource_Distribution VALUES (143,DATE '2023-09-21',19,3,143);
INSERT INTO Resource_Distribution VALUES (144,DATE '2023-09-21',21,4,144);
INSERT INTO Resource_Distribution VALUES (145,DATE '2023-09-22',22,5,145);
INSERT INTO Resource_Distribution VALUES (146,DATE '2023-09-22',15,6,146);
INSERT INTO Resource_Distribution VALUES (147,DATE '2023-09-23',18,7,147);
INSERT INTO Resource_Distribution VALUES (148,DATE '2023-09-23',20,8,148);
INSERT INTO Resource_Distribution VALUES (149,DATE '2023-09-24',23,9,149);
INSERT INTO Resource_Distribution VALUES (150,DATE '2023-09-24',19,10,150);

CREATE OR REPLACE TRIGGER trg_update_resource
AFTER INSERT ON Resource_Distribution
FOR EACH ROW
BEGIN
    UPDATE Resources
    SET Quantity_Available = Quantity_Available - :NEW.Quantity_Distributed
    WHERE Resource_ID = :NEW.Resource_ID;
END;
/

CREATE OR REPLACE TRIGGER trg_check_resource
BEFORE INSERT ON Resource_Distribution
FOR EACH ROW
DECLARE
    available_qty NUMBER;
BEGIN
    SELECT Quantity_Available INTO available_qty
    FROM Resources
    WHERE Resource_ID = :NEW.Resource_ID;

    IF available_qty < :NEW.Quantity_Distributed THEN
        RAISE_APPLICATION_ERROR(-20001, 'Not enough resources available');
    END IF;
END;
/

CREATE OR REPLACE FUNCTION get_total_donation(d_id NUMBER)
RETURN NUMBER
IS
    total NUMBER;
BEGIN
    SELECT SUM(Amount)
    INTO total
    FROM Donation
    WHERE Disaster_ID = d_id;

    RETURN total;
END;
/

CREATE OR REPLACE FUNCTION get_victim_count(d_id NUMBER)
RETURN NUMBER
IS
    total NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO total
    FROM Victim
    WHERE Disaster_ID = d_id;

    RETURN total;
END;
/

CREATE OR REPLACE PROCEDURE add_victim_proc(
    v_id NUMBER,
    v_fname VARCHAR2,
    v_lname VARCHAR2
)
IS
BEGIN
    INSERT INTO Victim (Victim_ID, Victim_First_Name, Victim_Last_Name)
    VALUES (v_id, v_fname, v_lname);

    COMMIT;

EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: Duplicate Victim ID');

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/




CREATE OR REPLACE PROCEDURE update_resource_proc(
    r_id NUMBER,
    qty NUMBER
)
IS
BEGIN
    UPDATE Resources
    SET Quantity_Available = Quantity_Available + qty
    WHERE Resource_ID = r_id;

    COMMIT;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Resource not found');

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/



CREATE OR REPLACE PROCEDURE delete_victim_proc(
    v_id NUMBER
)
IS
BEGIN
    DELETE FROM Victim
    WHERE Victim_ID = v_id;

    COMMIT;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Victim not found');

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/



CREATE OR REPLACE PROCEDURE distribute_resources_cursor
IS
    CURSOR victim_cursor IS
        SELECT Victim_ID FROM Victim;

    v_id Victim.Victim_ID%TYPE;
BEGIN
    OPEN victim_cursor;

    LOOP
        FETCH victim_cursor INTO v_id;
        EXIT WHEN victim_cursor%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('Processing victim ID: ' || v_id);
    END LOOP;

    CLOSE victim_cursor;
END;
/

BEGIN 

    SAVEPOINT before_update;

    UPDATE Resources
    SET Quantity_Available = Quantity_Available - 50
    WHERE Resource_ID = 1;

-- If something wrong
    ROLLBACK TO before_update;
END;
/
   
   -- ============================================================
--  VIEWS
-- ============================================================

-- 1. Disaster Summary View
CREATE OR REPLACE VIEW Disaster_Summary_View AS
SELECT
    d.Disaster_ID,
    d.Disaster_Type,
    d.Location,
    d.Disaster_Date,
    d.Severity_Level,
    COUNT(DISTINCT v.Victim_ID)   AS Total_Victims,
    COUNT(DISTINCT rt.Team_ID)    AS Total_Teams,
    NVL(SUM(don.Amount), 0)       AS Total_Donations
FROM Disaster d
LEFT JOIN Victim        v   ON v.Disaster_ID  = d.Disaster_ID
LEFT JOIN Rescue_Team   rt  ON rt.Disaster_ID = d.Disaster_ID
LEFT JOIN Donation      don ON don.Disaster_ID= d.Disaster_ID
GROUP BY
    d.Disaster_ID, d.Disaster_Type,
    d.Location, d.Disaster_Date, d.Severity_Level;

-- 2. Resource Availability View
CREATE OR REPLACE VIEW Resource_Availability_View AS
SELECT
    r.Resource_ID,
    r.Resource_Type,
    r.Quantity_Available,
    d.Disaster_Type,
    d.Location,
    CASE
        WHEN r.Quantity_Available = 0        THEN 'Out of Stock'
        WHEN r.Quantity_Available < 100      THEN 'Low'
        WHEN r.Quantity_Available < 500      THEN 'Moderate'
        ELSE                                      'Sufficient'
    END AS Stock_Status
FROM Resources r
JOIN Disaster d ON d.Disaster_ID = r.Disaster_ID;

-- 3. Volunteer Team View
CREATE OR REPLACE VIEW Volunteer_Team_View AS
SELECT
    v.Volunteer_ID,
    v.Volunteer_Name,
    v.Contact_No,
    rt.Team_Name,
    rt.Leader_Name,
    d.Disaster_Type,
    d.Location
FROM Volunteer v
JOIN Rescue_Team rt ON rt.Team_ID    = v.Team_ID
JOIN Disaster    d  ON d.Disaster_ID = rt.Disaster_ID;

-- 4. Shelter Occupancy View
CREATE OR REPLACE VIEW Shelter_Occupancy_View AS
SELECT
    s.Shelter_ID,
    s.Shelter_Name,
    s.Location,
    s.Capacity,
    COUNT(v.Victim_ID) AS Current_Occupancy,
    s.Capacity - COUNT(v.Victim_ID) AS Available_Slots,
    ROUND(COUNT(v.Victim_ID) / s.Capacity * 100, 1) AS Occupancy_Pct
FROM Shelter s
LEFT JOIN Victim v ON v.Shelter_ID = s.Shelter_ID
GROUP BY s.Shelter_ID, s.Shelter_Name, s.Location, s.Capacity;


-- ============================================================
--  TRIGGER — Shelter Capacity Check
-- ============================================================

CREATE OR REPLACE TRIGGER trg_check_shelter_capacity
BEFORE INSERT ON Victim
FOR EACH ROW
DECLARE
    current_count NUMBER;
    max_capacity  NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO current_count
    FROM Victim
    WHERE Shelter_ID = :NEW.Shelter_ID;

    SELECT Capacity
    INTO max_capacity
    FROM Shelter
    WHERE Shelter_ID = :NEW.Shelter_ID;

    IF current_count >= max_capacity THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'Shelter is at full capacity. Cannot admit more victims.'
        );
    END IF;
END;
/


-- ============================================================
--  ROLE-BASED ACCESS CONTROL
-- ============================================================

-- Create roles
CREATE ROLE relief_coordinator;
CREATE ROLE volunteer_role;
CREATE ROLE agency_rep;

-- Relief Coordinator: full access to most tables
GRANT SELECT, INSERT, UPDATE, DELETE ON Disaster            TO relief_coordinator;
GRANT SELECT, INSERT, UPDATE, DELETE ON Victim              TO relief_coordinator;
GRANT SELECT, INSERT, UPDATE, DELETE ON Resources           TO relief_coordinator;
GRANT SELECT, INSERT, UPDATE, DELETE ON Resource_Distribution TO relief_coordinator;
GRANT SELECT                         ON Shelter             TO relief_coordinator;
GRANT SELECT                         ON Volunteer           TO relief_coordinator;
GRANT SELECT                         ON Donation            TO relief_coordinator;

-- Volunteer: read-only on tasks + own updates
GRANT SELECT ON Victim              TO volunteer_role;
GRANT SELECT ON Rescue_Team         TO volunteer_role;
GRANT SELECT ON Resource_Distribution TO volunteer_role;
GRANT SELECT ON Resources           TO volunteer_role;

-- Agency Representative: supply/donation management
GRANT SELECT, INSERT, UPDATE ON Resources   TO agency_rep;
GRANT SELECT, INSERT         ON Donation    TO agency_rep;
GRANT SELECT                 ON Disaster    TO agency_rep;
GRANT SELECT                 ON Shelter     TO agency_rep;


-- ============================================================
--  USEFUL SELECT QUERIES  (for viva / demo)
-- ============================================================

-- 1. Victims per disaster with severity
SELECT d.Disaster_Type, d.Location, d.Severity_Level,
       COUNT(v.Victim_ID) AS Total_Victims
FROM Disaster d
LEFT JOIN Victim v ON v.Disaster_ID = d.Disaster_ID
GROUP BY d.Disaster_Type, d.Location, d.Severity_Level
ORDER BY Total_Victims DESC;

-- 2. Total donations per disaster
SELECT d.Disaster_Type, d.Location,
       SUM(don.Amount) AS Total_Donated
FROM Disaster d
JOIN Donation don ON don.Disaster_ID = d.Disaster_ID
GROUP BY d.Disaster_Type, d.Location
ORDER BY Total_Donated DESC;

-- 3. Resources running low (below 100 units)
SELECT r.Resource_Type, r.Quantity_Available,
       d.Disaster_Type, d.Location
FROM Resources r
JOIN Disaster d ON d.Disaster_ID = r.Disaster_ID
WHERE r.Quantity_Available < 100
ORDER BY r.Quantity_Available;

-- 4. Critical victims with their shelter
SELECT v.Victim_First_Name || ' ' || v.Victim_Last_Name AS Name,
       v.Age, v.Gender, s.Shelter_Name, s.Location
FROM Victim v
JOIN Shelter s ON s.Shelter_ID = v.Shelter_ID
WHERE v.Health_Status = 'Critical'
ORDER BY v.Age DESC;

-- 5. Volunteers per rescue team
SELECT rt.Team_Name, rt.Leader_Name,
       COUNT(vol.Volunteer_ID) AS Volunteer_Count
FROM Rescue_Team rt
LEFT JOIN Volunteer vol ON vol.Team_ID = rt.Team_ID
GROUP BY rt.Team_Name, rt.Leader_Name
ORDER BY Volunteer_Count DESC;

-- 6. Use the Disaster Summary View
SELECT * FROM Disaster_Summary_View
ORDER BY Total_Victims DESC;

-- 7. Use the Resource Availability View — show low/out of stock
SELECT * FROM Resource_Availability_View
WHERE Stock_Status IN ('Low', 'Out of Stock');

-- 8. Shelter occupancy report
SELECT * FROM Shelter_Occupancy_View
ORDER BY Occupancy_Pct DESC;

-- ── Auto-increment Sequences ─────────────────────────────────
-- (Start after the highest IDs already inserted)
CREATE SEQUENCE seq_donation    START WITH 36  INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_volunteer   START WITH 51  INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_rescue_team START WITH 16  INCREMENT BY 1 NOCACHE;


-- ── FIX: add_victim_proc ─────────────────────────────────────
-- Original was broken — it omitted Shelter_ID and Disaster_ID
-- which are NOT NULL. This version takes all required fields.
CREATE OR REPLACE PROCEDURE add_victim_proc(
    p_id         NUMBER,
    p_fname      VARCHAR2,
    p_lname      VARCHAR2,
    p_age        NUMBER,
    p_gender     VARCHAR2,
    p_health     VARCHAR2,
    p_shelter_id NUMBER,
    p_dis_id     NUMBER
) IS
BEGIN
    INSERT INTO Victim (
        Victim_ID, Victim_First_Name, Victim_Last_Name,
        Age, Gender, Health_Status, Shelter_ID, Disaster_ID
    ) VALUES (
        p_id, p_fname, p_lname,
        p_age, p_gender, p_health, p_shelter_id, p_dis_id
    );
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: Duplicate Victim ID ' || p_id);
        RAISE;
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        RAISE;
END;
/


-- ── NEW: add_donation_proc ───────────────────────────────────
CREATE OR REPLACE PROCEDURE add_donation_proc(
    p_donor   VARCHAR2,
    p_amount  NUMBER,
    p_date    VARCHAR2,
    p_dis_id  NUMBER
) IS
BEGIN
    INSERT INTO Donation (Donation_ID, Donor_Name, Donation_Date, Amount, Disaster_ID)
    VALUES (seq_donation.NEXTVAL, p_donor, TO_DATE(p_date, 'YYYY-MM-DD'), p_amount, p_dis_id);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        RAISE;
END;
/


-- ── NEW: add_volunteer_proc ──────────────────────────────────
CREATE OR REPLACE PROCEDURE add_volunteer_proc(
    p_name    VARCHAR2,
    p_contact VARCHAR2,
    p_team_id NUMBER
) IS
BEGIN
    INSERT INTO Volunteer (Volunteer_ID, Volunteer_Name, Contact_No, Team_ID)
    VALUES (seq_volunteer.NEXTVAL, p_name, p_contact, p_team_id);
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: Contact number already registered');
        RAISE;
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        RAISE;
END;
/


-- ── NEW: add_rescue_team_proc ────────────────────────────────
CREATE OR REPLACE PROCEDURE add_rescue_team_proc(
    p_name    VARCHAR2,
    p_leader  VARCHAR2,
    p_dis_id  NUMBER
) IS
BEGIN
    INSERT INTO Rescue_Team (Team_ID, Team_Name, Leader_Name, Disaster_ID)
    VALUES (seq_rescue_team.NEXTVAL, p_name, p_leader, p_dis_id);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        RAISE;
END;
/


-- ── NEW: get_avg_donation (bonus function) ───────────────────
CREATE OR REPLACE FUNCTION get_avg_donation(p_dis_id NUMBER)
RETURN NUMBER IS
    v_avg NUMBER;
BEGIN
    SELECT NVL(ROUND(AVG(Amount), 2), 0)
    INTO   v_avg
    FROM   Donation
    WHERE  Disaster_ID = p_dis_id;
    RETURN v_avg;
END;
/


-- ── Verify ───────────────────────────────────────────────────
-- Quick test: call a function
SELECT get_total_donation(1)  AS total_don_dis1,
       get_victim_count(1)    AS victim_count_dis1,
       get_avg_donation(1)    AS avg_don_dis1
FROM DUAL;

-- Quick test: call a procedure
EXEC add_donation_proc('Test Donor', 10000, '2023-10-01', 1);
SELECT * FROM Donation WHERE Donor_Name = 'Test Donor';
DELETE FROM Donation WHERE Donor_Name = 'Test Donor';
COMMIT;