'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:FruitcaptureCtrl
 * @description
 * # FruitcaptureCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
	.controller('FreshWeightCtrl', function($scope, $state, $stateParams, Device) {
		
	var TestType = 'FreshWeight';
    var Sample_Id = $state.params.sample_id;

    $scope.Context = {
        ContainerType: {
            id: 1,
            name: 'Tray',
            size: 30
        },
        Test: {
            ItemType: {
                id: 1,
                name: 'Fruit'
            },
            MeasureTypes: [
                'Weight'
            ],
            CaptureMeasures: [
                'Weight'
            ],
            Containers: [],
            Count: 90
        },
        SelectedCutter: null,
        SelectedContainer: 0,
        SelectedTestItem: 0
    };

    /**
     * Gets the current container
     * @return int
     **/
    $scope.GetCurrentContainer = function() {
        return $scope.Context.SelectedContainer;
    };

    /**
     * Sets the current container
     * @return void
     **/
    $scope.SetCurrentContainer = function(index) {
        $scope.Context.SelectedTestItem = 0;
        $scope.Context.SelectedContainer = index;
    };

    $scope.GetCurrentContainerItem = function(index) {
        return $scope.GetCurrentContainerItems().items[index];
    }

    $scope.SetCurrentContainerItem = function(index) {

        var containerIndex = Math.floor(index / $scope.GetContainerTypeSize());
        var itemIndex = Math.floor(index % $scope.GetContainerTypeSize());

        $scope.SetCurrentContainer(containerIndex);
        $scope.Context.SelectedTestItem = itemIndex;

    };

    $scope.GetCurrentContainerItems = function() {
        return $scope.GetTestContainers()[$scope.GetCurrentContainer()];
    };

    $scope.GetContainerTypeName = function() {
        return $scope.Context.ContainerType.name;
    };

    $scope.GetContainerTypeSize = function() {
        return $scope.Context.ContainerType.size;
    };

    $scope.GetTestContainers = function() {
        return $scope.Context.Test.Containers;
    };

    $scope.GetTestItemTypeName = function() {
        return $scope.Context.Test.ItemType.name;
    };

    $scope.GetTestItemCount = function() {
        return $scope.Context.Test.Count;
    };

    $scope.GetTestMeasureTypes = function() {
        return $scope.Context.Test.MeasureTypes;
    };

    $scope.GetTestCaptureMeasures = function() {
        return $scope.Context.Test.CaptureMeasures;
    };

    /**
     * Calculates the total number of containers that need to be created based on the number of items for the entire test and the size of the container
     * @return int Returns the total number of containers to be created
     **/
    $scope.CalculateTotalContainers = function() {
        return ($scope.GetTestItemCount() / $scope.GetContainerTypeSize());
    };

    /**
     * Creates x number of containers
     * @return void
     **/
    $scope.CreateContainerType = function(containersToCreate) {

        if (!isNaN(containersToCreate)) {
            for (var i = 0; i < containersToCreate; i++) {
                $scope.GetTestContainers().push({
                    items: []
                });
            }
        }

    };

    /**
     * Get a reading from a specific device
     * @return mixed
     **/
    $scope.MeasurementReceived = function(result) {
        if (result.success == true) {

            var currentItemIndex = $scope.Context.SelectedTestItem;
            var currentItemObject = $scope.GetCurrentContainerItem(currentItemIndex);

            if (currentItemObject == null) {
                currentItemObject = [];
                $scope.GetCurrentContainerItems().items[currentItemIndex] = currentItemObject; //Update the object with ref
            } else if (currentItemObject.length == $scope.GetTestCaptureMeasures().length) {
                $scope.SetCurrentContainerItem((currentItemIndex + ($scope.GetContainerTypeSize() * $scope.GetCurrentContainer()) + 1));
                $scope.MeasurementReceived(result);
            }

            for (var i = 0; i < $scope.GetTestCaptureMeasures().length; i++) {
                if (currentItemObject[i] == null) {
                    currentItemObject[i] = result.measure.value;
                    break;
                }
            }
        }

    };

    $scope.TestProcess = function() {

        var current_container = $scope.GetTestContainers()[$scope.GetCurrentContainer()];

        if (current_container.items.length < $scope.GetContainerTypeSize()) {
            Device.GetValueOpen('Scale', $scope.MeasurementReceived);
        }

    };

    /**
     * Sets up the brix test type
     * @return void
     **/
    $scope.SetupTest = function() {

        /* Get total number of containers to be created */
        var total_containers = $scope.CalculateTotalContainers();
        var total_container_difference = 0;

        /* Check if we already have any containers */
        if ($scope.GetTestContainers().length > 0) {

            /* Calculate the difference between the number of containers we currently have and how many we should have */
            total_container_difference = total_containers - $scope.GetTestContainers().length;

            /* Check if the total container difference is greater than 0 */
            if (total_container_difference > 0) {
                /* Create the remaining number of containers */
                $scope.CreateContainerType(total_container_difference);
            }

        } else {
            /* We don't have any containers so we'll create all of them */
            $scope.CreateContainerType(total_containers);
        }

        $scope.TestProcess();

    };

    $scope.LoadPreviousData = function() {
        if ($rootScope.Measures != null && $rootScope.Measures[Sample_Id] != null && $rootScope.Measures[Sample_Id][TestType] != null) {
            $scope.Context = $rootScope.Measures[Sample_Id][TestType];
        } else {
            $scope.SetupTest();
        }
    }

    $scope.FinishTest = function() {
        //Calc Outliers - TODO
        if ($rootScope.Measures == null) {
            $rootScope.Measures = {};
        }
        if ($rootScope.Measures[Sample_Id] == null) {
            $rootScope.Measures[Sample_Id] = {};
        }

        $rootScope.Measures[Sample_Id][TestType] = $scope.Context;

        $state.go('dryin', {
            sample_id: Sample_Id
        });
    }

    $scope.LoadPreviousData();
	});
