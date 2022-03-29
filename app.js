var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
var pug = require('pug');
var mongodb = require('mongodb');
const req = require('express/lib/request');
var MongoClient = mongodb.MongoClient;
// var objectID=mongodb.objectID;
app.set('view engine', 'pug');
app.get('/unicornshome', function (req, res) {
    var connection = new MongoClient('mongodb://127.0.0.1:27017');

    connection.connect(function (err, con) {
        if (err) {
            console.log('connection err::', err);
        } else {
            var db = con.db('walintern');
            db.collection('unicorn')
                .find()
                .toArray(function (err, data) {
                    if (err) {
                        console.log('data error in fectching');
                    }
                    res.render('table', { unicorns: data });
                    con.close();
                });
        }
    });
});
app.get('/deleteitem/:id', function (req, res) {
    var connection = new MongoClient('mongodb://127.0.0.1:27017');
    console.log(req.params.id);
    connection.connect(function (err, con) {
        if (err) {
            console.log('connection err::', err);
        } else {
            var db = con.db('walintern');
            db.collection('unicorn').deleteOne(
                { _id: new mongodb.ObjectID(req.params.id) },
                function (err, data) {
                    if (err) {
                        console.log('data error in delittion');
                    }
                    // console.log(data);
                    // res.render("table",{unicorns:data});
                    res.redirect('/unicornshome');
                    con.close();
                }
            );
        }
    });
});
app.get('/insertdoc', function (req, res) {
    res.sendFile(__dirname + '/add_document.html');
});
app.post('/add_document', function (req, res) {
    // var myobj=JSON.parse(JSON.stringify(req.body));
    console.log('data from adddoc form...');
    console.log(req.body);
    var connection = new MongoClient('mongodb://127.0.0.1:27017');
    connection.connect(function (err, con) {
        if (err) {
            console.log('connection err::', err);
        } else {
            var db = con.db('walintern');
            db.collection('unicorn').insertOne(
                {
                    name: req.body.name,
                    dob: req.body.dob,
                    loves: req.body.loves,
                    weight: req.body.weight,
                    gender: req.body.gender,
                    vampires: req.body.vampires,
                },
                function (err, data) {
                    if (err) {
                        console.log('data error in delittion');
                    }
                    // console.log(myobj);
                    res.redirect('/unicornshome');
                    con.close();
                }
            );
        }
    });
});
app.get('/updatedoc/:id', function (req, res) {
    var connection = new MongoClient('mongodb://127.0.0.1:27017');

    connection.connect(function (err, con) {
        if (err) {
            console.log('connection err::', err);
        } else {
            var db = con.db('walintern');
            db.collection('unicorn')
                .find({ _id: new mongodb.ObjectID(req.params.id) })
                .toArray(function (err, data) {
                    if (err) {
                        console.log('data error in fectching');
                    }
                    res.render('display', { unicorns: data });
                    con.close();
                });
        }
    });
});
app.post('/updateitem', function (req, res) {
    console.log(req.body);
    var connection = new MongoClient('mongodb://127.0.0.1:27017');
    connection.connect(function (err, con) {
        if (err) {
            console.log('connection err::', err);
        } else {
            var db = con.db('walintern');
            var t = req.body.loves.split(',');
            db.collection('unicorn').updateOne(
                { name: req.body.name },
                {
                    $set: {
                        dob: req.body.dob,
                        loves: t,
                        weight: req.body.weight,
                        gender: req.body.gender,
                        vampires: req.body.vampires,
                    },
                },
                function (err, data) {
                    if (err) {
                        console.log('data error in delittion');
                    }
                    console.log('update route called');
                    res.redirect('/unicornshome');
                    con.close();
                }
            );
        }
    });
});
app.listen(3400, function (req, res) {
    console.log('I am running from server 3400');
});
