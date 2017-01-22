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

//Add a restaurant to the Database
app.post('/postRestaurant',function(request,response){
  let name = request.body.name;
  let address = request.body.address;
  db.one("insert into restaurant (name,address) values($1,$2)",[name,address])
  .then(function(data){
    console.log("Restaurant Added:",data);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });
});


//Get list of all the restaurants
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
  let lastVisited = req.body.lastVisited;
  let stars = req.body.stars;

  db.one("insert into person_reviews_restaurant (user_id,restaurant_id,stars,last_visited) values($1,$2,$3,$4)",[userid,restaurantid,stars,lastVisited])
  .then(function(data){
    console.log("Review Added");
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  });
});



app.listen('3001',function(){
  console.log("Server is running");
});
