'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ApplicationDashboardCtrl
 * @description
 * # MainCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp').controller('ApplicationDashboardCtrl', function ($rootScope, $scope, $api, $http) {

	// Set <body> class of index.html
	$rootScope.bodylayout = 'fullscreen';

    var debug = function() {

    	$scope.Workstation.Name = 'TestWorkstation';
    	$scope.Workstation.Lab = $scope.Workstation.LabList[1];

    }

    $scope.setup = function() {

    	console.log($scope.Workstation);

    }


    // Function used to initially pull the available labs based on the logged in user

    var init = function() {
    	// TODO Update below to retrieve Labs when API requests are working.

    	$http.post($api.BaseUri + '/current_user/labs')
		.success(function(data, status, headers, config) {
				if (data.success) {

					console.log(data);
					
				} else {

					console.log(data);

				}
			})
			.error(function(data, status, headers, config) {
				console.log(data.message);
			});


		// Enabled for Debugging

		//if ($scope.Workstation.Debug == true) {
		//	debug();
		//}

    };

    init();

});
