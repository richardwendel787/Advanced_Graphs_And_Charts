-- Load License Records

DROP TABLE IF EXISTS license_records
;

CREATE TABLE IF NOT EXISTS license_records (
	Id SERIAL PRIMARY KEY,
	RowNumber INT NOT NULL,
	AnimalGender VARCHAR(1) NOT NULL,
	BreedName VARCHAR(255) NOT NULL,
	Borough VARCHAR(255) NOT NULL,
	ZipCode INT NOT NULL
)
;

COPY license_records(RowNumber, AnimalGender, BreedName, Borough, ZipCode)
FROM 'C:\Users\jfung\Desktop\data_wrangling\Resources\license_records.csv' DELIMITER ',' CSV HEADER
;

SELECT *
FROM license_records
LIMIT 999999999
;



-- Load Breed-BreedGroup Relationships

DROP TABLE IF EXISTS breed_breed_group_relationship
;

CREATE TABLE IF NOT EXISTS breed_breed_group_relationship (
	Id SERIAL PRIMARY KEY,
	BreedName VARCHAR(255) NOT NULL,
	BreedGroup VARCHAR(255) NOT NULL,
	AssumedFlag INT NOT NULL
)
;

COPY breed_breed_group_relationship(BreedName, BreedGroup, AssumedFlag)
FROM 'C:\Users\jfung\Desktop\data_wrangling\Resources\breed_breed_group_relationship.csv' DELIMITER ',' CSV HEADER
;

SELECT *
FROM breed_breed_group_relationship
LIMIT 999999999
;



-- Load Breed Stats

DROP TABLE IF EXISTS breed_stats
;

CREATE TABLE IF NOT EXISTS breed_stats (
	Id SERIAL PRIMARY KEY,
	BreedName VARCHAR(255) NOT NULL,
	HeightMin FLOAT	NULL,
	HeightMax FLOAT	NULL,
	WeightMin FLOAT	NULL,
	WeightMax FLOAT	NULL,
	LifeMin FLOAT NULL,
	LifeMax FLOAT NULL,
	AvgHeight FLOAT	NULL,
	AvgWeight FLOAT	NULL,
	AvgLife FLOAT NULL
)
;

COPY breed_stats(BreedName, HeightMin, HeightMax, WeightMin, WeightMax, LifeMin, LifeMax, AvgHeight, AvgWeight, AvgLife)
FROM 'C:\Users\jfung\Desktop\data_wrangling\Resources\breed_stats.csv' DELIMITER ',' CSV HEADER
;

SELECT *
FROM breed_stats
LIMIT 999999999
;



-- Create Breed Weight, Life View 

DROP VIEW IF EXISTS breed_count_weight_life
;

CREATE VIEW breed_count_weight_life AS

	SELECT sub1.*,
	sub3.avgweight,
	sub3.avglife AS "lifeexpectancy"
	FROM (
		SELECT NULL AS "breedgroup",
		'Dog' AS "breedname",
		COUNT(lr.*) AS "licensecount"
		FROM license_records lr
	) sub1
	LEFT JOIN (
		SELECT 'Dog' AS "breedname",
		AVG(sub2.avgweight) AS "avgweight",
		AVG(sub2.avglife) AS "avglife"
		FROM (
			SELECT bbgr.BreedGroup,
			AVG(bs.AvgWeight) AS "avgweight",
			AVG(bs.AvgLife) AS "avglife"
			FROM breed_stats bs
			JOIN breed_breed_group_relationship bbgr
			ON bs.BreedName = bbgr.BreedName
			GROUP BY bbgr.BreedGroup
		) sub2
	) sub3
	ON sub1.breedname = sub3.breedname

	UNION ALL
	SELECT sub3.*
	FROM (
		SELECT sub1.*,
		sub2.avgweight,
		sub2.avglife AS "lifeexpectancy"
		FROM (
			SELECT 'Dog',
			bbgr.BreedGroup,
			COUNT(lr.BreedName)
			FROM license_records lr
			JOIN breed_breed_group_relationship bbgr
			ON lr.BreedName = bbgr.BreedName
			GROUP BY bbgr.BreedGroup
		) sub1
		LEFT JOIN (
			SELECT bbgr.BreedGroup,
			AVG(bs.AvgWeight) AS "avgweight",
			AVG(bs.AvgLife) AS "avglife"
			FROM breed_stats bs
			JOIN breed_breed_group_relationship bbgr
			ON bs.BreedName = bbgr.BreedName
			GROUP BY bbgr.BreedGroup
		) sub2
		ON sub1.BreedGroup = sub2.BreedGroup
		ORDER BY sub1.BreedGroup
	) sub3

	UNION ALL
	SELECT *
	FROM (
		SELECT bbgr.BreedGroup,
		sub2.BreedName,
		sub2.licensecount,
		bs.AvgWeight,
		bs.AvgLife AS "lifeexpectancy"
		FROM (
			SELECT lr.BreedName,
			COUNT(lr.id) AS "licensecount"
			FROM license_records lr
			GROUP BY lr.BreedName
		) sub2
		JOIN breed_breed_group_relationship bbgr
		ON sub2.BreedName = bbgr.BreedName
		LEFT JOIN breed_stats bs
		ON sub2.BreedName = bs.BreedName
		ORDER BY bbgr.BreedGroup ASC, sub2.BreedName ASC
	) sub3
;

SELECT *
FROM breed_count_weight_life
LIMIT 999999999
;



-- Create Borough View

DROP VIEW IF EXISTS borough_count
;

CREATE VIEW borough_count AS
	
	SELECT NULL AS "city",
	'New York' AS "borough",
	COUNT(lr.*) AS "licensecount"
	FROM license_records lr

	UNION ALL
	SELECT sub1.*
	FROM (
		SELECT 'New York' AS "city",
		lr.Borough,
		COUNT(lr.id) AS "licensecount"
		FROM license_records lr
		GROUP BY lr.Borough
		ORDER BY lr.Borough ASC
	) sub1
;

SELECT *
FROM borough_count
LIMIT 999999999
;