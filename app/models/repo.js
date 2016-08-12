var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RepoSchema   = new Schema({
    //_id : Schema.ObjectId,
    _comment: String,
    type: String,
    required: {
      agencyname: String,
      tags: [String],
      openPjcts: Number,
      govwideReUsePjcts: Number,
      closedPjcts: Number  
              },
    properties: {
      openPjcts:
    
        [
          {
          type: Schema.Types.Mixed,
          pjctURL: String,
          pjctName: String,
          repoPath: String,
          repoName: String,
          repoID: Number,
          pjctDescrption: String,
          codeLanguage: String,
          lastUpdatedDate: { type: Date, default: Date.now },
          POCname: String,
          POCemail: String,
          license: String
        }
      ]
      ,
      govwideReUsePjcts:
      
        [{
          type: Schema.Types.Mixed,
          pjctURL: String,
          pjctName: String,
          repoPath: String,
          repoName: String,
          repoID:Number,
          pjctDescrption: String,
          codeLanguage: String,
          lastUpdatedDate: { type: Date, default: Date.now },
          POCname: String,
          POCemail: String,
          license: String
        }]
    ,
      closedPjcts:
      
        [{
          type: Schema.Types.Mixed,
          pjctURL: String,
          pjctName: String,
          repoPath: String,
          repoName: String,
          repoID:Number,
          pjctDescrption: String,
          codeLanguage: String,
          lastUpdatedDate: { type: Date, default: Date.now },
          POCname: String,
          POCemail: String,
          license: String
        }]
      
         
    }
    },{strict:false}); //only parameters that are specified here should be saved to DB
    


module.exports = mongoose.model('Repo', RepoSchema);

