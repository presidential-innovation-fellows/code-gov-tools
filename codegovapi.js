// codegovapi.js

// BASE SETUP
// =============================================================================

var express    = require('express');        // call express
var MongoClient = require('mongodb').MongoClient;
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Repo     = require('./app/models/repo.js');
var request = require('request'); //Load the request module

var path = require("path");
var pug = require('pug');
require('dotenv').load();


var mongouser = process.env.MONGOUSER;
var mongopass = process.env.MONGOPASS;

var mongoDetails = 'mongodb://'+mongouser+':'+mongopass+'@ds023530.mlab.com:23530/testapidemo';


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var port = process.env.PORT || 3001;        // set port here because I'm using 3000 for something else

// grab code.json files from various agencies.
// =============================================================================


     

// =============================================================================
app.get('/', function(req, res) {

  var body,responsedata1, responsedata2, responsedata3;
  //build the home page
  
  request(
    {url: "https://fakeagency1.apps.cloud.gov/code.json", //URL to hit
     qs: {key: "123"}},
     function(error, response, body){
    if(error) {
        console.log("couldn't get the code.json file: "+error);
        
      
    } else {
        
        console.log("OK");        
         responsedata1 = JSON.parse(body);
      //responsedata = body;
      console.log(responsedata1);
      //this is where I'd write some code to validate the JSON file
      //but I haven't done that yet
      
    
    }
     });   
 /* Request #2 */
  request(
    {url: "https://fakeagency2.apps.cloud.gov/code.json", //URL to hit
     qs: {key: "123"}},
     function(error, response, body){
    if(error) {
        console.log("couldn't get the code.json file: "+error);
        
      
    } else {
        
        console.log("OK");        
         responsedata2 = JSON.parse(body);
      //responsedata = body;
      console.log(responsedata2);
      //this is where I'd write some code to validate the JSON file
      //but I haven't done that yet
      
    
    }
     });   
  /* Request #3 */
  request(
    {url: "https://fakeagency3.apps.cloud.gov/code.json", //URL to hit
     qs: {key: "123"}},
     function(error, response, body){
    if(error) {
        console.log("couldn't get the code.json file: "+error);
        
      
    } else {
        
        console.log("OK");        
         responsedata3 = JSON.parse(body);
      //responsedata = body;
      console.log(responsedata3);
      //this is where I'd write some code to validate the JSON file
      //but I haven't done that yet
      
    
    }
     });   
        
  
  MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: "+err);
      
      return console.error(err);
      
    } else {
       repos = db.collection("repos");
      
      
        console.log(" We're connected to the DB");
      //console.log(responsedata.required.agencyname);
        
      //repos.insert(responsedata, {w:1});
      console.log("blah");
      repos.update({"required.agencyname":responsedata1.required.agencyname}, responsedata1, {upsert:true});
      console.log("blah1");
      repos.update({"required.agencyname":responsedata2.required.agencyname}, responsedata2, {upsert:true});
      console.log("blah2");
      repos.update({"required.agencyname":responsedata3.required.agencyname}, responsedata3, {upsert:true});
    console.log("blah3");
  repos.find().toArray(function(err, repodocs) {
        if (err) {
            return console.error(err);
        } else {
          
            res.render('index.pug', {
                repos:repodocs
            });
        }
    })
  }
  }); //close MongoDB connection*/ 
}); //close app.get(/)
  
  




app.post('/', function(req, res) {
var searchterm, searchquery;
   MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: "+err);
      
      return console.error(err);
      
    } else {
       repos = db.collection("repos");
        searchterm = req.body.search;
        console.log(" We're connected to the DB");
      console.log("search term is: "+searchterm);
      if (searchterm.trim())
        {
          searchquery='{$elemMatch:{tag:searchterm}}';
            repos.find({"required.tags":{$elemMatch:{tag:searchterm}}}).toArray(function(err, repodocs) {
        if (err) {
            return console.error(err);
        } else {
          
            res.render('index.pug', {
                repos:repodocs
            });
        }
    }); //close repos.find
        }
      else {
        searchquery='{$exists:true}';
        console.log('empty');
          repos.find({"required.tags":{$exists:true}}).toArray(function(err, repodocs) {
        if (err) {
            return console.error(err);
        } else {
          
            res.render('index.pug', {
                repos:repodocs
            });
        }
    }); //close repos.find
      }
  

        }
    }); //close MongoDB connection

}); //close app.post(/)

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Aww snap.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:[portnum]/api)
router.get('/', function(req, res) {
    res.json({ message: 'This is the Code.gov API' });
    //res.sendFile('index.pug', {root:__dirname});

});

// more routes for our API will happen here

// on routes that end in /states/:state_id
router.route('/repos')

  
    .post(function(req, res) {

        var repo = new Repo((req.body));      // create a new instance of the state model

      /*repo._comment:req.body._comment,
      repo.type: req.body.type,
      repo.required.openPjcts: req.body.required.openPjcts,
      repo.required.govwideReUsePjcts: req.body.required.govwideReUsePjcts,
      repo.required.closedPjcts: req.body.required.closedPjcts,
      repo.properties.openPjcts
  */

        // save the repo and check for errors
        repo.save(function(err) {
            if (err)
                res.send(err);
            else{
            res.json({ message: 'repo created!' });
            }
        });

    })   // get all the repos (accessed at GET http://localhost:8080/api/repo)
    .get(function(req, res) {
        Repo.find(function(err, repos) {
            if (err)
                res.send(err);

            res.json(repos);
        });
    });

// ----------------------------------------------------
router.route('/repos/:repo_id')

    // get the repo with that id (accessed at GET http://localhost:8080/api/repos/:repo_id)
    .get(function(req, res) {
        Repo.findById(req.params.repo_id, function(err, repo) {
            if (err)
                res.send(err);
            res.json(repo);
        });
    })
    .put(function(req, res) {

        // use our repo model to find the repo we want
        Repo.findById(req.params.repo_id, function(err, repo) {

            if (err)
                res.send('Error: '+err);

            repo = req.body

            // save the state
            repo.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'repo updated!' });
            });

        });
    })
 .delete(function(req, res) {
        Repo.remove({
            _id: req.params.repo_id
        }, function(err, repo) {
            if (err)
                res.send(err);

            res.json({ message: 'Repo successfully deleted' });
        });
    });


// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);