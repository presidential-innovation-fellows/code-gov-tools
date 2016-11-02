function getlicense(gitrepository){
  var repositorypath;
var license_array = new Array();
  
  eventsurl = gitrepository.replace("git://github.com/","https://api.github.com");
  eventsurl = eventsurl.replace(".git","/events");
  
  license_array[0]= repository_path+"/blob/master/LICENSE";
  
  license_array[1] = repository_path+"/blob/master/LICENSE";
  license_array[2] = repository_path+"/blob/master/LICENSE.TXT";
  license_array[3] = repository_path+"/blob/master/LICENSE.MD";
  
  for (var i = 0; i < license_array.length; i++) {
    request(license_array[i], function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    
    return(body);
    
  }
})
  }
}