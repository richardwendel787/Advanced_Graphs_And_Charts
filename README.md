# Visualizing Dog Breed Popularity in NY for 2016

Everyone has their favorite dog breed. This project strives to show which are the most popular breeds and breed groups in the New York City area, including all 5 boroughs. There are 2 visulazations of this data, which includes a chloropleth map of the New York area with the number of dogs indicated by the color range and a circle pack showing the number of licenses for a breed and it's AKC breed group. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

### Circle Pack

#### Prerequisites
Data must be in the proper format to be able to parse it for the visualization.

#### Steps
1. Set variables for width, height and data
2. SVG: Append using d3 while setting the width and height attributes set a variable
3. G Group: Select using d3 and append 'g'
4. Get data from the source: csv, json, API.
5. Pass the data to stratify which creates heirarchies in the data.
    * Assign parent and child columns
5. If data is in a CSV Pass the data to stratify which creates hierarchies in the data.
6. If data is another format use the unpack function to display the data.


=======
### Data Wrangling
UCB Data Analytics Boot Camp, week 17 visualization group project, data wranging section

Data Clean Up<br>
This was achieved first by cleansing our NYC dog licenses data. We restricted our view to 2016, removed records with any null values in relevant fields, and normalized breed and borough names by mapping (replacing) raw values. A breed-to-breed-group relationship table and breed-stats tables were created with data primarily from the American Kennel Club and Google search results.<br>
See: data_cleanup.ipynb

SQLite Database<br>
The licenses, breed-to-breed-group, and breed-stats CSVs were loaded into tables within a SQLite database.<br>
See: create_sqlite_db.py, dog_data.sqlite

Flask<br>
Originally, the tables were used to create two views that could be exported as CSVs and used by the team. On recommendation from the teacher, we changed our approach to make the view-like data accessible via a flask.<br>

See: app.py
=======

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Bootstrap](link to download here) - The web framework used
* [D3.js](link to download here) - Used to create visualizations



## Authors

* **Alli Kruger** - *Circle Pack Creation & Interactions* 
* **Bradley Weintraub** - *Data Wrangling & Choropleth* 
* **Jason Fung** - *Data Wrangling, SQL & Flask App* 
* **Richard Wendel** - *HTML & CSS*  

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

