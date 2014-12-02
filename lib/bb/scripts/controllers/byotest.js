'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ByotestCtrl
 * @description
 * # ByotestCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
  .controller('BYOTestCtrl', function ($scope, $controller, Device) {
    $controller('TestsCtrl as Tests', {$scope: $scope});
	    $controller('ActionsCtrl as Actions', {$scope: $scope});
	    $controller('DisplayCtrl as Display', {$scope: $scope, Tests: $scope.Tests});

	    
	    Device.GetDevices().then(function(devices) { 
    		var res = [];
    		for(var key in devices) {
    			res.push(devices[key].Name);
    		}

    		$scope.AvaliableDevices = res;
    	});

	    
    	$scope.Tests.Functions.LoadAllTests();
    	$scope.Actions.Functions.LoadAllActions();
  });
