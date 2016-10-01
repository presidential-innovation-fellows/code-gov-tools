// codegovapi.js

// BASE SETUP
// =============================================================================

var express    = require('express');        // call express

var MongoClient = require('mongodb').MongoClient;
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Repo     = require('./app/models/repo.js');
var stream = Repo.synchronize();
var count = 0;
var request = require('request'); //Load the request module

 

var path = require("path");
var pug = require('pug');
require('dotenv').load();


var mongoDetails = process.env.MONGOURI;


/*
//elastic search mapping
Repo.createMapping(function(err, mapping){  
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  }else{
    console.log('mapping created!');
    console.log(mapping);
  }
});
*/


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 2);

var port = process.env.PORT || 3001;        // set port here because I'm using 3000 for something else


function removestopwords(phrase) {
        var common = getStopWords();
        //var wordArr = phrase.match(/\w+/g),
        var wordArr = phrase.split(/(?=\w)\b|\W/),
            commonObj = {},
            uncommonArr = [],
            word, i;

        for (i = 0; i < common.length; i++) {
            commonObj[ common[i].trim() ] = true;
        }

        for (i = 0; i < wordArr.length; i++) {
            word = wordArr[i].trim().toLowerCase();
            if (!commonObj[word]) {
                uncommonArr.push(word);
            }
        }
        return uncommonArr;
    }

    function getStopWords() {
        return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
    }
// READ IN JSON FILE WITH AGENCY ENDPOINTS
// =============================================================================

var AgencyObj = require("./agency_endpoint.json");
console.log("Details of number 7: "+AgencyObj[6].NUM+" AND "+AgencyObj[6].ACRONYM+" AND "+AgencyObj[6].DEVURL);


// =============================================================================
app.get('/', function(req, res) {

  var body,responsedata1, responsedata2, responsedata3;
  //build the home page
 
        
  
  MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: "+err);
      
      return console.error(err);
      
    } else {
       repos = db.collection("repos");
      console.log(" We're connected to the DB");  
      
      
// grab code.json files from various agencies.
// =============================================================================
console.log("length of AgencyObj: "+AgencyObj.length);   
      var key,value;
      
for(i=1; i < AgencyObj.length; i++) {
  
    value=AgencyObj[i];
    
    console.log("Dev URL for "+value.ACRONYM+ " is "+value.DEVURL);
    
    
  
  request(value.DEVURL, function (error, response, body) {
    
    
    
    repos.update({agency: value.ACRONYM}, JSON.parse(body), {upsert:false});
    //repos.insert(body);
    
  });

    
} //end for loop
       
    
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
      
      if ((searchterm.trim()).length>1)
        {
          console.log("search term is: "+searchterm);
          searchquery='{$elemMatch:{tag:searchterm}}';
          //repos.find({projects:{$elemMatch:{"pjctTags.tag":searchterm}}}, {'projects.$':1}).toArray(function(err, repodocs) {
          repos.find({projects:{$elemMatch:{"projectTags.tag":searchterm}}}, {'projects.$':1, agency:1}).toArray(function(err, repodocs) {
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
          repos.find({"projects.projectTags":{$exists:true}}).toArray(function(err, repodocs) {
        if (err) {
            return console.error(err);
        } else {
          
            res.render('index.pug', {
                repos:repodocs
            });
        }
    })//close repos.find
    }
          
        
      }
  

        
    }); //close MongoDB connection

}); //close app.post(/)

