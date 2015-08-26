var express = require('express');
var router = express.Router();

var params = {};

/* GET poll page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  
  var poll_collection = db.get('pollcollection');
  poll_collection.findOne({},{},function(err,poll){
    if (err !== null){
      next(err);
    } else {
      // TODO create template for the poll
      params.poll_title = poll.title;
      params.answers = poll.answers;
      params.poll_user = poll.createdBy;
    }
  });
  params.title = 'Voting Poll';
  res.render('index', params);
});

module.exports = router;
