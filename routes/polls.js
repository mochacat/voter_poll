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
  var voted = true;
  votes.find({ 'ip' : req.ip, 'poll_id' : req.body.poll_id }, {}, function (e,result) {
    
    if (result.length  == 0){
      //never voted before
      voted = false;

      //tally vote for the poll
      polls.update(
        { '_id' : ObjectId(req.body.poll_id) , 'answers.answer' : req.body.vote},
        { $inc : { 'answers.$.vote' : 1 } }, 
        { upsert : true }    
      );

      //create vote for ip
      votes.insert({
        'date' : new Date(),
        'poll_id' : req.body.poll_id,
        'answer' : req.body.vote,
        'ip' : req.ip
      });
      
    }
    //send back poll stats
    polls.find({ '_id' : ObjectId(req.body.poll_id) }, {}, function(err, docs){
      if (err !== null){
        next(err);
      } else {
        var params = {
          voted: voted,
          data : docs
        };
        res.send(params);
      }
    });
  });

});

/* Create a new poll
 *
 */
router.post('/create', function(req, res, next){
  var db = req.db;
  var polls = db.get('pollcollection');

  console.log(req.body);
  var answer1 = req.body.answer1;
  var answer2 = req.body.answer2;

  //Form validation
  var emptyMsg = 'Both options required';
  var charMsg = '10 to 140 characters required';

  req.checkBody('answer1', emptyMsg).notEmpty();
  req.checkBody('answer1', charMsg).len(10,140);
  req.checkBody('answer2', emptyMsg).notEmpty();
  req.checkBody('answer2', charMsg).len(10,140);
  
  var errors = req.validationErrors();
  if (errors){
    res.send({error: true, errors: errors});
  } else {
    //create new poll
    var newPoll = {
      creationDate : new Date(),
      answers : [
        { answer : answer1, vote : 0 },
        { answer : answer2, vote : 0 }
      ],
      createdBy : 'anonymous', //TODO add users
    }

    polls.insert(newPoll);
    res.send({error:false});
  }
});

/* Pull up next poll (random)
 *
 */
router.post('/poll', function(req, res, next){

});
module.exports = router;
