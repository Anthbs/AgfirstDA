(function() {
    angular.module("app.controllers").controller("BYOTestCtrl", function ($scope, $controller, DeviceService) {
    	
    	$controller('TestsCtrl as Tests', {$scope: $scope});
	    $controller('ActionsCtrl as Actions', {$scope: $scope});
	    $controller('DisplayCtrl as Display', {$scope: $scope, Tests: $scope.Tests});

	    
	    DeviceService.GetConnectedDevices().then(function(devices) { 
    		var res = [];
    		for(var key in devices) {
    			res.push(devices[key].Name);
    		}

    		$scope.AvaliableDevices = res;
    	});

	    
    	$scope.Tests.Functions.LoadAllTests();
    	$scope.Actions.Functions.LoadAllActions();
    });
})();
