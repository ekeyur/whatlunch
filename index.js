const express = require('express');
const app = express();
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const uuidV1 = require('uuid/v1');
require('dotenv').config();
const cn = {
    // host: 'localhost',
    // port: 5432,
    // database: 'whatlunch_db'
    // user: 'user-name',
    // password: 'user-password'
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS

};
const options = {
    promiseLib: bluebird

};
const pgp = require('pg-promise')(options);
const db = pgp(cn);
var randomToken = uuidV1();

app.use(express.static('static'));
app.use(bodyParser.json());

//setting port
app.set('port', (process.env.PORT || 3001));

//SignUp
app.post('/signup', function(request, response){
  var userdata = request.body;
  console.log(userdata);
  if(userdata.password === userdata.password2) {
    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(userdata.password, salt, function(err, hash) {
        db.any("insert into person (uname, password) values ($1,$2) returning id",[userdata.username,hash])
        .then(function(data){
          response.send(data);
          console.log("Added User with id:",data.id);
        })
        .catch(function(err){
          console.log("Error", err.stack);
        });
    });
  });
}
  else
  {
    response.status(400);
    response.json("passwords don't match");
  }
});

//Login
app.post('/login', function(request, response) {
   var userdata = request.body;
   console.log("XXXXXXXXXX", userdata);
   db.oneOrNone("select password from person where uname = $1",userdata.username)
   .then(function(data){
     console.log("PassData",data);
     return [userdata.username, bcrypt.compare(userdata.password, data.password)];
     // returns true of false
   })
   .spread(function(user, boolean) {
     console.log("user",user);
     console.log("boolean",boolean);
     if (boolean === true) {
       console.log("Login Success");
       user.token = randomToken;
       //return user.save()
       db.one("update person set token = $1 where uname = $2 returning id,uname,token",[randomToken,user])
       .then(function(data) {
         response.send(data);
         console.log("Token added to id: ",data.id);
       })
       .catch(function(err){
         console.log('Token ERROR: ', err.message);
       });
     }
     else {
       console.log("Login Failed");
       response.status(401);
       response.send('Login Failed');
     }
   });
 });

 //Get list of all the restaurants for reviewing purposes
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

 function auth(request, response, next) {
   //verify auth token
   let token = request.query.token;
   let id = request.query.userid;
   console.log("USERID",id);
   console.log("TOKEN",token);
   if (!token) {
     response.status(401);
     response.json({error: "You are not logged in"});
     return;
   }
   db.one("select token from person where id = $1",id)
   .then(function(user){
     console.log("k", token);
     console.log("k2", user.token);
     console.log('k3', user);
     if(user.token === token) {
       next();
     } else {
       response.status(401);
       response.json({error: "You are not logged in"});
     }
 });
 }

//Add a restaurant to the Database. Do not need auth for this.
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



// Get what lunch query excludes any restaurant that has a avg review <= 2
// excludes any restaurant that was visited yesterday
// inludes all non reviewed restaurants
app.get('/getWhatLunch',function(request,response){
  let id = request.query.userid;
  console.log("Printing ID for whatLunch GET Request",id);

  //Sub query selects
  // Select all Restaurants
  // EXCEPT
  // Restaurants visited yesterday by the user
  // EXCEPT
  // Restaurants where average stars is < 2
  if (id){
    console.log("Id was supplied",id);
    db.any(`
      select
        restaurant.name,
        restaurant.id,
        restaurant.address
      from
      restaurant inner join
      (
        select
          restaurant.id
        from
          restaurant

        EXCEPT

        select
          restaurant_id
        from
          person_reviews_restaurant
          where
            user_id = $1 and last_visited > NOW() - INTERVAL '2 days'

        EXCEPT

        select
          restaurant_id
        from
          (
            select
              restaurant_id,
              avg(stars)
            from
              person_reviews_restaurant
              group by restaurant_id
          ) as average where average.avg <=2)
            as rid
            on restaurant.id = rid.id`,id
      )
    .then(function(data){
      response.send(data);
      console.log(data);
    })
    .catch(function(err){
      console.log("Error: ",err.message);
    });
  } else {
    console.log("ID was not supplied");
    db.any(`
      select
        restaurant.name,
        restaurant.id,
        restaurant.address
      from
      restaurant inner join
      (
        select
          restaurant.id
        from
          restaurant

        EXCEPT

        select
          restaurant_id
        from
          person_reviews_restaurant
          where
            user_id = $1 and last_visited > NOW() - INTERVAL '2 days'

        EXCEPT

        select
          restaurant_id
        from
          (
            select
              restaurant_id,
              avg(stars)
            from
              person_reviews_restaurant
              group by restaurant_id
          ) as average where average.avg <=2)
            as rid
            on restaurant.id = rid.id`,5
      )
    .then(function(data){
      response.send(data);
      console.log(data);
    })
    .catch(function(err){
      console.log("Error: ",err.message);
    });
  }

});

// Every API below requires authorization
app.use(auth);

// Post a review for the restaurant. If the user has already reviewed the restaurant, then update the review.
app.post('/postReview',function(req,res){
  let userid = req.query.userid || 6;
  let restaurantid = req.body.restaurant_id;
  let lastVisited = req.body.lastVisited;
  let stars = req.body.stars;
  db.oneOrNone("select id from person_reviews_restaurant where user_id = $1 and restaurant_id = $2",[userid,restaurantid])
  .then(function(data){
    return db.one("update person_reviews_restaurant set stars = $1, last_visited = $2 where id = $3 returning id",[stars,lastVisited,data.id])
  })
  .catch(function(err){
    db.one("insert into person_reviews_restaurant (user_id,restaurant_id,stars,last_visited) values($1,$2,$3,$4) returning id",[userid,restaurantid,stars,lastVisited])
    .then(function(data){
      console.log("Review Posted for",data.id);
    })
    .catch(function(data){

    });
    console.log("Error", err.message);
  });
});

app.listen(app.get('port'),function(){
  console.log("Server is running on port ",app.get('port'));
});
