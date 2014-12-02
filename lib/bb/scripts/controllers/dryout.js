'use strict';

angular.module('netLabApp').controller('DryOutCtrl', function ($scope) {

	$scope.Context = {
		BrixCutters: [
			{id: 2, name: 'Courtney Thorpe'},
			{id: 3, name: 'Glen Managh'},
			{id: 4, name: 'Joanne Burns'},
			{id: 5, name: 'Brad Stephens'},
			{id: 6, name: 'John Reeves'}
		],
		Container: {
			id: 1,
			name: 'Tray',
			size: 30,
			items: [
				{
					0: ['1231','4.5','24.32'],
					1: ['1234','4.5','24.32'],
					2: ['3446','4.5','24.32']
				},
				{
					0: ['8972','6.5','24.32'],
					1: ['8983','1.5','24.32'],
					2: ['7912','8.5','24.32']
				}
			]
		},
		Test: {
			ItemType: {
				id: 1,
				name: 'Fruit'
			},
			MeasureTypes: [
				'Boat No',
				'Boat Weight',
				'Boat Wet Weight',
				'Dry Weight',
				'Dry Matter %'
			],
			CaptureMeasures: [
				'Boat No',
				'Boat Weight',
				'Boat Wet Weight',
				'Dry Weight',
				'Dry Matter %'
			],
			Count: 90
		},
		SelectedCutter: null,
		SelectedContainer: 0
	};

	/**
	 * Switches the current container
	 * @return void
	 **/
	$scope.ShowContainer = function(index) {
		$scope.Context.SelectedContainer = index;
	};

	/**
	 * Calculates the total number of containers that need to be created based on the number of items for the entire test and the size of the container
	 * @return int Returns the total number of containers to be created
	 **/
	$scope.CalculateTotalContainers = function() {
		return ($scope.Context.Test.Count/$scope.Context.Container.size);
	};

	/**
	 * Creates x number of containers
	 * @return void
	 **/
	$scope.CreateContainerType = function(containersToCreate) {

		if (!isNaN(containersToCreate)) {
			for (var i = 0; i < containersToCreate; i++) {
				$scope.Context.Container.items.push({});
			}
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
		if ($scope.Context.Container.items.length > 0) {

			/* Calculate the difference between the number of containers we currently have and how many we should have */
			total_container_difference = total_containers - $scope.Context.Container.items.length;

			/* Check if the total container difference is greater than 0 */
			if (total_container_difference > 0) {
				/* Create the remaining number of containers */
				$scope.CreateContainerType(total_container_difference);
			}

		} else {
			/* We don't have any containers so we'll create all of them */
			$scope.CreateTrays(total_containers);
		}

	};

	$scope.SetupTest();

});
