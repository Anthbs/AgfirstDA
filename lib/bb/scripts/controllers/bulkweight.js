'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:BulkweightctrlCtrl
 * @description
 * # BulkweightctrlCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('BulkWeightCtrl', function($rootScope, $scope, $state) {
        var TestType = 'BulkWeight';
        var sampleId = $state.params.sample_id;

        $scope.LoadPreviousData = function() {
            if ($rootScope.Measures != null && $rootScope.Measures[sampleId] != null && $rootScope.Measures[sampleId][TestType] != null) {
                $scope.weight = $scope.Measures[sampleId][TestType].weight;
                $scope.numfruit = $scope.Measures[sampleId][TestType].numfruit;
                $scope.numunder = $scope.Measures[sampleId][TestType].numunder;
                $scope.notes = $scope.Measures[sampleId][TestType].notes;
            };
        }

        $scope.next = function() {

            if ($rootScope.Measures == null) {
                $rootScope.Measures = {};
            }
            if($rootScope.Measures[sampleId] == null) {
                $rootScope.Measures[sampleId] = {};
            }

            $rootScope.Measures[sampleId][TestType] = {
                weight: $scope.weight,
                numfruit: $scope.numfruit,
                numunder: $scope.numunder,
                notes: $scope.notes
            };

            $state.go('fresh_weight', {
                sample_id: sampleId
            });
        };

        $scope.LoadPreviousData();
    });
