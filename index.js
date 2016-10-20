/*
  TODOS/RECS:
    * should probably use mongoose
    * clean up string concatenation (can build json, then toString())
    * pull out tools into separate project
    * tests
    * lint/githook rules
    * use a logger
    * remove hardcoded vars and use env variables (or config) instead
*/

var express           = require("express");
var request           = require("request");
var path              = require("path");
var MongoClient       = require("mongodb").MongoClient;
var bodyParser        = require("body-parser");
var pug               = require("pug");
var dotenv            = require("dotenv");

var stopwords         = require("./utils/stopwords");
var agencyEndpoints   = require("./agency_endpoints.json");
var repo              = require("./models/repo.js");

// load the mongo `repo` model and synchronize it
var stream = repo.synchronize();

// load environment vars
 dotenv.load();
// NOTE: loads the mongo uri from the env variable MONGOURI
//       make sure your env has the right uri in the form of
//       mongodb://username:password@host:port/testdatabase
var mongoDetails = process.env.MONGOURI;

// define and configure express
var app = express();
var port = process.env.PORT || 3002;
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 2);


/* ------------------------------------------------------------------ *
                            TOOL ROUTES
 * ------------------------------------------------------------------ */

app.get('/', function(req, res) {
  console.log("mongodetails is: "+mongoDetails);
  MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: " + err);

      return console.error(err);

    } else {
      repos = db.collection("repos");
      console.log(" We're connected to the DB");

      repos.find({
        agency: {
          $exists: true
        }
      }).toArray(function(err, repodocs) {
        if (err) {
          return console.error(err);
        } else {

          res.render('index.pug', {
            repos: repodocs
          });
        }
      });
    }
  });
});

app.get('/harvest', function(req, res) {
  var body;
  var message = '';

  MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: " + err);

      return console.error(err);

    } else {
      repos = db.collection("repos");
      console.log("We're connected to the DB");
      message += "We've connected to the database<br>";


      // grab code.json files from various agencies.
      // SWITCH FROM DEVURL to PRODURL for production
      // TODO: should do this based upon env (not hardcoded)
      // =============================================================================
      console.log("length of agencyEndpoints: " + agencyEndpoints.length);
      var key, value;

      for (key = 1; key < agencyEndpoints.length; key++) {
        value = agencyEndpoints[key];
        console.log("Dev URL for " + value.ACRONYM + " is " + value.DEVURL);
        message += "Loading JSON data from " + value.ACRONYM + " located at " + value.DEVURL + "<br>";

        request(value.DEVURL, function(error, response, body) {
          if (error) {
            console.log(error)
          } else {
            console.log(value.DEVURL + '\n');
            repos.update({
              agency: {
                $eq: value.ACRONYM
              }
            }, JSON.parse(body), {
              upsert: true
            });
            console.log(value.ACRONYM + '\n');
            //repos.update({$and: [{agency: {$eq:value.ACRONYM}}, {agencyAcronym:{$exists:false}}]}, JSON.parse(body), {upsert:true});
            //repos.insert(body);
          }
        });
      }

      repos.remove({
        "agencyAcronym": {
          $exists: true
        }
      });

      repos.remove({
        agencyAcronym: {
          $exists: true
        }
      });

      message += "<br> JSON harvesting complete";
      res.send(message);
    }
  });
});

app.get('/convert', function(req, res) {
  res.render('convert.pug')
});
app.get('/build', function(req, res) {
  res.render('build.pug')
});

app.post('/', function(req, res) {
  var searchterm, searchquery;

  MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: " + err);

      return console.error(err);

    } else {
      repos = db.collection("repos");
      searchterm = req.body.search;
      console.log(" We're connected to the DB");

      if ((searchterm.trim()).length > 1) {
        console.log("search term is: " + searchterm);
        searchquery = '{$elemMatch:{tag:searchterm}}';
        //repos.find({projects:{$elemMatch:{"pjctTags.tag":searchterm}}}, {'projects.$':1}).toArray(function(err, repodocs) {
        repos.find({
          projects: {
            $elemMatch: {
              "projectTags.tag": searchterm
            }
          }
        }, {
          'projects.$': 1,
          agency: 1
        }).toArray(function(err, repodocs) {
          if (err) {
            return console.error(err);
          } else {
            res.render('index.pug', {
              repos: repodocs
            });
          }
        });
      } else {
        searchquery = '{$exists:true}';
        console.log('empty');
        repos.find({
          "projects.projectTags": {
            $exists: true
          }
        }).toArray(function(err, repodocs) {
          if (err) {
            return console.error(err);
          } else {

            res.render('index.pug', {
              repos: repodocs
            });
          }
        });
      }
    }
  });
});

