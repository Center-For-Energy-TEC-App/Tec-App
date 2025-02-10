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

def parse_percentage(percentage):
    num = percentage[:-1]
    return float(num) / 100

def parse_large_num(num):
    newNum = ""
    for i in num:
        if i!=",":
            newNum+=i
    return float(newNum)

def parse_energy_type(energy):
    newWord = ""
    for i in energy:
        if i==" ":
            newWord+="_"
        else:
            newWord+=i
    return newWord.lower()

def insert_secondary_calculations():
    cursor.execute(f"CREATE TABLE secondary_calculations_capacity_factor (energy_type varchar(10), year integer, region varchar(10), value decimal);")
    cursor.execute(f"CREATE TABLE secondary_calculations_forecast_cagr (energy_type varchar(20), region varchar(10), value decimal);")
    cursor.execute(f"CREATE TABLE secondary_calculations_forecast_growth_rate (energy_type varchar(20), year integer, region varchar(10), value decimal);")

    with open(f"DBScripts/Data/GraphData/Secondary Calculations-Table 1.tsv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter='\t')
        for i, line in enumerate(reader):
            print(line)
            if i>1 and i<86 and line[0]=="Capacity Factor":
                regionIndex = 0
                for entry in line[4:]:
                    cursor.execute(f"INSERT INTO secondary_calculations_capacity_factor VALUES('{line[1]}', {line[3]}, '{regions[regionIndex].lower()}', {parse_percentage(entry) if entry else 0})")
                    regionIndex+=1

            if i>89 and i<96 and line[0]=="Forecast CAGR":
                regionIndex = 0
                for entry in line[4:]:
                    cursor.execute(f"INSERT INTO secondary_calculations_forecast_cagr VALUES('{line[1]}', '{regions[regionIndex].lower()}', {parse_percentage(entry) if entry else 0})")
                    regionIndex+=1
            
            if i>96 and line[0]=="Forecast Annual Growth Rate":
                regionIndex = 0
                for entry in line[4:]:
                    cursor.execute(f"INSERT INTO secondary_calculations_forecast_growth_rate VALUES('{line[1]}', {line[3]}, '{regions[regionIndex].lower()}', {parse_percentage(entry) if entry else 0})")
                    regionIndex+=1

def insert_data_aggregation():
    cursor.execute(f"CREATE TABLE data_aggregation_installed_capacity (energy_type varchar(20), year integer, region varchar(10), value decimal);")
    cursor.execute(f"CREATE TABLE data_aggregation_electricity_generation (energy_type varchar(20), year integer, region varchar(10), value decimal);")
    with open(f"DBScripts/Data/GraphData/Data Aggregation-Table 1.tsv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter="\t")
        for i, line in enumerate(reader):
            print(line)
            if i>0 and i<85 and line[0]=="Installed Capacity":
                regionIndex = 0
                for entry in line[4:15]:
                    cursor.execute(f"INSERT INTO data_aggregation_installed_capacity VALUES('{line[1]}', {line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                    regionIndex+=1
            if i>84 and line[0]=="Electricity Generation":
                    regionIndex = 0
                    for entry in line[4:15]:
                        cursor.execute(f"INSERT INTO data_aggregation_electricity_generation VALUES('{line[1]}', {line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                        regionIndex+=1

def insert_transpose():
    cursor.execute(f"CREATE TABLE transpose_electricity_generation (energy_type varchar(30), year integer, region varchar(10), value decimal);")
    cursor.execute(f"CREATE TABLE transpose_installed_capacity (energy_type varchar(30), year integer, region varchar(10), value decimal);")
    cursor.execute(f"CREATE TABLE transpose_energy_consumption (energy_type varchar(30), year integer, region varchar(10), value decimal);")
    cursor.execute(f"CREATE TABLE transpose_co2_emissions (energy_type varchar(30), year integer, region varchar(10), value decimal);")

    with open(f"DBScripts/Data/GraphData/Transpose-Table 1.tsv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter="\t")
        for i, line in enumerate(reader):
            print(line)
            if  i<168:
                regionIndex = 0
                for entry in line[4:15]:
                    cursor.execute(f"INSERT INTO transpose_electricity_generation VALUES('{parse_energy_type(line[1])}', {line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                    regionIndex+=1
            if i>167 and i<336:
                regionIndex = 0
                for entry in line[4:15]:
                    cursor.execute(f"INSERT INTO transpose_installed_capacity VALUES('{parse_energy_type(line[1])}', {line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                    regionIndex+=1
            if i>335 and i<378:
                regionIndex = 0
                for entry in line[4:15]:
                    cursor.execute(f"INSERT INTO transpose_energy_consumption VALUES('{parse_energy_type(line[1])}', {line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                    regionIndex+=1
            if i>377:
                regionIndex = 0
                for entry in line[4:15]:
                    cursor.execute(f"INSERT INTO transpose_co2_emissions VALUES('{parse_energy_type(line[1])}', {line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                    regionIndex+=1
            

def insert_initial_graph_data():
    cursor.execute(f"CREATE TABLE initial_graph_data (energy_type varchar(10), year integer, global decimal, chn decimal, ind decimal, mea decimal, nam decimal, nee decimal, sea decimal, eur decimal, lam decimal, ssa decimal, opa decimal);")
    with open(f"DBScripts/Data/GraphData/InitialData.tsv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter="\t")
        for i, line in enumerate(reader):
            print(line)
            cursor.execute(f"INSERT INTO initial_graph_data VALUES ('{parse_energy_type(line[1])}', {line[3]}, {parse_large_num(line[4])},{parse_large_num(line[5])},{parse_large_num(line[6])},{parse_large_num(line[7])},{parse_large_num(line[8])},{parse_large_num(line[9])},{parse_large_num(line[10])},{parse_large_num(line[11])},{parse_large_num(line[12])},{parse_large_num(line[13])},{parse_large_num(line[14])});")

def insert_fossil_emissions_data():
    cursor.execute(f"CREATE TABLE fossil_emissions_data (year integer, region varchar(10), value decimal)")
    with open("DBScripts/Data/GraphData/Fossil Emissions.tsv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter="\t")
        for line in reader:
            print(line)
            regionIndex = 0
            for entry in line[4:15]:
                cursor.execute(f"INSERT INTO fossil_emissions_data VALUES({line[3]}, '{regions[regionIndex].lower()}', {parse_large_num(entry) if entry else 0})")
                regionIndex+=1
    
def drop_all_tables():
    cursor.execute("DROP TABLE IF EXISTS secondary_calculations_capacity_factor,secondary_calculations_forecast_cagr, secondary_calculations_forecast_growth_rate,data_aggregation_installed_capacity,data_aggregation_electricity_generation,transpose_electricity_generation,transpose_installed_capacity,transpose_energy_consumption,transpose_co2_emissions")

# insert_secondary_calculations()
# insert_data_aggregation()
# insert_transpose()

insert_initial_graph_data()
# insert_fossil_emissions_data()


# drop_all_tables()

conn.commit()   # commit changes (otherwise changes will not be reflected in remote database)
cursor.close()  # close cursor & connection
conn.close()