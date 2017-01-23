var app = angular.module('whatlunch', ['ui.router','jkAngularRatingStars']);

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
    name : 'whatLunch',
    url : '/',
    templateUrl : 'whatLunch.html',
    controller : 'whatLunchController'
  });
  $urlRouterProvider.otherwise('/');
});

//Factory
app.factory('APIService',function($http){
	var service = {};

  service.postReview = function(data){
    var url = '/postReview';
    return $http({
      method : 'POST',
      url : url,
      data : data,
    });
  };

  service.postRestaurant = function(data){
    var url = 'postRestaurant';
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

//Controller for adding a review
app.controller('addReviewController', function($state,$scope,APIService) {
  APIService.getRestaurants().success(function(data){
    //Gets the list of all the restaurants
    $scope.restaurantlist = data;
    $scope.selectedRestaurant = data[1].id;
  });
  //Display the initial date of today in the dialog
  $scope.maxDate = new Date();
  $scope.addReview = function(){
    let data = {restaurant_id : $scope.selectedRestaurant.id, stars : parseInt($scope.rating), lastVisited : $scope.lastVisited};
    console.log($scope.rating);
    console.log(typeof($scope.rating));
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
    let rand = Math.floor(Math.random() * data.length);
    $scope.lunchReco = data[rand];
    console.log("Data Length: ",data.length)
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
