'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp').controller('LoginCtrl', function ($rootScope, $scope, $state, $api) {

	$rootScope.bodylayout = 'fullscreen';

	$scope.Context = {
		User: {},
		UserList: [
			{
				id: 1,
				name: 'Administrator' //0167
			},
			{
				id: 2,
				name: 'Courtney Thorpe'
			},
			{
				id: 3,
				name: 'Glen Managh'
			},
			{
				id: 4,
				name: 'Joanne Burns'
			},
			{
				id: 5,
				name: 'Brad Stephens'
			},
			{
				id: 6,
				name: 'John Reeves'
			}
		],
		Message: null,
		Attempts: 0,
		IsSimpleLogin: true
	};
	
	$scope.login = function () {

		$api.Post($api.BaseUri + '/auth/login', $scope.Context.User)
			.then(
				function(result){
					if (result.success) {
						$scope.setUser(result.message);
						$state.go("dashboard");
					} else {
						$scope.Context.Attempts++;
						$scope.Context.Message = data.message;
					}
				},
				function(result){
					$scope.Context.Message = "An error occurred while trying to login";
				}
			);
	};

	$scope.setUser = function(user_id) {

		if ($rootScope.Context == null) {
			$rootScope.Context = {
				User: {}
			};
		}

		if (user_id != null && !isNaN(user_id)) {
			$api.Post($api.BaseUri + '/current_user')
				.then(
					function(result){
						if (result.success) {
							$rootScope.Context.User = result.message;
						}
					},
					function(result){
						$scope.Context.Message = "An error occurred while trying to retrieve your user details";
					}
				);
		}

	};

	$scope.configure = function () {

		$http.post($api.BaseUri + '/auth/login', $scope.Context.User)
			.success(function(data, status, headers, config) {
				if (data.success) {

					$scope.Context.Attempts = 0;
					$scope.Context.Message = null;

					$state.go("workstation_configure");

				} else {

					$scope.Context.Attempts++;
					$scope.Context.Message = data.message;
				}

			})
			.error(function(data, status, headers, config) {
				$scope.Context.Message = data.message;
			});
	};

});
