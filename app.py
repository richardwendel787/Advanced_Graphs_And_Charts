#https://flask.palletsprojects.com/en/1.1.x/quickstart/
"""
Variable Rules

You can add variable sections to a URL by marking sections with <variable_name>.
 Your function then receives the <variable_name> as a keyword argument. 
 Optionally, you can use a converter to specify the type of the argument 
 like <converter:variable_name>.

from markupsafe import escape

@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % escape(username)

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return 'Post %d' % post_id

@app.route('/path/<path:subpath>')
def show_subpath(subpath):
    # show the subpath after /path/
    return 'Subpath %s' % escape(subpath)



"""

#flask will start a web server and as people requeqst a resource, flask fulfills the request
#it is handled in this fashion:
#  client:  I want www.website.com/somefile.html
#    flask:  I have /somefile.html, here you go
#  OR
#  client: I want www.website.com/notafile.html
#    flask:  404 file not found
#  OR 
#  client: I want www.website.com/notafile.html
#    flask:  I dont have that file, but if you request /notafile.html I am supposed to give you index.html
#  
#  IN GENERAL:
#  you define what is called a 'route' within flask
#  When a client requests something matching that route
#  Flask runs a predefined procedure and returns to the client the result
print("running app")
from flask import Flask, Response
import os
ROOT_DIR=os.curdir
app=Flask(__name__)
app.config.from_object(__name__)
FOUR_OH_FOUR="/404.html"


#this function always returns the path where the flask app is running
def GetRootDir():
    return os.path.abspath(os.path.dirname(__file__))

#input is in format of 
# "./somefile.txt"
# "somefile.txt"
# "/directory/domefile.txt"
def GetStaticFile(fname):#this is jacked do not use yet without testing and debugging
    fullPath=os.path.join(GetRootDir(),fname)
    if not os.path.exists(fullPath):
        fullPath=FOUR_OH_FOUR
    return open(fullPath,"r").read()
@app.route("/homepage.html")
def HomepageIndex():
    return GetStaticFile("homepage.html")


@app.route("/index.html")
def Index():
    return GetStaticFile("homepage.html")

@app.route("/")
def RerouteToIndex():
    return Index()


@app.errorhandler(404)
def Fourohfour(e):
    return "This is not a file"

#route to viz 4
#@app.route("/visualizations/viz4.html")
#def give_viz4():
#    return GetStaticFile("/visualizations/viz4.html")

#@app.route("/visualizations/viz<n>.html")
#def give_viz_n(n):
#    try:
#        n=int(n)
#        if n in [1,2,3,4]:
#            return GetStaticFile("/visualizations/viz"+str(n)+".html")
#    except:
#        pass
#    return Fourohfour(n)


#or, even better
@app.route("/visualization/viz<int:n>.html")
def give_viz_n(n):
    if n in [1,2,3,4]:
        return open("visualization/viz"+str(n)+".html").read()
    return "This did not work"
            