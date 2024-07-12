from dotenv import load_dotenv
import os
import psycopg2
import csv

config = load_dotenv()

conn = psycopg2.connect(
    database=os.environ["DB_NAME"],
    host=os.environ["DB_HOST"],
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    port=os.environ["DB_PORT"]
)

cursor = conn.cursor()

regions = ["Global","CHN","IND","MEA","NAM","NEE","SEA","EUR","LAM","SSA","OPA"]

with open("DBScripts/data.csv", mode="r") as csvfile:
    reader = csv.reader(csvfile)
    for line in reader:
        if line[0]=="Capacity Factor":
            energy_type = line[1]
            year = int(line[3])
            print(line[4:])
            for i, entry in enumerate(line[4:15]):
                region = regions[i]
                gw_percent = entry
                cursor.execute("INSERT INTO capacity_factor (region, energy_type, year, gw_percent) VALUES(%s, %s, %s, %s);", (region, energy_type, year, entry))
conn.commit()
cursor.close()
conn.close()
