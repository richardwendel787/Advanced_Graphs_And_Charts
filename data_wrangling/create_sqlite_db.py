# Import dependencies
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
import pandas as pd

# Create classes
Base = declarative_base()

class License(Base):
    __tablename__ = 'license_records'
    id = Column(Integer, primary_key=True)
    rownumber = Column(Integer, primary_key=True)
    animalgender = Column(String(255), nullable=False)
    breedname = Column(String(255), nullable=False)
    borough = Column(String(255), nullable=False)
    zipcode = Column(Integer, nullable=False)

class Relationship(Base):
    __tablename__ = 'breed_breed_group_relationship'
    id = Column(Integer, primary_key=True)
    breedname = Column(String(255), nullable=False)
    breedgroup = Column(String(255), nullable=False)
    assumedflag = Column(Integer, nullable=False)

class Stats(Base):
    __tablename__ = 'breed_stats'
    id = Column(Integer, primary_key=True)
    breedname = Column(String(255), nullable=False)
    avgweight = Column(Float, nullable=False)
    avglife = Column(Float, nullable=False)

# Create SQLite database and session
engine = create_engine('sqlite:///dog_data.sqlite')
Base.metadata.create_all(engine)
session = Session(bind=engine)

# Read CSV files into DataFrames
license_records_df = pd.read_csv('Resources/license_records.csv')
breed_breed_group_relationship_df = pd.read_csv('Resources/breed_breed_group_relationship.csv')
breed_stats_df = pd.read_csv('Resources/breed_stats.csv')

### Create, add, and commit DF rows as instances to respective tables

# license_records table
for index, row in license_records_df.iterrows():
    instance = License(id=index+1,
                       rownumber=row['rownumber'],
                       animalgender=row['animalgender'],
                       breedname=row['breedname'],
                       borough=row['borough'],
                       zipcode=row['zipcode'])
    session.add(instance)

# breed_breed_group_relationship table
for index, row in breed_breed_group_relationship_df.iterrows():
    instance = Relationship(id=index+1,
                            breedname=row['breedname'],
                            breedgroup=row['breedgroup'],
                            assumedflag=row['assumedflag'])
    session.add(instance)

# breed_stats table
for index, row in breed_stats_df.iterrows():
    instance = Stats(id=index+1,
                     breedname=row['breedname'],
                     avgweight=row['avgweight'],
                     avglife=row['avglife'])
    session.add(instance)

# Commit all transactions
session.commit()