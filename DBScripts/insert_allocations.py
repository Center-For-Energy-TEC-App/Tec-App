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
regions = ["Global", "CHN","IND","MEA","NAM","NEE","SEA","EUR","LAM","SSA","OPA"]

cursor = conn.cursor()

def insert_global():

    cursor.execute(f"CREATE TABLE allocation_defaults_global (category varchar(40), global_tw decimal, solar_gw integer, wind_gw integer, hydro_gw integer, geo_gw integer, bio_gw integer, nuclear_gw integer);")

    with open(f"DBScripts/Data/TEC_Allocations.Limits.xlsx - Global.csv", mode="r") as csvfile:
        reader = csv.reader(csvfile)
        for i, line in enumerate(reader):
            print(line)
            if i==3:
                cursor.execute(f"INSERT INTO allocation_defaults_global VALUES ('2024',{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
            if i==4:
                cursor.execute(f"INSERT INTO allocation_defaults_global VALUES ('BAU',{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
            if i>6:
                cursor.execute(f"INSERT INTO allocation_defaults_global VALUES ('altered',{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")

def insert_region(region):

    cursor.execute(f"CREATE TABLE allocation_defaults_{region.lower()} (category varchar(40), global_tw decimal, regional_gw integer, solar_gw integer, wind_gw integer, hydro_gw integer, geo_gw integer, bio_gw integer, nuclear_gw integer);")

    with open(f"DBScripts/Data/TEC_Allocations.Limits.xlsx - {region}.csv", mode="r") as csvfile:
        reader = csv.reader(csvfile)
        for i, line in enumerate(reader):
            print(line)
            if i==3:
                cursor.execute(f"INSERT INTO allocation_defaults_{region.lower()} VALUES ('2024',5,{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
            if i==4:
                cursor.execute(f"INSERT INTO allocation_defaults_{region.lower()} VALUES ('BAU',8,{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
            if i>6:
                cursor.execute(f"INSERT INTO allocation_defaults_{region.lower()} VALUES ('altered',{line[0]},{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")

def insert_max_vals():
        cursor.execute(f"CREATE TABLE max_values (energy_type varchar(40), global integer, chn integer, ind integer, mea integer, nam integer, nee integer, sea integer, eur integer, lam integer, ssa integer, opa integer);")
        with open(f"DBScripts/Data/TEC_Allocations.Limits.xlsx - Max Values.csv", mode="r") as csvfile:
            reader = csv.reader(csvfile)
            for line in reader:
                cursor.execute(f"INSERT INTO max_values VALUES ('{line[0].lower()}',{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]},{line[9]},{line[9]},{line[10]},{line[11]},{line[12]})")


insert_global()

for i in regions[1:]:
    insert_region(i)

insert_max_vals()

conn.commit()
cursor.close()
conn.close()