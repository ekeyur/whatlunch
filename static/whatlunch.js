var app = angular.module('whatlunch', ['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){
  $stateProvider
  .state({
    name : 'addRestaurant',
    url : '/addRestaurant',
    templateUrl : 'addRestaurant.html',
    controller : 'addRestaurantController'
  });
  $urlRouterProvider.otherwise('/addRestaurant');
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
	return service;
});

//Controllers

app.controller('fabularController', function($scope, $timeout,$stateParams, $rootScope, APIService) {

});
