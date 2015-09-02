var express = require('express');
var router = express.Router();

/* GET poll page. */
router.get('/', function(req, res, next) {
  var params = {};
  params.title = 'Would you rather?'; 

  var db = req.db;
  var polls = db.get('pollcollection');
  
  polls.findOne({},{},function(err,poll){
    if (err !== null){
      next(err);
    } else {
      params.poll_id = poll._id;
      params.answers = poll.answers;
      params.poll_user = poll.createdBy;
      
      res.render('index', params);
    }
  });
});

module.exports = router;
