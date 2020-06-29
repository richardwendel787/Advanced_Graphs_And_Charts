import os, sys
from csv import reader

"""
https://www.w3schools.com/html/html_tables.asp
<html>
 <table style="width:100%">
  <tr>
    <th>Firstname</th>
    <th>Lastname</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>Jill</td>
    <td>Smith</td>
    <td>50</td>
  </tr>
  <tr>
    <td>Eve</td>
    <td>Jackson</td>
    <td>94</td>
  </tr>
</table>
</html>

"""


os.chdir(r"C:\Users\Owner\Desktop\dog_visualizations\instructions\resources")
with open("borough_count.csv","r") as f:
    data = [row for row in reader(f)]

header=data.pop(0)

#Takes an input of an array of strings
#outputs a snippit of html code usable for table rows
def MakeTableRow(entries):
    out="<tr>\n"
    for item in entries:
        out+="\t<td>%s</td>\n"%item
    out+="</tr>\n"
    return out

def MakeTableHeader(headers):
    out="<tr>\n"
    for header in headers:
        out+="\t<th>%s</th>\n"%header
    out+="</tr>\n"
    return out


def MakeBootstrapTableWithHTML(headers,values):
    out="<html><head>"
    out+='<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'
    out+="</head>\n<body>\n"
    out+='<div class="container">'
    out+='<table class="table table-bordered">'
    out+='<thead>'
    out+=MakeTableHeader(headers)
    out+='</thead><tbody>'
    for row in values:
        out+=MakeTableRow(row)
    out+="</tbody></table></div></body></html>"
    return out


#Will only generate the contents between the <thead> and <tbody> tags
def MakeBootstrapTableOnly(headers,values):
    out='<thead>'
    out+=MakeTableHeader(headers)
    out+='</thead><tbody>'
    for row in values:
        out+=MakeTableRow(row)
    out+="</tbody>"
    return out

print(MakeBootstrapTableOnly(header,data))

#HTMLTable=MakeBootstrapTable(header,data)
#with open("CSVAsHTMLTable.html","w") as f:
#   f.write(HTMLTable)
    
