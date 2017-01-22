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
  });
  //Display the initial date of today in the dialog
  $scope.maxDate = new Date();
  $scope.lastVisited = new Date();

  $scope.addReview = function(rating){
    let data = {restaurant_id : $scope.selectedRestaurant.id, stars : rating, lastVisited : $scope.lastVisited};
    APIService.postReview(data).success(function(data){
      console.log(data);
    });
    $state.go('whatLunch');
  };
});

//Controller for suggesting lunch options
app.controller('whatLunchController',function($scope,APIService){
  $scope.whatLunch = "ChiPOTle";
});


// Controller for Adding Restaurant
app.controller('addRestaurantController',function($state,$scope,APIService){
  $scope.postData = function(){
    let data = {name : $scope.name, address : $scope.address}
    APIService.postRestaurant(data).success(function(data){
    });

  };

});
