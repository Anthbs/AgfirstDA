'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:SampleLoginCtrl
 * @description
 * # SampleLoginCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp').controller('SampleLoginCtrl', function ($scope,$print) {
  
	$scope.Print = function(){			
		$print.barcode($scope.sample,"Dymo");				
	};

});