app.post('/convert', function(req, res) {

var jsoninventory, record,codegovinventory_start, codegovinventory_projects, codegovinventory;

   

var options = {
  
  url: req.body.jsonurl,
  headers: {'User-Agent':'request', 'Accept': 'application/vnd.github.full+json'}
};  
  request(options, function (error, response, body) {
    
    
     jsoninventory = JSON.parse(body);
    codegovinventory_projects='';
    codegovinventory_start = '{ "agency": "TEST","status":"Alpha","projects":[';
    
    for(var i=0; i < jsoninventory.length; i++) {
    
      codegovinventory_projects+=
      '{"vcs":"git", "repository": "'+jsoninventory[i].git_url+'", "name": "'+jsoninventory[i].name+'", "repoID":"'+ jsoninventory[i].id +'","homepage":"'+jsoninventory[i].homepage+'","downloadURL":" ","description":"'+jsoninventory[i].description+' ",'+'"contact":[{"email":" ","name":" ","twitter":" ","phone":" "}],"partners":[{"name":" "},{"email":" "}],"license":"https://path.to/license","openproject":1,"govwideReuseproject":0,"closedproject":0,"exemption":null,' +' "projectTags":[';
      
      //loop through project tags
      if(jsoninventory[i].description!=null)
        
      { var tagwords = jsoninventory[i].description;
       
       
        //var tags = (tagwords).split(" ");
       var tags = removestopwords(tagwords);
      
      for(var k=0; k < tags.length; k++) {
        if((tags[k]==null || tags[k]=='') && ((k+1)!=tags.length)) { continue;}
        codegovinventory_projects+='{"tag":"'+tags[k]+'"}';
      
        if(k+1<tags.length)
        {
          codegovinventory_projects+=',';
        }
      }
      }
      codegovinventory_projects+=']'; //end tags
      //end tag section
   
      
      //start language section:
      codegovinventory_projects+=',"codeLanguage":[';
      
      
       if(jsoninventory[i].language!=null)
      {var language = jsoninventory[i].language;
      
      
        codegovinventory_projects+='{"language":"'+language+'"}';
      
    
      
      }
      codegovinventory_projects+=']}'; //end languages
      
      if(i+1<jsoninventory.length)
        {
          codegovinventory_projects+=',';
        }
      //end language section
    }
    
     codegovinventory = codegovinventory_start + codegovinventory_projects+']}';
    

    //console.log(prettyjson.render(codegovinventory, options));
    
    //res.send( prettyjson.render(codegovinventory, options));
    res.send(codegovinventory);
    
    
  }); 
      }); //close app.post(validate)




// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router




// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Hey, someone is using this!');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:[portnum]/api)
router.get('/', function(req, res) {
  //res.json({ message: 'This is the Code.gov API' });  
  res.send("<html><h1>Welcome to the Code.gov API</h1><br><br> <h2>ENDPOINTS</h2>: <ul> <li> /api/repos  --list all federal agency repos</li> <li> /api/repos/agency  --list repos for specific agency</li></ul><br><hr> <h2>AGENCY ACRONYMS:</h2><ul> <li>Department of Agriculture: 	<em>USDA</em></li><li>Department of Commerce:	<em>DOC</em></li><li>Department of Defense:	<em>DOD</em></li><li>Department of Education:	<em>ED</em></li><li>Department of Energy:	<em>DOE</em></li><li>Department of Health and Human Services:	<em>HHS</em></li><li>Department of Housing and Urban Development:	<em>HUD</em></li><li>Department of Interior:<em>	DOI</em></li><li>Department of Justice:<em>	DOJ</em></li><li>Department of Labor:<em>	DOL</em></li><li>Department of State:<em>	DOS</em></li><li>Department of Transportation:<em>	DOT</em></li><li>Department of Treasury:<em>	TRE</em></li><li>Department of Veterans Affairs:	<em>VA</em></li><li>Environmental Protection Agency	:<em>EPA</em></li><li>National Aeronautics and Space Administration:	<em>NASA</em></li><li>Agency for International Development:	<em>AID</em></li><li>Federal Emergency Management Agency:	<em>FEMA</em></li><li>General Services Administration: 	<em>GSA</em></li><li>National Science Foundation	: NSF</em></li><li>Nuclear Regulatory Commission:	<em>NRC</em></li><li>Office of Personnel Management:	<em>OPM</em></li><li>Small Business Administration:	<em>SBA</em></li> </ul> </html>");
    

});

// more routes for our API will happen here

// on routes that end in /states/:state_id
router.route('/repos')

  

// get all the repos (accessed at GET http://localhost:8080/api/repo)
    .get(function(req, res) {
  

  //open MongoDB connection
MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: "+err);
      
      return console.error(err);
      
    } else {
       repos = db.collection("repos");
      console.log(" We're connected to the DB");  
         
      repos.find().toArray(function(err, repodocs) {
            if (err)
            {res.send(err);}
          else{

            res.json(repodocs);
          }
        }); 
    
      }
  }); 
//close MongoDB connection
        
    });

// ----------------------------------------------------
router.route('/repos/:agency')

    // get the repo with that id (accessed at GET http://localhost:8080/api/repos/:agency)
    .get(function(req, res) {
  

  
  
  
   //open MongoDB connection
MongoClient.connect(mongoDetails, function(err, db) {
    if (err) {
      res.send("Sorry, there was a problem with the database: "+err);
      
      return console.error(err);
      
    } else {
       repos = db.collection("repos");
      console.log(" We're connected to the DB");  
         
      repos.find({agency: req.params.agency}).toArray(function(err, repodoc) {
            if (err)
            {res.send(err);}
          else{

            res.json(repodoc);
          }
        }); 
    
      }
  }); 
//close MongoDB connection
  
  
  
  
  
  
    })
    
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Listening on port ' + port);