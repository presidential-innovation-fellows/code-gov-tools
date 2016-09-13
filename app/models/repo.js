var mongoose     = require('mongoose'),
    
    mongoosastic = require('mongoosastic');
var Schema       = mongoose.Schema;

var RepoSchema   = new Schema({
    //_id : Schema.ObjectId,
    
    
    
      agencyAcronym: String,
      
      projects:
    
        [
          {
          
          vcs: String,
          repoPath: String,
          repoName: String,
          repoID: Number,
          projectURL: String,
          projectName: String,
          projectDescrption: {type: String, es_indexed:true},
          projectTags: [String],
          codeLanguage: {type: [String], es_indexed:true},
          Updated: { 
            
            type: [Date], default: Date.now 
          
          },
          
          POCemail: String,
          license: {type: [String], es_indexed:true},
          openproject: Boolean,
          govwideReuseproject:  Boolean,
          closedproject: Boolean,
          exemption: String
        }
      ]
          
    },{strict:false}); //only parameters that are specified here should be saved to DB
    
RepoSchema.plugin(mongoosastic, {hosts: [
    'localhost:9200'
  ]})

;  

module.exports = mongoose.model('Repo', RepoSchema);



