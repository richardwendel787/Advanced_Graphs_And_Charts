var vWidth = 960;
var vHeight = 500;
var vData = {};
var view;
var filter;
var filteredData = {};

// Prepare our physical space
var svg = d3.select("#circle_chart")
    .append("svg")
    .attr('width', vWidth)
    .attr('height', vHeight);

var g = d3.select('#circle_chart svg')
    .append("g");

// // Get the data from our CSV file
// function fetchDogData() {
//     d3.csv('/d3_test/data/updated_breed_count_weight.csv').then(function (dogData, error) {
//         if (error) throw error;
//         childColumn = dogData.columns[1];
//         parentColumn = dogData.columns[0];

//         var stratify = d3.stratify()
//             .id(d => d[childColumn])
//             .parentId(d => d[parentColumn]);

//         vData = stratify(dogData);

//         view = "view-license";
//         updateViz(vData, view);
//     });
// }
// Fetch data from json file
function fetchJsonDogData() {
    //alternate d3.json('http://127.0.0.1:5000/breed_count_weight_life').then(function (dogData) {
    //d3.json('/d3_test/data/breed_count_weight_life.json').then(function (dogData) {
    d3.json('http://127.0.0.1:5000/breed_count_weight_life').then(function (dogData) {
        
        console.log("dogData", dogData);
        
        // Assign the child relationship to the data
        childColumn = dogData.breedname;
        console.log("dogData.breedname: ", dogData.breedname);
        
        // Assign the parent relationship to the data
        parentColumn = dogData.breedgroup;
        console.log("dogData.breedgroup: ", dogData.breedgroup);

    });
}

/***
 * unpacks JSON formats in column form
 * {
 *      'col1':{
 *          '1':'value1',
 *          '2':'value2',
 *          '...':'value...'
 *      },
 *      'col2':{
 *          '1':'value1',
 *          '2':'value2',
 *          '...':'value...'
 *      },
 * }
 * 
 * @returns rows
 * 
 */
function unpackJsonColumns(data, rows){
    console.log('unpackJsonColumns', data);
    var columnLength = [];
    var rows = rows || [];

    
    Object.entries(data).forEach(entries => {
        var colValues, colName;

        colName = entries[0];
        colValues = Object.entries(entries[1]);             // cast dictionary / array as array of entries
        columnLength.push(colValues.length);

        colValues.forEach((value, index, array) => {
            rows[index] = rows[index] || {};
            rows[index][colName] = value[1];
            // console.log('unpackJsonColumns', rows[index]);
        });

    });

    // Checks to see if the columns are the same length
    if ( Math.min(...columnLength) !== Math.max(...columnLength) ){
        console.error('unpackJsonColumns', 'Column Length does not match');
    }

    // console.log('unpackJsonColumns', 'return', rows.length, rows);

    return rows;
}

function getDogData(){
    d3.json('http://127.0.0.1:5000/breed_count_weight_life').then(function (dogData) {
        // var upData = unpackJsonColumns(dogData);
        console.log('dogData', dogData);

        // childColumn = upData.breedname;
        // parentColumn = upData.breedgroup;

        var stratify = d3.stratify()
            .id(d => d.breedname)
            .parentId(d => d.breedgroup);

        vData = stratify(dogData);

        view = "view-license";
        updateViz(vData, view);
    });
};

getDogData();



// fetchJsonDogData();

// $('#view-by .dropdown-item').on('click', function(e){
//     // test debug functions to see what comes into the function
//     console.log('onClick', this, arguments);
//     console.log('onClick2', this.getAttribute('value'));

//     // get the value from the HTML element
//     var view = this.getAttribute('value');

//     // @global vData
//     drawViz(vData, view);
// });

d3.select("#view-by").selectAll('div').selectAll('a')
    .on('click', function (d) {
        // get the value from the HTML element
        view = this.getAttribute('value');

        // test debug functions to see what comes into the function
        console.log("View:" + view);

        // @global vData
        updateViz(vData, view);
        updateText(view);
        insertView(view)

        //take away the text box for breed selection
        svg.selectAll("#details-popup").remove();

    });

function getFilteredData(vData, filter) {
    // filters the metadaa based on the id from the dropdown
    var filteredData;
    if (filter === "Show All") {
        
        filteredData = vData;

    } else {

        filteredData= vData.children.find(({id}) => id === filter);

    }
    // vData.children.filter(function (group) {
    //     return group.children.data.id === filter; // there is an id that is an integer and one is a string
    // });
    console.log("FilteredData: ", filteredData);
    return filteredData;
}

d3.select("#group_filter").selectAll('div').selectAll('a')
.on('click', function (d) {
    // get the value from the HTML element
    var filter = this.getAttribute('value');

    // test debug functions to see what comes into the function
    console.log("Filter:", filter);

    var filteredData = getFilteredData(vData, filter);

    // // @global vData
    updateViz(filteredData, view);
    // updateText(view);
    insertFilterInfo(filter);

    //take away the text box for breed selection
    svg.selectAll("#details-popup").remove();
});

// search
// d3.select("button").on("click", function(d) {
//     //get the input from the search form
//     var textInfo = d3.select("#textInfo").node.input;
//     if (vData.children.find(({id}) => id === textInfo)) {
//        circles.style("fill", "#FF1A6C") 
//     }
    
