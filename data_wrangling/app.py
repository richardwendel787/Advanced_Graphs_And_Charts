# Import dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify
from flask_cors import CORS

# Database
engine = create_engine('sqlite:///dog_data.sqlite')
Base = automap_base()
Base.prepare(engine, reflect=True)

# Table references
License = Base.classes.license_records
Relationship = Base.classes.breed_breed_group_relationship
Stats = Base.classes.breed_stats

# Flask setup
app = Flask(__name__)
cors = CORS(app)

### Flask routes
# Home
@app.route('/')
def home():
    return(
        f'Welcome to the dog data API.<br/>'
        f'<br/>'
        f'Available Routes:<br/>'
        f'/breed_count_weight_life<br/>'
        f'/borough_count<br/>'
    )

# Breed Count Weight Life View
@app.route('/breed_count_weight_life')
def breed_weight_life_view():
    with engine.connect() as con: 
        records = con.execute(
            """
            SELECT sub1.*,
            sub3.avgweight,
            sub3.avglife AS "lifeexpectancy"
            FROM (
                SELECT NULL AS "breedgroup",
                'Dog' AS "breedname",
                COUNT(lr.id) AS "licensecount"
                FROM license_records lr
            ) sub1
            LEFT JOIN (
                SELECT 'Dog' AS "breedname",
                AVG(sub2.avgweight) AS "avgweight",
                AVG(sub2.avglife) AS "avglife"
                FROM (
                    SELECT bbgr.breedgroup,
                    AVG(bs.avgweight) AS "avgweight",
                    AVG(bs.avglife) AS "avglife"
                    FROM breed_stats bs
                    JOIN breed_breed_group_relationship bbgr
                    ON bs.breedname = bbgr.breedname
                    GROUP BY bbgr.breedgroup
                ) sub2
            ) sub3
            ON sub1.breedname = sub3.breedname
            UNION ALL
            SELECT sub3.*
            FROM (
                SELECT sub1.*,
                sub2.avgweight,
                sub2.avglife
                FROM (
                    SELECT 'Dog',
                    bbgr.breedgroup,
                    COUNT(lr.breedname)
                    FROM license_records lr
                    JOIN breed_breed_group_relationship bbgr
                    ON lr.breedname = bbgr.breedname
                    GROUP BY bbgr.breedgroup
                ) sub1
                LEFT JOIN (
                    SELECT bbgr.breedgroup,
                    AVG(bs.avgweight) AS "avgweight",
                    AVG(bs.avglife) AS "avglife"
                    FROM breed_stats bs
                    JOIN breed_breed_group_relationship bbgr
                    ON bs.breedname = bbgr.breedname
                    GROUP BY bbgr.breedgroup
                ) sub2
                ON sub1.breedgroup = sub2.breedgroup
                ORDER BY sub1.breedgroup
            ) sub3
            UNION ALL
            SELECT sub3.*
            FROM (
                SELECT bbgr.breedgroup,
                sub2.breedname,
                sub2.licensecount,
                bs.avgweight,
                bs.avglife
                FROM (
                    SELECT lr.breedname,
                    COUNT(lr.id) AS "licensecount"
                    FROM license_records lr
                    GROUP BY lr.breedname
                ) sub2
                JOIN breed_breed_group_relationship bbgr
                ON sub2.breedname = bbgr.breedname
                LEFT JOIN breed_stats bs
                ON sub2.breedname = bs.breedname
                ORDER BY bbgr.breedgroup ASC, sub2.breedname ASC
            ) sub3
        """
        )
        record_dicts_list = []
        for breedgroup, breedname, licensecount, avgweight, lifeexpectancy in records:
            record_dict = {}
            record_dict['breedgroup'] = breedgroup
            record_dict['breedname'] = breedname
            record_dict['licensecount'] = licensecount
            record_dict['avgweight'] = avgweight
            record_dict['lifeexpectancy'] = lifeexpectancy
            record_dicts_list.append(record_dict)
        return jsonify(record_dicts_list)

# Borough Count View
@app.route('/borough_count')
def borough_count_view():
    with engine.connect() as con: 
        records = con.execute(
            """
            SELECT NULL AS "city",
            'New York' AS "borough",
            COUNT(lr.id) AS "licensecount"
            FROM license_records lr
            UNION ALL
            SELECT sub1.*
            FROM (
                SELECT 'New York' AS "city",
                lr.borough,
                COUNT(lr.id) AS "licensecount"
                FROM license_records lr
                GROUP BY lr.borough
                ORDER BY lr.borough ASC
            ) sub1
            """
        )
        record_dicts_list = []
        for city, borough, licensecount in records:
            record_dict = {}
            record_dict['city'] = city
            record_dict['borough'] = borough
            record_dict['licensecount'] = licensecount
            record_dicts_list.append(record_dict)
        return jsonify(record_dicts_list)

# Run Program
if __name__ == '__main__':
    app.run(debug=True)