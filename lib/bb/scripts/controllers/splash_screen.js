'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:LoadingCtrl
 * @description
 * # LoadingCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('SplashScreenCtrl', function($scope, $timeout, $location) {
    	
    	//TODO: Add loading js

    	$timeout(function() {
    		$location.path("/login");
    	}, 10000);
    });
