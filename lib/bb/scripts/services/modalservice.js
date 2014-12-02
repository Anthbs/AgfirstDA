'use strict';

/**
 * @ngdoc service
 * @name netLabApp.ModalService
 * @description
 * # ModalService
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('ModalService', function($q, $modal) {
        this.ShowUserInput = function(question) {
            var modalInstance = $modal.open({
                templateUrl: 'views/byotest/UserInput.html',
                controller: 'ModalInputCtrl',
                backdrop: 'static',
                size: 'lg',
                keyboard: false,
                resolve: {
                    question: function() {
                        return question;
                    }
                }
            });

            return modalInstance.result;
        }

        this.ShowResult = function(text, value) {
            var modalInstance = $modal.open({
                templateUrl: 'views/byotest/DisplayResult.html',
                controller: 'ModalResultCtrl',
                backdrop: 'static',
                size: 'lg',
                keyboard: false,
                resolve: {
                    text: function() {
                        return text;
                    },
                    value: function() {
                        if ($.isArray(value)) {
                            return JSON.stringify(value);
                        }
                        if (value != null) {
                            return value.toString();
                        }
                        return "";
                    }
                }
            });

            return modalInstance.result;
        }

        this.ShowChromameterWhiteTileCalibration = function() {
            var modalInstance = $modal.open({
                templateUrl: "views/byotest/chromameter_calibration.html",
                controller: 'ChromameterCalibrationCtrl',
                backdrop: 'static',
                size: 'lg',
                keyboard: false
            });

            return modalInstance.result;
        };

        this.ShowChromameterMultiTileCalibration = function() {
            var modalInstance = $modal.open({
                templateUrl: "views/byotest/chromameter_multi_calibration.html",
                controller: 'ChromameterMultiCalibrationCtrl',
                backdrop: 'static',
                size: 'lg',
                keyboard: false
            });

            return modalInstance.result;
        };
    });
