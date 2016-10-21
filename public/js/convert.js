$(document).ready(function(){
    $('#githubconversion').on('submit', function(e){
        e.preventDefault();
        var githuburl = $('#input-type-text').val();
        alert ("what's going on here"+githuburl);
      convertGitHub(githuburl);
    });
});
function convertGitHub(githuburl)
{
  alert(githuburl);
  
var body,jsoninventory, record, codegovinventory_start,
      codegovinventory_projects,codegovinventory_updated, codegovinventory;


 $.ajax({
   
   dataType:'jsonp',
   headers: { 'User-Agent': 'request',
      'Accept': 'application/vnd.github.full+json'},
   url: githuburl}).done( function (data){
   
   
   //$("#mappedcontent").append(JSON.stringify(data.data));
  
   //jsoninventory = JSON.parse(data);
   jsoninventory = data.data;
    if (jsoninventory.length==undefined){
      //body = JSON.stringify(eval('['+data+']'));
      alert("this is the body: "+JSON.stringify(data.data));
      jsoninventory = JSON.parse(data.data);
    }
   alert("length of repos: " +jsoninventory.length);
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
  
  

  
  
     

  
  
  
      
       
    

    

  
  