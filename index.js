const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'whatlunch_db'
    // user: 'user-name',
    // password: 'user-password'
};

const db = pgp(cn);

app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/getRestaurantList',function(request,response){
  db.any('select * from restaurant')
  .then(function(data){
    response.send(data);
    console.log(data);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });
});

// Just to check postMan was working
app.get('/helloWorld',function(req,res){
  console.log("Hello World");
  res.send('Hello World');
});

// Post a review for the restaurant
app.post('/postReview',function(req,res){
  let userid = 1;
  let restaurantid = req.body.restaurant_id;
  let stars = req.body.stars;

  console.log("fasdfasdfasd",restaurantid);
  console.log("stars: ", stars);

  db.one("insert into person_reviews_restaurant (user_id,restaurant_id,stars) values($1,$2,$3)",[userid,restaurantid,stars])
  .then(function(data){
    response.send(data);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });
});

// Adds restaurant to the database
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

// Reviews a restaurant
app.post('/reviewRestaurant',function(request,response){


});


app.listen('3001',function(){
  console.log("Server is running");
});
