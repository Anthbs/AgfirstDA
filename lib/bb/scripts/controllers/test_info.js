'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:StationInfoCtrl
 * @description
 * # StationInfoCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('TestInfoCtrl', function($scope, Device, $state, $stateParams) {

        Device.GetDevices().then(function(devices) {
            $scope.Devices = devices;
        });

        $scope.Sample = {
            SampleID: $stateParams.sample_id
        };

        $scope.Math = window.Math;
        
        $scope.TestTypes = [
        	{
        		complete: true,
        		unavailable: false,
        		name: 'Bulk Weight',
                state: 'bulk_weight'
        	},
        	{
        		complete: false,
        		unavailable: false,
        		name: 'Fresh Weight',
                state: 'fresh_weight'
        	},
        	{
        		complete: false,
        		unavailable: false,
        		name: 'Pressure',
                state: 'pressure'
        	},
        	{
        		complete: false,
        		unavailable: true,
        		name: 'Colour',
                state: 'colour'
        	},
        	{
        		complete: false,
        		unavailable: false,
        		name: 'Dry Matter In',
                state: 'dryin'
        	},
        	{
        		complete: false,
        		unavailable: false,
        		name: 'Dry Matter Out',
                state: 'dryout'
        	},
        	{
        		complete: false,
        		unavailable: true,
        		name: 'Brix',
                state: 'brix'
        	}
        ];

        $scope.IsCurrent = function(testType) {
            return $state.includes(testType.state);
        }

        $scope.ChangeTest = function(testType) {
            $state.go(testType.state, { sample_id: $stateParams.sample_id });
        }
        
    });
