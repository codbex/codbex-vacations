angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-vacations.entities.LeaveBalance';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsEmployee = params.optionsEmployee;
			$scope.optionsType = params.optionsType;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Employee !== undefined) {
				filter.$filter.equals.Employee = entity.Employee;
			}
			if (entity.Year) {
				filter.$filter.contains.Year = entity.Year;
			}
			if (entity.Type !== undefined) {
				filter.$filter.equals.Type = entity.Type;
			}
			if (entity.Granted !== undefined) {
				filter.$filter.equals.Granted = entity.Granted;
			}
			if (entity.Used !== undefined) {
				filter.$filter.equals.Used = entity.Used;
			}
			if (entity.Balance !== undefined) {
				filter.$filter.equals.Balance = entity.Balance;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("LeaveBalance-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);