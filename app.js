const express = require('express');
const path = require ('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Article = require('./models/article')

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://10.7.0.3:27107/data/db');
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});

//check for DB errors
db.on('error', function(err) {
  console.log(err);
});
//init app
const app = express();

//Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set public folder
//app.use(express.static(path.join(__dirname, 'public')));
//home route
app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

//add route
app.get('/articles/add', function(req, res) {
  res.render('add_article',{
    title:'Add Article'
  });
});

//Add submit POST
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//Server start
app.listen(3005, function () {
console.log ('server started on port 3005*')
});
