var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;

/* Count vote and update totals
 * 
 */
router.post('/vote', function(req, res, next){
  var db = req.db;
  var votes = db.get('votecollection');
  var polls = db.get('pollcollection');

  //Allow one vote per ip
  votes.find({ "ip" : req.ip, "poll_id" : req.body.poll_id }, {}, function (e,result) {
    
    //return already voted message
    if (result.length  != 0){
      res.status(404);
    } else {
      
      //tally vote for the poll
      polls.update(
        { "_id" : ObjectId(req.body.poll_id) , "answers.answer" : req.body.vote},
        { $inc : { "answers.$.vote" : 1 } }, 
        { upsert : true }    
      );

      //create vote for ip
      if (db.getLastErrorObj().n > 0){
        votes.insert({
          "date" : new Date(),
          "poll_id" : req.body.poll_id,
          "answer" : req.body.vote,
          "ip" : req.ip
        });
        
        //send back poll stats
        polls.findOne({"poll_id" : req.body.poll_id}, {}, function(err, docs){
          if (err !== null){
            next(err);
          } else {
            res.send(docs);
          }
        });  
      } else {
        res.status(404);
      } 
    } 
  });

});

module.exports = router;
