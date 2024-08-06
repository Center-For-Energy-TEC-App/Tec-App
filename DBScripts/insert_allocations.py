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

cursor = conn.cursor()  #initialize database cursor

# def insert_global():

#     #create global table
#     cursor.execute(f"CREATE TABLE allocation_defaults_global (category varchar(10), global_tw decimal, solar_gw integer, wind_gw integer, hydro_gw integer, geo_gw integer, bio_gw integer, nuclear_gw integer);")

#     #csv reader
#     with open(f"DBScripts/Data/Global-Table 1.csv", mode="r") as csvfile:
#         reader = csv.reader(csvfile)
#         for i, line in enumerate(reader):
#             print(line)
#             if i==3:    # row for 2023 values
#                 cursor.execute(f"INSERT INTO allocation_defaults_global VALUES ('2023',{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
#             if i==4:    # row for BAU values
#                 cursor.execute(f"INSERT INTO allocation_defaults_global VALUES ('bau',{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
#             if i>6:     # all altered rows (8 to 15 TW)
#                 cursor.execute(f"INSERT INTO allocation_defaults_global VALUES ('altered',{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")

# def insert_region(region):

#     # create regional table
#     cursor.execute(f"CREATE TABLE allocation_defaults_{region.lower()} (category varchar(10), global_tw decimal, regional_gw integer, solar_gw integer, wind_gw integer, hydro_gw integer, geo_gw integer, bio_gw integer, nuclear_gw integer);")

#     with open(f"DBScripts/Data/{region}-Table 1.csv", mode="r") as csvfile:
#         reader = csv.reader(csvfile)
#         for i, line in enumerate(reader):
#             print(line)
#             if i==3:    # row for 2023 values
#                 cursor.execute(f"INSERT INTO allocation_defaults_{region.lower()} VALUES ('2023',4.1,{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
#             if i==4:    # row for BAU values
#                 cursor.execute(f"INSERT INTO allocation_defaults_{region.lower()} VALUES ('bau',8.0,{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
#             if i>6:     # all altered rows (8 to 15 TW)
#                 cursor.execute(f"INSERT INTO allocation_defaults_{region.lower()} VALUES ('altered',{line[0]},{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")

def insert_defaults():
    cursor.execute(f"CREATE TABLE allocation_defaults (region varchar(10), category varchar(10), global_tw decimal, regional_gw integer, solar_gw integer, wind_gw integer, hydro_gw integer, geo_gw integer, bio_gw integer, nuclear_gw integer);")
    with open(f"DBScripts/Data/Global-Table 1.csv", mode="r") as csvfile:
        reader = csv.reader(csvfile)
        for i, line in enumerate(reader):
            print(line)
            if i==3:    # row for 2023 values
                 cursor.execute(f"INSERT INTO allocation_defaults VALUES ('global', '2023',{line[1]}, '0', {line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
            if i==4:    # row for BAU values
                 cursor.execute(f"INSERT INTO allocation_defaults VALUES ('global', 'bau',{line[1]}, '0', {line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
    for region in regions[1:]:
        with open(f"DBScripts/Data/{region}-Table 1.csv", mode="r") as csvfile:
            reader = csv.reader(csvfile)
            for i, line in enumerate(reader):
                print(line)
                if i==3:    # row for 2023 values
                    cursor.execute(f"INSERT INTO allocation_defaults VALUES ('{region.lower()}', '2023',4.1,{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")
                if i==4:    # row for BAU values
                    cursor.execute(f"INSERT INTO allocation_defaults VALUES ('{region.lower()}', 'bau',8.0,{line[1]},{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]})")

# for min max sheet
def insert_min_max_vals():
    # create min max table
    cursor.execute(f"CREATE TABLE min_max_values (category varchar(3), energy_type varchar(10), global decimal, chn decimal, ind decimal, mea decimal, nam decimal, nee decimal, sea decimal, eur decimal, lam decimal, ssa decimal, opa decimal);")
    with open(f"DBScripts/Data/Max.Min Values-Table 1.csv", mode="r") as csvfile:
        reader = csv.reader(csvfile)
        for line in reader:
            if line[1]=="Max GW":   # inserting max values
                cursor.execute(f"INSERT INTO min_max_values VALUES ('max','{line[0].lower()}',{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]},{line[8]},{line[9]},{line[10]},{line[11]},{line[12]})")
            else:                   # inserting min values
                cursor.execute(f"INSERT INTO min_max_values VALUES ('min','{line[0].lower()}',{line[2]},{line[3]},{line[4]},{line[5]},{line[6]},{line[7]},{line[8]},{line[9]},{line[10]},{line[11]},{line[12]})")

# full sheet insert
def insert():
    # insert_global()

    # for i in regions[1:]:
    #     insert_region(i)

    insert_defaults()

    insert_min_max_vals()

# full database drop
def empty_database():
    for i in regions:
        cursor.execute(f"DROP TABLE allocation_defaults_{i.lower()}")
    cursor.execute("DROP TABLE min_max_values")

insert()

# empty_database()

conn.commit()   # commit changes (otherwise changes will not be reflected in remote database)
cursor.close()  # close cursor & connection
conn.close()