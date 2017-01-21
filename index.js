var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'whatlunch_db'
    // user: 'user-name',
    // password: 'user-password'
};

var db = pgp(cn);

app.use(express.static('static'));
app.use(bodyParser.json());

app.use(function authCheck(req,res,next){
  let uname = req.query.uname;
  let pass = req.query.pass;

  db.oneOrNone("select id,password from person where name = '$1'",uname)
  .then(function(data){
    console.log(data);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });

  // if(token in tokenobj){
  //   console.log("Token Check Happened");
  //   next();
  // }
  // console.log("login before you use this");
});


app.get('/getRestaurantList',function(request,response){
  db.any('select * from restaurant')
  .then(function(data){
    response.json(data['rows']);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });
});

app.get('/helloWorld',function(req,res){
  console.log("Hello World");
  res.send('Hello World');
});


app.post('/addRestaurant',function(request,response){
  let name = "Naan Stop";
  let address = "Buckhead";
  db.one("insert into restaurant (name,address) values ($1,$2)",[name,address])
  .then(function(data){
    response.send(data);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });
});

app.post('/reviewRestaurant',function(request,response){

});


app.listen('3001',function(){
  console.log("Server is running");
});
