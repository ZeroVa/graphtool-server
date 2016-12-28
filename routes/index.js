var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/memberslist', function(req, res) {
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/graphtooldb';
  MongoClient.connect(url, function (err, db) {
    if(err) {
      console.log('Could not connect to server.');
    }
    else {
      console.log('Connected!');

      var collection = db.collection('members');

      collection.find({}).toArray(function(err, result){
        if(err) {
          res.send(err);
        }
        else if (result.length) {
          res.render('memberslist', {
            "members": result
          });
        }
        else {
          res.send('No documents found')
        }
        db.close();
      })
    }
  })
});

router.get('/newmember', function(req, res) {
  res.render('newmember', {title: 'Add Member'})
});

router.post('/member', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/graphtooldb';

  MongoClient.connect(url, function (err, db) {
    if(err) { console.log('unable to connect', err); return;}

    console.log('Connected!');

    var collection = db.collection('members');

    var newOne = {name: req.body.name};
    collection.insert([newOne], function(err, result) {
      if (err) {console.log(err); db.close(); return;}
      res.redirect('memberslist');
      db.close();
    });
  });
});

module.exports = router;
