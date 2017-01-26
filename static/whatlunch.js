var app = angular.module('whatlunch', ['ngCookies','ui.router','jkAngularRatingStars']);

// States
app.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state({
    name : 'addRestaurant',
    url : '/addRestaurant',
    templateUrl : 'addRestaurant.html',
    controller : 'addRestaurantController'
  })
  .state({
    name : 'addReview',
    url : '/addReview',
    templateUrl : 'addReview.html',
    controller : 'addReviewController'
  })
  .state({
   name: 'signup',
   url: '/signup',
   templateUrl: 'signup.html',
   controller: 'signupController'
 })
 .state({
    name: 'login',
    url: '/login',
    templateUrl: 'login.html',
    controller: 'loginController'
  })
  .state({
    name : 'whatLunch',
    url : '/',
    templateUrl : 'whatLunch.html',
    controller : 'whatLunchController'
  });
  $urlRouterProvider.otherwise('/');
});

//Factory
app.factory('APIService',function($http,$cookies,$rootScope){
	let service = {};

  $rootScope.cookieData = null;
  $rootScope.cookieData = $cookies.getObject('cookieData');
  console.log("Printing initial cookie", $rootScope.cookieData);

  if ($rootScope.cookieData) {
  $rootScope.auth = $rootScope.cookieData.token;
  $rootScope.username = $rootScope.cookieData.username;
  $rootScope.id = $rootScope.cookieData.username;

  console.log("Auth", $rootScope.auth);
  console.log("Username", $rootScope.username);
  console.log("Id", $rootScope.id);

  }

  $rootScope.logout = function(){
    $cookies.remove('cookieData');
    $rootScope.cookieData = null;
    $rootScope.id = null;
    $rootScope.auth = null;
    $rootScope.username = null;
  };



  service.postReview = function(data){
    let url = '/postReview';
    return $http({
      method : 'POST',
      url : url,
      data : data,
      params: {userid: $rootScope.id, token: $rootScope.auth}
    });
  };

  service.signup = function(userinfo) {
   return $http ({
     method: 'POST',
     url: '/signup',
     data: userinfo
   });
 };

 service.login = function(userdata) {
   return $http ({
     method: 'POST',
     url: '/login',
     data: userdata
   });
 };

  service.postRestaurant = function(data){
    let url = 'postRestaurant';
    return $http({
      method : 'POST',
      url : url,
      data : data,
    });
  };

  service.getWhatLunch = function(){
    let url = '/getWhatLunch';
    return $http({
      method : 'GET',
      url : url,
      params: {userid: $rootScope.id, token: $rootScope.auth}
    });
  };

  service.getRestaurants = function(){
    let url = '/getRestaurantList';
    return $http({
      method : 'GET',
      url : url,
    });
  };
	return service;
});

//Controllers

//SignUpController
app.controller('signupController', function($timeout, $scope, APIService, $state){
  $scope.signUp = function() {
    var userinfo = {
      username: $scope.username,
      password: $scope.password,
      password2: $scope.password2
    };
    APIService.signup(userinfo)
    .success(function(data) {
      console.log("YAY", data);
      $state.go('login');
    })
    .error(function(data){
      console.log("failed");
      $scope.failedPassMatch = true;
      $timeout(function(){$scope.failedPassMatch = false;}, 2500);
    });
  };
});

//Login Controller
app.controller('loginController', function($scope, APIService, $state, $cookies, $rootScope, $timeout) {
  $scope.login = function(){
    loginInfo = {
      username: $scope.username,
      password: $scope.password
    };
    APIService.login(loginInfo)
    .error(function(data){
      console.log("failed");
      $scope.loginfailed = true;
      $timeout(function(){$scope.loginfailed = false;}, 2500);
    })
    .success(function(data){
      console.log(data);
      $cookies.putObject('cookieData', data);
      console.log("ADDED COOKIE");
      $rootScope.username = data.uname;
      $rootScope.id = data.id;
      $rootScope.auth = data.token;
      console.log('Hello', $rootScope.username);
      $state.go('whatLunch');
    });
  };
});

//Controller for adding a review
app.controller('addReviewController', function($state,$scope,APIService) {
  APIService.getRestaurants().success(function(data){
    //Gets the list of all the restaurants
    $scope.restaurantlist = data;
    // $scope.selectedRestaurant = data[1].id;

  });
  //maxDate is needed becuase user should not be able to input date after today.How can he review a restaurant if he hasn't been there.
  $scope.maxDate = new Date();
  $scope.addReview = function(){
    let data = {restaurant_id : $scope.selectedRestaurant.id, stars : parseInt($scope.rating), lastVisited : $scope.lastVisited};
    APIService.postReview(data).success(function(data){
      console.log(data);
    });
    $state.go('whatLunch');
  };
});

//Controller for suggesting lunch options
app.controller('whatLunchController',function($scope,APIService){
  let whatArray = [];
  APIService.getWhatLunch().success(function(data){
    let random = Math.floor(Math.random() * data.length);
    $scope.lunchReco = data[random];
    console.log("Data Recommentdation: ",$scope.lunchReco);
  });
});


// Controller for Adding Restaurant
app.controller('addRestaurantController',function($state,$scope,APIService){
  $scope.postData = function(){
    let data = {name : $scope.name, address : $scope.address}
    APIService.postRestaurant(data).success(function(data){
    });
    $state.go('whatLunch');
  };

});