app.post('/convert', function(req, res) {
  var jsoninventory, record, codegovinventory_start,
      codegovinventory_projects,codegovinventory_updated, codegovinventory;

  var options = {
    url: req.body.jsonurl,
    headers: {
      'User-Agent': 'request',
      'Accept': 'application/vnd.github.full+json'
    }
  };

  request(options, function(error, response, body) {
    jsoninventory = JSON.parse(body);
    
    if (jsoninventory.length==undefined){
      body = JSON.stringify(eval('['+body+']'));
      console.log("this is the body: "+body);
      jsoninventory = JSON.parse(body);
    }
    codegovinventory_projects = '';
    codegovinventory_updated='';
    codegovinventory_start = '{ "agency": "TEST","status":"code.gov schema 1.0","projects":[';
console.log("length:" +jsoninventory.length+"jsoninventory: "+jsoninventory);
    for (var i = 0; i < jsoninventory.length; i++) {

      codegovinventory_projects +=
        '{"vcs":"git", "repository": "' + jsoninventory[i].git_url +
        '", "name": "' + jsoninventory[i].name + '", "repoID":"' +
        jsoninventory[i].id + '","homepage":"' + jsoninventory[i].homepage +
        '","downloadURL":" ","description":"' + jsoninventory[i].description +
        ' ",' + '"contact":[{"email":" ","name":" ","twitter":" ","phone":" "}],' +
        '"partners":[{"name":" "},{"email":" "}],' +
        '"license":"https://path.to/license","openproject":1,' +
        '"govwideReuseproject":0,"closedproject":0,"exemption":null,' +
        ' "projectTags":[';

      //loop through project tags
      if (jsoninventory[i].description != null)

      {
        var tagwords = jsoninventory[i].description;

        //var tags = (tagwords).split(" ");
        var tags = stopwords.remove(tagwords);

        for (var k = 0; k < tags.length; k++) {
          if ((tags[k] == null || tags[k] == ''|| 0 === tags[k].length) && ((k + 1) != tags.length)) {
            continue;
          }
          codegovinventory_projects += '{"tag":"' + tags[k] + '"}';

          if (k + 1 < tags.length) {
            codegovinventory_projects += ',';
          }
        }
      }
      codegovinventory_projects += ']'; //end tags
      //end tag section

      //start language section:
      codegovinventory_projects += ',"codeLanguage":[';


      if (jsoninventory[i].language != null) {
        var language = jsoninventory[i].language;


        codegovinventory_projects += '{"language":"' + language + '"}';



      }
      codegovinventory_projects += '],'; //end languages
      
      //start updated section
      codegovinventory_updated='"updated":{"lastCommit": "'+jsoninventory[i].updated_at+'","metadataLastUpdated":"'+jsoninventory[i].created_at+'","lastModified":"'+jsoninventory[i].pushed_at+'"}}' ;
      codegovinventory_projects+=codegovinventory_updated;
      //end updated section
      
      if (i + 1 < jsoninventory.length) {
        codegovinventory_projects += ',';
      }
      //end language section
      
      
    }

    codegovinventory = codegovinventory_start + codegovinventory_projects + ']}';


    //console.log(prettyjson.render(codegovinventory, options));

    //res.send( prettyjson.render(codegovinventory, options));
    res.send(codegovinventory);


  });
});


/* ------------------------------------------------------------------ *
                            SERVER
 * ------------------------------------------------------------------ */

// start the server
app.listen(port);
console.log('Listening on port ' + port);
