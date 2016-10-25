$(document).ready(function(){
    $('#eventsfeed').on('submit', function(e){
        e.preventDefault();
        var eventsurl = $('#events-url').val();
        
      eventsGitHub(eventsurl);
    });
});
function eventsGitHub(eventsurl)
{
  
  
var body,jsoninventory, record, eventsfeed_start,
      eventsfeed_projects,eventsfeed_updated, eventsfeed;


 $.ajax({
   
   dataType:'jsonp',
   headers: { 'User-Agent': 'request',
      'Accept': 'application/vnd.github.full+json'},
   url: eventsurl}).done( function (data){
   
   
   
   jsoninventory = data.data;
    if (jsoninventory.length==undefined){
   
   
      jsoninventory = JSON.parse(data.data);
    }
   
    eventsfeed_projects = '';
    eventsfeed_updated='';
    eventsfeed_start = "export const EVENTS = [<br><br>";
console.log("length:" +jsoninventory.length+"jsoninventory: "+jsoninventory);
    for (var i = 0; i < jsoninventory.length; i++) {
console.log(jsoninventory[i].type);
      eventsfeed_projects +=
        "{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: '"+jsoninventory[i].repo.id +"',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: '" + jsoninventory[i].repo.name + "',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type:'" +
        (jsoninventory[i].type).replace("Event","") + "',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user:'" + jsoninventory[i].actor.display_login +
        "',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;time:'" + jsoninventory[i].created_at +"',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

      //loop through type of event
      if (jsoninventory[i].type == "PushEvent")

      {
        
          eventsfeed_projects += "message: '"+jsoninventory[i].payload.commits[0].message+"',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url:'"+jsoninventory[i].payload.commits[0].url+"'";


       
      }
      else if (jsoninventory[i].type == "PullRequestEvent")

      {
        console.log(jsoninventory[i].payload.pull_request.title);
          eventsfeed_projects += "message: '"+jsoninventory[i].payload.pull_request.title+"',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url:'"+jsoninventory[i].payload.pull_request.url+"'";


       
      }
      else if (jsoninventory[i].type == "IssueCommentEvent")

      {
        
          eventsfeed_projects += "message: '"+jsoninventory[i].payload.issue.title+"',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url:'"+jsoninventory[i].payload.issue.url+"'";


       
      }
eventsfeed_projects += "<br>}";
      
        if (i + 1 < jsoninventory.length) {
        eventsfeed_projects += ',';
      }
    }
      
      

     

    

    eventsfeed = eventsfeed_start + eventsfeed_projects + '];';
   $("#eventscontent").append(JSON.parse(JSON.stringify(eventsfeed, null, '\t')));
  
  
 });
  
  

  
      
  

    
  
         
         }
  
  

  
  
     

  
  
  
      
       
    

    

  
  