//     else {
//         console.log("couldn't find what you are looking for")
//     }
// })

function updateViz(vData, view) {
    console.info('updateViz', arguments);
    // Declare d3 layout
    var vLayout = d3.pack().size([vWidth, vHeight]);
    var vRoot;

    // Layout + Data
    // Select view {}
    if (view === "view-life-exp") {
        vRoot = d3.hierarchy(vData).sum(function (d) { return d.data.lifeexpectancy; });
    }
    else if (view === "view-weight") {
        vRoot = d3.hierarchy(vData).sum(function (d) { return d.data.avgweight; });
    }
    else if (view === "view-license") {
        vRoot = d3.hierarchy(vData).sum(function (d) { return d.data.licensecount; });
    } 
    else {
        console.log("View type missing")
    };


    //end
    var vNodes = vRoot.descendants();
    vLayout(vRoot); 
    g.selectAll('circle').remove();
    var vSlices = g.selectAll('circle').data(vNodes).enter().append('circle');

    // Draw on screen
    vSlices.attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr('r', function (d) { return d.r; });

    vSlices.on("click", selectBreedInfo);

}

// circle.on("click", selectBreedInfo);

let format = d3.format(",d")
let current_circle = undefined;

function selectBreedInfo(d) {
    // cleanup previous selected circle
    if (current_circle !== undefined) {
        current_circle.attr("id", "circle");
        svg.selectAll("#details-popup").remove();
    }

    // select the circle
    current_circle = d3.select(this);
    current_circle.attr("id", "selected_circle");

    let textblock = svg.selectAll("#details-popup")
        .data([d])
        .enter()
        .append("g")
        .attr("id", "details-popup")
        .attr("font-size", 16)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "start")
        .attr("transform", d => `translate(10, 20)`);

    textblock.append("text")
        .text(d => d.data.data.breedname + " Breed")
        .attr("font-weight", "bold")
        .attr("y", "16");

    textblock.append("text")
        .text(d => "Licenses Issued: " + d.data.data.licensecount)
        .attr("y", "40");

    textblock.append("text")
        .text(d => "AKC BreedGroup: " + d.data.data.breedgroup)
        .attr("y", "64");

    //   textblock.append("text")
    //     .text(d => "Breed: " + d.data.data.Breed)
    //     .attr("y", "48");

    textblock.append("text")
        .text(d => "Average Weight: " + d.data.data.avgweight.toFixed(2) + " lbs.")
        .attr("y", "88");
    
    textblock.append("text")
        .text(d => "Average Life Span:" + d.data.data.lifeexpectancy.toFixed(2) + " years")
        .attr("y", "110");
}

function updateText(view) {
    // take away the filter text
    d3.select("h4").text("")

    // Select view {}
    if (view === "view-life-exp") {
        // put new header and paragraph here
        d3.selectAll("h2").text("New York Dog Breeds and Life Span");
        d3.select("p")
            .text(" The life span view shows the lack of variability in life span for dogs. There are outliers of course," 
            + "like the Fila Brasiliero Breed with an average life span of 7.5 years and the Chihuahua which has the longest" 
            + "life span with an average life span of 17.5 years. Overall the average life span for a dog is about 12.2 years" 
            + "and the life span for 80% of the breed groups is between 12 - 13.5 years. The similar shape and size of the circles," 
            + "lack of variability, is what makes it interesting.");
    }
    else if (view === "view-weight") {
        // put new header and paragraph here
        d3.selectAll("h2").text("New York Dog Breeds and Weight");
        d3.select("p")
            .text("Viewing weight as the circle radius shows how most breeds and breed"
            + "groups have a similar lifespan.  There is some variability but not as much when compared to license count."
            + "Within each dog breed group there is also a fair amount of variability such as the Working dog group which can weigh" 
            + "as little as 35 pounds and as much as 175 pounds. This view allows a potential buyer to see the average weight of a"
            + "dog breed or dog breed group and make a better decision.");
    }
    else if (view === "view-license") {
        // put new header and paragraph here
        d3.selectAll("h2").text("New York Dog Breeds and Licenses");
        d3.select("p")
            .text("This circle pack chart shows the hierarchy of the dog breeds grouped by AKC dog breed groups with the circle"
            + "radius being driven by the number of licenses in the New York City area. The most interesting, but not surprising"
            + "information, is that the toy group has the largest number of licenses followed by the mixed breed group."
            + "The largest single breed is unknown or mutts where the owner didn’t know the heritage of the dog. Mutts have 10,383 licenses issued." 
            + "More than twice as many as the next highest breed, Yorshire Terrier, with 4,929. Shitzu, Chihuahua, and Maltese are also a large" 
            + "portion of the licenses issued. ");
    } 
    else {
        console.log("View type missing");
    };

}

function insertFilterInfo(filter) {
    d3.select("h4").text("Breed Group Filter: " + filter);
}

function insertView(view) {
    
    // Select view {}
    if (view === "view-life-exp") {
        // put new header and paragraph here
        d3.select("h3").text("View: Life Span");
    }
    else if (view === "view-weight") {
        // put new header and paragraph here
        d3.select("h3").text("View: Weight");
    }
    else if (view === "view-license") {
        // put new header and paragraph here
        d3.select("h3").text("View: Licenses");
    } 
    else {
        console.log("View type missing");
    };

}
