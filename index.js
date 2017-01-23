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
// Get what lunch logic
app.get('/getWhatLunch',function(request,response){
  db.any("select restaurant.id,restaurant.name,restaurant.address from restaurant inner join (select restaurant.id from restaurant inner join person_reviews_restaurant on restaurant.id = person_reviews_restaurant.restaurant_id inner join person on person_reviews_restaurant.user_id = person.id where person_reviews_restaurant.last_visited < NOW() - INTERVAL '2 days' and person.id = $1 EXCEPT select restaurant_id from (select restaurant_id, avg(stars) from person_reviews_restaurant group by restaurant_id) as average where average.avg <=2 UNION select id from restaurant where id not in(select restaurant_id from person_reviews_restaurant)) as rid on restaurant.id = rid.id",1)
  .then(function(data){
    response.send(data);
    console.log(data);
  })
  .catch(function(err){
    console.log("Error: ",err.message);
  })
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
  var updateId;

  db.oneOrNone("select id from person_reviews_restaurant where user_id = $1 and restaurant_id = $2",[userid,restaurantid])
  .then(function(data){
    return db.one("update person_reviews_restaurant set stars = $1, last_visited = $2 where id = $3 returning id",[stars,lastVisited,data.id])
  })
  .catch(function(err){
    db.one("insert into person_reviews_restaurant (user_id,restaurant_id,stars,last_visited) values($1,$2,$3,$4) returning id",[userid,restaurantid,stars,lastVisited])
    console.log("Error", err.message);
  });
});

app.listen('3001',function(){
  console.log("Server is running");
});
