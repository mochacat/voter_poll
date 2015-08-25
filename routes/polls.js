var express = require('express');
var router = express.Router();

/*
 * GET default poll
 */
router.get('/poll', function(req, res){
    //TODO specify one poll or all polls
    /*var db = req.db;
    var collection = db.get('voterpoll');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });*/
});
