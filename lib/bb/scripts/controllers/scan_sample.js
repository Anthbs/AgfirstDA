'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp').controller('ScanSampleCtrl', function($scope, Device, $state, $api) {

    $scope.sample = {
        id: ''
    };

    $scope.$root.$on('ScanEvent', function(event, sample_id) {
        $scope.GetSampleThenProceed(sample_id);
    });

    $scope.next = function() {
        if ($scope.sample.id != null && !isNaN($scope.sample.id)) {
            $scope.GetSampleThenProceed($scope.sample.id);
        }
    };

    $scope.GetSampleThenProceed = function(sampleNumber) {
        $api.Post($api.BaseUri + '/samples/all/' + sampleNumber)
            .then(
                function(result){
                    $state.go('bulk_weight', { sample_id: sampleNumber });
                },
                function(result){
                    console.log(result);
                }
            );
    };

});