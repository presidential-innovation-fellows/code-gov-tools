$.getJSON("../schema.json", function(json) {
$("#form").alpaca({
    "schema": json,
    "options": {
      "form": {
        "buttons": {
          "submit": {
            "title": "Add project",
            "click": function () {
              // the Alpaca library doesn't seem to be able to handle multiple groups of fields,
              // for example, the `projects` array being full of objects doesn't seem to work within
              // alpaca. I made it so that we marry the existing and new JSON object strings to create
              // a JSON file with multiple projects. this was my single-day solution, I'd prefer to 
              // extend Alpaca or at least cache the actual JSON for joining with the new JSON.
              var val = this.getValue(),
                projects = val.projects;
              val.projects = [];
              val.projects.push(projects);
              if (this.isValid(true)) {
                if ($("#results").html() !== "") {
                  var results = JSON.stringify(val, null, "  "),
                      existingJSON = $("#results").html().slice(0, -9) + "  },";
                  $("#results").html(existingJSON);
                  results = results.substring(results.indexOf("[") + 1);
                  $("#results").append(results);
                  $("#download_link").attr({
                    'href': 'data:text/json;charset=utf-8,' + encodeURIComponent($('#results').text()),
                    'target': '_blank',
                    'download': 'code.json'                          
                  });
                }
                else {
                  var results = JSON.stringify(val, null, "  ");
                  $("#results").append(results);
                  $("#download").removeAttr('disabled');
                  $("#download_link").attr({
                    'href': 'data:text/json;charset=utf-8,' + encodeURIComponent(results),
                    'target': '_blank',
                    'download': 'code.json'                          
                  });
                }                    
              }
            }
          }
        }
      }
    }
  });
});
