'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ModalinputCtrl
 * @description
 * # ModalinputCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('ModalInputCtrl', function($scope, $modalInstance, question) {
        $scope.question = question;
        $scope.data = {
            val: ""
        };

        $scope.ok = function() {
            if ($scope.data.val != "" && !isNaN($scope.data.val)) {
                $scope.data.val = Number($scope.data.val);
            }
            $modalInstance.close($scope.data.val);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    });
