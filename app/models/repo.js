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
          pjctURL: String,
          pjctName: String,
          pjctDescrption: {type: String, es_indexed:true},
          pjctTags: [String],
          codeLanguage: {type: String, es_indexed:true},
          lastUpdatedDate: { type: Date, default: Date.now },
          
          POCemail: String,
          license: {type: String, es_indexed:true},
          openPjct: Boolean,
          govwideReusePjct:  Boolean,
          closedPjct: Boolean,
          exemption: String
        }
      ]
          
    },{strict:false}); //only parameters that are specified here should be saved to DB
    
RepoSchema.plugin(mongoosastic, {hosts: [
    'localhost:9200'
  ]})

;  

module.exports = mongoose.model('Repo', RepoSchema);



