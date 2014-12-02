'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:LoadingCtrl
 * @description
 * # LoadingCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('LoadingCtrl', function($scope, $timeout, $state) {
    	
    	//TODO: Add loading js

    	$timeout(function() {
    		$state.go("login");
    	}, 5000);
    });
