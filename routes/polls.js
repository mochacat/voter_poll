var express = require('express');
var router = express.Router();

/* Count vote
 * 
 */
router.get('/vote', function(req, res){
    //req.connection.remoteAddress
    //find poll based on value
    //add vote
    //return results
    
    var db = req.db;
    var collection = db.get('voterpoll');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });

});
