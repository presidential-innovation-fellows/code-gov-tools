$(document).ready(function(){
    $('#githubconversion').on('submit', function(e){
        e.preventDefault();
        var githuburl = $('#input-type-text').val();
        
      convertGitHub(githuburl);
    });
});

function convertGitHub(githuburl)
{
  
  
var body,jsoninventory, record, codegovinventory_start,
      codegovinventory_projects,codegovinventory_updated, codegovinventory, jsonlength,events_url,events_callback;


 $.ajax({
   
   dataType:'jsonp',
   headers: { 'User-Agent': 'request',
      'Accept': 'application/vnd.github.full+json'},
   url: githuburl}).done( function (data){
   
   
   
   
   jsoninventory = data.data;
   
   //console.log("jsoninventory: "+JSON.stringify(jsoninventory));
   //console.log("jsoninventory length: "+jsoninventory.length);
   //console.log("jsoninventory stringify length: "+JSON.stringify(jsoninventory.length));
   jsonlength = jsoninventory.length;
    if (jsoninventory.length==undefined){
   
      
   jsoninventory =[jsoninventory];
      //JSON.stringify(eval('['+data+']'));
      //alert("this is the body: "+JSON.stringify(data.data));
   console.log("whats in the data"+ jsoninventory[0].id);
      console.log('length is undefined');
      
   
      jsonlength = 1;
   //   console.log("converted jsoninventory length: "+jsoninventory.length);
   //console.log(" converted jsoninventory stringify length: "+JSON.stringify(jsoninventory.length));
    }
   
   
    codegovinventory_projects = '';
    codegovinventory_updated='';
    codegovinventory_start = '{ "agency": "TEST","organization":" ","projects":[';
//console.log("length:" +jsoninventory.length+"jsoninventory: "+jsoninventory);
   console.log("id:" +jsoninventory.id);
   console.log("[0].id:" +jsoninventory.id);
    for (var i = 0; i < jsonlength; i++) {
events_url= "https://github.com/"+jsoninventory[i].full_name;
    //var oldlicense=  getpreviouslicense("hhs", jsoninventory[i].repoID);
      
      //eventsGitHub(eventsurl);
      console.log("eventsurl:" +events_url);
      events_callback=eventsGitHub(events_url);
      //console.log("events to return"+EVENTS_TO_RETURN);
      codegovinventory_projects +=
        '{"status":" ", "vcs":"git", "repository": "' + jsoninventory[i].git_url +
        '", "name": "' + (jsoninventory[i].name== null ? "": jsoninventory[i].name) + '", "repoID":"' +
        (jsoninventory[i].id== null ? "": jsoninventory[i].id) + '", "events":'+events_callback + ',"homepage":"' + (jsoninventory[i].homepage== null ? "": jsoninventory[i].homepage) +
        '","downloadURL":" ","description":"' + (jsoninventory[i].description== null ? "": jsoninventory[i].description) +
        ' ",' + '"contact":[{"email":" ","name":"","twitter":"","phone":""}],' +
        '"partners":[{"name":""},{"email":""}],' +
        '"license":"https://path.to/license","openproject":1,' +
        '"govwideReuseproject":0,"closedproject":0,"exemption":"",' +
        ' "projectTags":[';

      //loop through project tags
      if (jsoninventory[i].description != null)

      {
        var tagwords = jsoninventory[i].description;

        //var tags = (tagwords).split(" ");
        var tags = removeStopWords(tagwords);

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
   $("#mappedcontent").append(JSON.parse(JSON.stringify(codegovinventory, null, '\t')));
  
  
 });
  
  

  
      
  

    
  
         
         }
  
  

  
  
     

  
  
  
      
       
    

    

  
  