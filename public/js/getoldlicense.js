function getpreviouslicense(agency, repoID){
  var repoURL = "https://fakeagency.apps.cloud.gov/fake"+agency+".json";
  var currentJSON,newJSON,license,tags;
  var request = new XMLHttpRequest();
request.open('GET', repoURL, false);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
  } else {
    // We reached our target server, but it returned an error

  }
  currentJSON=data;
  
  for (var i=0; i< currentJSON.projects.length; i++)
    {
      var project = currentJSON.projects[i];
      if (project.repoID==repoID)
        {
          alert("project found: "+project.name);
          alert("oldlicense: "+project.license);
          license = project.license;
        }
    }
};
  request.onerror = function() {
  // There was a connection error of some sort
};

request.send();

  console.log(license);

  return license;
  
}