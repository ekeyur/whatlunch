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
    templateUrl : 'addreview.html',
    controller : 'addreviewController'
  });
  $urlRouterProvider.otherwise('/addReview');
});

//Factory
app.factory('APIService',function($http){
	var service = {};

	service.getThings = function(pick){
		console.log(pick);
		var url = '/things/' + pick;
		return $http({
			method : 'GET',
			url : url,
			pick: pick,
		});
	};

  service.postReview = function(data){
    var url = '/postReview';
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

app.controller('addreviewController', function($scope,APIService) {
  APIService.getRestaurants().success(function(data){
    $scope.restaurantlist = data;
  });

  $scope.addReview = function(rating){
    let data = {restaurant_id : $scope.selectedRestaurant, stars : rating};
    APIService.postReview(data).success(function(data){
      console.log(data);
  });
  };

});
